import Dexie from 'dexie';
import errorHandler from './errorHandler';

const localDB = new Dexie('user_db');
localDB.version(1).stores({
    fileObjs: 'ref',
    files: 'ref',
    lastModified: 'zero'
});

localDB.files.clear();

async function writeFile(ref, file) {
    try {
        const data = await fileToArrayBuffer(file);
        await localDB.files.add({ref, data});
        const arr = await localDB.files.toArray();
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
            throw `Could not get data for ref: ${ref} !`
        }
        return new Blob([dataObj.data])
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

export {writeFile, readFile}