import AppData from './AppData';
import FileObj from './FileObj';
import errorHandler from './errorHandler';
import { writeFile, readFile, writeAppData, importData, exportData as exportTimeLine, lastImported } from './localStorage';
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
            activeNode = fileObjDate.substr(0, 10);
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
        const path = getPath(fileObj.getActiveDate().substr(0, 10).replace(/-/g, ''));
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
    if (Object.keys(appData.fileObjs).length > 0) {
        if (!activeNode) {
            setToLatestNode();
        }
        else {
            let from = activeNode+' 00:00:00';
            let to = activeNode+' 23:59:59';
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
    else {
        fileObjsSubcription.update([]);
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
        const uploadsList = [];
        const stored = [];
        for (let upload of uploadsArr) {
            const ref = makeFileRef(upload.file);
            const {name, text = '', type} = upload.file;
            const checkedType = checkFileType(type, name);
            if (!upload.hasOwnProperty('timeStamps')) {
                upload.timeStamps = {};
            } 
            upload.timeStamps.modified = upload.file.lastModified || Date.now();
            fileObj = new FileObj({...upload, name, text, fileRef: ref, type: checkedType, size: upload.file.size});
            fileObj.orig = upload;
            uploadsList.push(fileObj);
            const fObjsWithSameFile = Object.values(appData.fileObjs).filter(fObj => fObj.fileRef === ref);
            appData.fileObjs[fileObj.uid] = fileObj;
            if (fObjsWithSameFile.filter(fObj => !fObj.fileMissing).length < 1) {
                fObjsWithSameFile.forEach(fObj => fObj.fileMissing && fObj.flagMissingData(false));
                stored.push(writeFile(ref, upload.file));
            }
        }
        await writeAppData(appData);
        Promise.all(stored).then(() => setActiveNode(fileObj));
        setNodesList();
        return uploadsList
    }
    return false
}

async function editFiles(fileObjs) {
    if (fileObjs.length > 0) {
        for (let fileObj of fileObjs) {
            appData.update(fileObj);
        }
    }
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

let newUploadCount = 0;
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
        uploadFuncs.set([]);
    },
    cancel: function() {
        removeFiles(uploadsList);
        uploadFuncs.set([]);
    },
    deleteUpload: function deleteUpload(uid) {
        removeFiles(uploadsList.filter(upload => upload.uid === uid));
        const appendedUploads = uploadsList.filter(upload => upload.uid !== uid);
        uploadFuncs.set(appendedUploads);
    },
    update: function updateDatesOrTags(uploadsArr) {
        const newUploadsList = uploadsList.slice(0);
        for (let newUpload of uploadsArr) {
            const index = newUploadsList.findIndex(oldUpload => oldUpload.uid === newUpload.uid);
            newUploadsList[index] = newUpload;
        }
        editFiles(newUploadsList);
        uploadFuncs.set([...newUploadsList]);
    },
    add: async function addUploadsToList(newUploads) {
        const newUploadsArr = [];
        for (let upload of Object.values(newUploads)) {
            const data = fileToArrayBuffer(upload);
            const {name, lastModified, type, size} = upload;
            const obj = {
                uid: Date.now()+`${++newUploadCount}`,
                file: {
                    name,
                    lastModified,
                    type,
                    size,
                    data
                }
            }
            newUploadsArr.push(obj);
        }
        const fileObjs = await addFiles(newUploadsArr);
        Array.isArray(fileObjs) && uploadFuncs.set([...uploadsList, ...fileObjs]);
    }
}

function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            resolve(reader.result);
        });
        reader.addEventListener('error', reject);
        reader.readAsArrayBuffer(file);
    });
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

async function importTimeLine(file, name) {
    await importData(file, name);
    appData.init();
    return true
}

export {addFiles, getFile, removeFiles, nodesListSubcription, fileObjsSubcription, setActiveNode, activeNode, uploadFuncs, updateFiles, exportTimeLine, importTimeLine, lastImported}
