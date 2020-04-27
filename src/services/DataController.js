import AppData from './AppData';
import FileObj from './FileObj';
import errorHandler from './errorHandler';
import { writeFile, readFile, readAppData, writeAppData } from './storage';
export default function DataController(statusSubcriber, nodeListSubcriber, setActiveNode) {
    this.appData = new AppData(statusSubcriber);
    this.setStatus = statusSubcriber;
    this.nodeListSubcriber = nodeListSubcriber;
    this.setActiveNode = setActiveNode;
    this.addFiles = this.addFiles.bind(this);
    this.listNodes = this.listNodes.bind(this);
    this.getFileObjs = this.getFileObjs.bind(this);
    this.getRefs = this.getRefs.bind(this);
    this.getFile = this.getFile.bind(this);
    this.start = this.start.bind(this);
}
DataController.prototype.start = async function() {
    const data = await readAppData('local');
    if (data) {
        this.appData.rebase(data);
        this.updateList();
        this.setActiveNode(this.findFirstFileObj().getActiveDate().substr(0,8));
    }
}
DataController.prototype.compareAppData = async function() {

}
DataController.prototype.updateList = function() {
    this.nodeListSubcriber(this.listNodes());
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
    this.updateList();
    this.setActiveNode(fileObj.getActiveDate().substr(0,8));
    this.setStatus('Storing updates locally');
    await writeAppData(this.appData);
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
            throw new Error(`File with ref: ${fileRef} not found!`)
        }
        return file
    }
    catch (e) {
        errorHandler(e);
    }
}
DataController.prototype.findFirstFileObj = function() {
    const fileObjs = Object.values(this.appData.fileObjs).sort((a, b) => a.getActiveDate() - b.getActiveDate());
    return fileObjs[0];
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