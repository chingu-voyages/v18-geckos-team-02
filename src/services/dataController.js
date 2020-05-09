import AppData from './AppData';
import FileObj from './FileObj';
import errorHandler from './errorHandler';
import { writeFile, readFile, writeAppData, importData, exportData as exportTimeLine } from './localStorage';
import Subscription from './Subscription';

const appData = new AppData(handleFileObjsChange);
async function handleFileObjsChange() {
    setActiveFileObjs();
    setNodesList();
}

let activeNode;
function setActiveNode(fileObj) {
    if (fileObj && fileObj.__proto__.hasOwnProperty('getActiveDate')) {
        const fileObjDate = fileObj.getActiveDate();
        if (fileObjDate) {
            activeNode = fileObjDate.substr(0, 8);
            setActiveFileObjs();
        }
    }
    else {
        errorHandler(Error(`Unable to setActiveNode with ${JSON.stringify(fileObj)}`));
    }
}
function setToLatestNode() {
    const lastFileObj = Object.values(appData.fileObjs).sort((a, b) => b.getActiveDate() - a.getActiveDate())[0];
    lastFileObj && setActiveNode(lastFileObj);
}


const nodesListSubcription = new Subscription();
function setNodesList() {
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
    nodesListSubcription.update(nodes);
}

let activeFileObjs = [];
const fileObjsSubcription = new Subscription();
function setActiveFileObjs() {
    if (!activeNode) {
        setToLatestNode();
    }
    else {
        let from = activeNode+'000000';
        let to = activeNode+'235959';
        activeFileObjs = getFileObjs(from, to);
        if (activeFileObjs.length > 0) {
            fileObjsSubcription.update(activeFileObjs);
        }
        else {
            fileObjsSubcription.update([]);
            setToLatestNode();
        }
    }
}
function getFileObjs(from = '0', to = '0') {
    return Object.values(appData.fileObjs).filter(fileObj => {
        const key = fileObj.getActiveDate();
        return (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to)
    }).sort((a, b) => a.getActiveDate() - b.getActiveDate());
}

async function addFiles(uploadsArr) {
    if (uploadsArr.length > 0) {
        let fileObj;
        for (let upload of uploadsArr) {
            const ref = makeFileRef(upload.file);
            const {name, text = '', type} = upload.file;
            const checkedType = checkFileType(type, name);
            if (!upload.hasOwnProperty('timeStamps')) {
                upload.timeStamps = {};
            } 
            upload.timeStamps.modified = upload.file.lastModified || Date.now();
            fileObj = new FileObj({...upload, name, text, fileRef: ref, type: checkedType, size: upload.file.size});
            const activeDate = fileObj.getActiveDate();
            const fObjsWithSameFile = Object.values(appData.fileObjs).filter(fObj => fObj.fileRef === ref);
            if (fObjsWithSameFile.filter(fObj => fObj.getActiveDate() === activeDate).length === 0) {
                appData.fileObjs[fileObj.uid] = fileObj;
            }
            if (fObjsWithSameFile.filter(fObj => !fObj.fileMissing).length < 1) {
                fObjsWithSameFile.forEach(fObj => fObj.fileMissing && fObj.flagMissingData(false));
                await writeFile(ref, upload.file);
            }
        }
        await writeAppData(appData);
        setActiveNode(fileObj);
        setNodesList();
        return true
    }
    return false
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

let uploadsList = [];
const uploadsListSubcription = new Subscription();
const uploadFuncs = {
    subscribe: function(stateSetter, uid) {
        uploadsListSubcription.subscribe(stateSetter, uid);
        uploadFuncs.set(uploadsList);
    },
    unsubscribe: uploadsListSubcription.unsubscribe,
    set: function setUploadsList(arr) {
        uploadsList = arr;
        uploadsListSubcription.update(uploadsList);
    },
    submit: function submitUploadsList() {
        addFiles(uploadsList);
        uploadFuncs.set([]);
    },
    cancel: () => uploadFuncs.set([]),
    deleteUpload: function deleteUpload(uid) {
        const appendedUploads = uploadsList.filter(upload => upload.uid !== uid);
        uploadFuncs.set(appendedUploads);
    },
    update: function updateDatesOrTags(uids, uploadMeta) {
        const newUploadsList = uploadsList.slice(0);
        for (let uid of uids) {
            const index = newUploadsList.findIndex(upload => upload.uid === uid);
            Object.assign(newUploadsList[index], {...uploadMeta, tags: uploadMeta.tags || []});
        }
        uploadFuncs.set([...newUploadsList]);
    },
    add: function addUploadsToList(newUploads) {
        const newUploadsArr = Object.values(newUploads).map(upload => formatNewUpload(upload));
        uploadFuncs.set([...uploadsList, ...newUploadsArr]);
    }
}

let newUploadCount = 0;
function formatNewUpload(upload) {
    const dateNow = Date.now();
    return ({
        uid: dateNow+`${++newUploadCount}`,
        file: upload,
    })
}

function updateFiles(filesArr) {
    filesArr.forEach(fileObj => {
        let key = fileObj.key;
        if (appData.fileObjs[key]) {
            Object.assign(appData.fileObjs[key], fileObj);
            appData.update(appData.fileObjs[key]);
            return true;
        }    
    })
}

async function importTimeLine(file) {
    await importData(file);
    appData.init();
    return true
}

export {addFiles, getFile, removeFiles, nodesListSubcription, fileObjsSubcription, setActiveNode, activeNode, uploadFuncs, updateFiles, exportTimeLine, importTimeLine}
