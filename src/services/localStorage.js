import Dexie from 'dexie';
import errorHandler from './errorHandler';
import FileObj from './FileObj';
import {exportDB, importInto} from "dexie-export-import";

const localDB = new Dexie('user_dbac');
localDB.version(1).stores({
    appData: 'ref',
    files: 'ref',
});

async function wipeAllData() {
    await localDB.files.clear();
    await localDB.appData.clear();
    await localDB.files.delete('appData');
    await localDB.appData.delete('files');
    return true
}

async function importData(file) {
    try {
        const backup = await exportData();
        try {
            await wipeAllData();
            await importInto(localDB, file);
            return true
        }
        catch (e) {
            await wipeAllData();
            importData(backup);
            errorHandler(e);
            return false 
        }
    } catch (e) {
        errorHandler(e);
        throw Error('Unable to make a backup before import!')
    }
}

async function exportData() {
    try {
        const blob = await exportDB(localDB);
        return blob
    }
    catch (e) {
        errorHandler(e);
        return e
    }
}

async function writeFile(ref, file) {
    try {
        const data = await fileToArrayBuffer(file);
        await localDB.files.add({ref, data});
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
        return new Blob([dataObj.data])
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

function fileToArrayBuffer(file) {
    const blob = new Blob([file]);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            resolve(reader.result);
        });
        reader.addEventListener('error', reject);
        reader.readAsArrayBuffer(blob);
    });
}

export {writeFile, readFile, readAppData, writeAppData, wipeAllData, exportData, importData}