import AppData from './AppData';
import FileObj from './FileObj';
import errorHandler from './errorHandler';
import { writeFile, readFile } from './storage';
export default function DataController(statusSubcriber, nodeListSubcriber, setActiveNode) {
    this.appData = new AppData();
    this.statusSubcriber = statusSubcriber;
    this.nodeListSubcriber = nodeListSubcriber;
    this.setActiveNode = setActiveNode;
    this.addFiles = this.addFiles.bind(this);
    this.listNodes = this.listNodes.bind(this);
    this.getFileObjs = this.getFileObjs.bind(this);
    this.getRefs = this.getRefs.bind(this);
    this.getFile = this.getFile.bind(this);
    this.findKey = this.findKey.bind(this);
}
DataController.prototype.updateList = function() {
    this.nodeListSubcriber(this.listNodes());
}
DataController.prototype.setStatus = function(message) {
    this.statusSubcriber(message);
}
DataController.prototype.addFiles = async function(uploadsArr) {
    this.setStatus('Uploading files');
    let fileObj;
    for (let upload of uploadsArr) {
        fileObj = new FileObj(upload);
        this.appData.fileObjs[fileObj.uid] = fileObj;
        this.setStatus('Uploading '+upload.file.name);
        await writeFile(fileObj.fileRef, upload.file);
    }
    this.setStatus('Uploading done');
    this.updateList();
    this.setActiveNode(fileObj.getActiveDate().substr(0,8));
    this.setStatus('');
    return true
}
DataController.prototype.listNodes = function() {
        const getPath = dateTime => [dateTime.substr(0,4), ...dateTime.substr(4).match(/.{2}/g)]; 
        const fileObjs = Object.values(this.appData.fileObjs);
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
DataController.prototype.getFileObjs = function(from = '0', to = '0') {
    return Object.values(this.appData.fileObjs).filter(fileObj => {
            const key = fileObj.getActiveDate();
            return (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to)
        }).sort((a, b) => a.getActiveDate() - b.getActiveDate());
}

DataController.prototype.getRefs = function(from = '0', to = '0') {
    const keys = Object.values(this.appData.fileObjs).filter(fileObj => {
        const key = fileObj.getActiveDate();
        return (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to)
    }).sort((a, b) => a.getActiveDate() - b.getActiveDate());
    const fileRefs = [];
    for (let key of keys) {
        if (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to) {
            fileRefs.push(key)
        }
        else if (key.substr(0, to.length) > to) {
            break;
        }
    }
    return fileRefs
}

DataController.prototype.getFile = async function(fileRef) {
    try {
        let file = await readFile(fileRef);
        if (!file) {
            // file = await - get from cloud/Google drive
        }
        if (!file) {
            throw `File with ref: ${fileRef} not found!`
        }
        return file
    }
    catch (e) {
        errorHandler(e);
    }
}
DataController.prototype.findKey = function(nearestTo) {
    const dateKeys = Object.keys(this.appData.fileObjs).sort();
    if (nearestTo === 'start') {
        return dateKeys[0];
    }
    else if (nearestTo === 'end') {
        return dateKeys[dateKeys.length-1];
    }
    else {
        return dateKeys.find(key => key.substr(0, nearestTo.length) >= nearestTo);
    }
}


function updateFile(fileObj) {
    let key = fileObj.key;
    if (this.appData.fileObjs[key]) {
        Object.assign(this.appData.fileObjs[key], fileObj);
        return true
    }
    return `Error: no such file under key: ${key}`
}

function removeFile(fileObj) {
    let key = fileObj.key;
    if (this.appData.fileObjs[key]) {
        delete this.appData.fileObjs[key];
        return true
    }
    return `Error: no such file under key: ${key}`
}