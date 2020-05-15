import Dexie from 'dexie';
import errorHandler from './errorHandler';
import FileObj from './FileObj';
import {exportDB, importInto} from "dexie-export-import";

const localDB = new Dexie('user_dbv4');
localDB.version(1).stores({
    appData: 'ref',
    files: 'ref',
    lastImport: 'ref'
});

async function importData(file, importName) {
    try {
        let name = importName || '';
        await importInto(localDB, file, {
            acceptMissingTables: true,
            acceptVersionDiff: true,
            acceptNameDiff: true,
            acceptChangedPrimaryKey: true,
            clearTablesBeforeImport: true
        });
        await localDB.lastImport.put({ref: 0, name});
        return true
    }
    catch (e) {
        errorHandler(e);
        return false 
    }
}

async function exportData(name) {
    try {
        const data = await exportDB(localDB);
        const dataText = await data.text();
        const wrapper = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <link rel="icon" href="https://chingu-voyages.github.io/v18-geckos-team-02/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Proza+Libre:wght@400;500;600;700&display=swap" rel="stylesheet" defer>
            <title>Wavy</title>
          </head>
          <body>
            <h1>Wavy</h1>
            <p>Please wait to be redirected</p>
            <p>If nothing is happening please follow this <a href=https://chingu-voyages.github.io/v18-geckos-team-02/import?${name}">link</a></p>
            <script>window.location = "https://chingu-voyages.github.io/v18-geckos-team-02/import?${name}";</script>
          </body>
          <!--start---${dataText}---end-->
        </html>`
        const blob = await new Blob([wrapper], {type: 'text/html'});
        return blob
    }
    catch (e) {
        errorHandler(e);
        return e
    }
}

async function writeFile(ref, file) {
    try {
        const data = await file.data;
        await localDB.files.add({ref, data: {blob: data, type: file.type}});
        return true
    }
    catch (e) {
        if (e.message === "Key already exists in the object store.") {
            const duplicate = true; // TODO make hash comparision function
            if (!duplicate) {
                await writeFile(ref+'d', file);
                return true
            }
        }
        else {
            errorHandler(e);
        }
    }
}

async function readFile(ref) {
    try {
        let dataObj = await localDB.files.get(ref);
        if (!dataObj) {
            throw new Error(`Could not get data for ref: ${ref} !`)
        }
        return new Blob([dataObj.data.blob], {type : dataObj.data.type})
    }
    catch (e) {
        errorHandler(e);
    }
}
async function readAppData() {
    try {
        let appData = await localDB.appData.get(0);
        let output = false;
        if (appData) {
            output = JSON.parse(appData.data);
            const fileObjs = Object.values(output.fileObjs).map(data => new FileObj({...data}));
            output.fileObjs = {};
            fileObjs.forEach(fileObj => output.fileObjs[fileObj.uid] = fileObj);
        }
        return output
    }
    catch (e) {
        errorHandler(e);
    }
}
async function writeAppData(appData) {
    try {
        const data = JSON.stringify(appData);
        await localDB.appData.put({ref: 0, data});
        return true
    }
    catch (e) {
        errorHandler(e);
    }
}
async function lastImported() {
    const data = await localDB.lastImport.get(0);
    if (data) {
        return data.name
    }
    else {
        return ''
    }
}

export {writeFile, readFile, readAppData, writeAppData, exportData, importData, lastImported}