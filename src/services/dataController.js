import AppData from './AppData';
import FileObj from './FileObj';
import errorHandler from './errorHandler';
import { writeFile, readFile, writeAppData } from './localStorage';

const appData = new AppData();

async function addFiles(uploadsArr) {
    let fileObj;
    for (let upload of uploadsArr) {
        const ref = makeFileRef(upload.file);
        const {name, text = '', type} = upload.file;
        const checkedType = checkFileType(type, name);
        fileObj = new FileObj({...upload, name, text, fileRef: ref, type: checkedType});
        const activeDate = fileObj.getActiveDate();
        const fObjsWithSameFile = Object.values(appData.fileObjs).filter(fObj => fObj.fileRef === ref).map(fObj => fObj.getActiveDate());
        if (fObjsWithSameFile.filter(date => date === activeDate).length === 0) {
            appData.fileObjs[fileObj.uid] = fileObj;
        }
        if (fObjsWithSameFile.length < 1) {
            await writeFile(ref, upload.file);
        }
    }
    await writeAppData(appData);
    return true
}
function listNodes() {
        const getPath = dateTime => [dateTime.substr(0,4), ...dateTime.substr(4).match(/.{2}/g)]; 
        const fileObjs = Object.values(appData.fileObjs);
        const nodes = {};
        for (let fileObj of fileObjs) {
            const path = getPath(fileObj.getActiveDate().substr(0, 8));
            let head = nodes;
            for (let key of path) {
                if (!head.hasOwnProperty(key)) {
                    if (key !== path[path.length-1]) {
                        head[key] = {};
                    }
                    else {
                        head[key] = [];
                    }
                }
                head = head[key];
            }
            head.push(fileObj);
        }
        return nodes
}
function getFileObjs(from = '0', to = '0') {
    return Object.values(appData.fileObjs).filter(fileObj => {
            const key = fileObj.getActiveDate();
            return (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to)
        }).sort((a, b) => a.getActiveDate() - b.getActiveDate());
}

async function getFile(fileRef) {
    try {
        let file = await readFile(fileRef);
        if (!file) {
            // file = await - get from cloud/Google drive
        }
        if (!file) {
            throw new Error(`File with ref: ${fileRef} not found!`)
        }
        return file
    }
    catch (e) {
        errorHandler(e);
    }
}
function findFirstFileObj() {
    const fileObjs = Object.values(appData.fileObjs).sort((a, b) => a.getActiveDate() - b.getActiveDate());
    return fileObjs[0];
}

function removeFiles(fileObjs) {
    fileObjs.forEach(fileObj => {
        let key = fileObj.uid;
        if (appData.fileObjs[key]) {
        appData.delete(key);
        return true
    }
    return Error(`no such file under key: ${key}`)
    })
}

function makeFileRef(file) {
    return file.name+file.size+file.lastModified
}

function checkFileType(type, name) {
    if (!type) {
        const segs = name.split('.');
        if (segs.length > 1) {
            return segs[segs.length-1];
        }
        else {
            return "unknown"
        }
    }
    return type
}

export {addFiles, listNodes, getFileObjs, getFile, removeFiles}