import AppData from './AppData';
import FileObj from './FileObj';

export default function DataController() {
    this.appData = new AppData();
    this.addFiles = this.addFiles.bind(this);
    this.listNodes = this.listNodes.bind(this);
    this.getFileObjs = this.getFileObjs.bind(this);
    this.getRefs = this.getRefs.bind(this);
    this.getFile = this.getFile.bind(this);
    this.findKey = this.findKey.bind(this);
}
DataController.prototype.addFiles = function(uploadsArr) {
    let fileObj;
    for (let upload of uploadsArr) {
        fileObj = new FileObj(upload);
        if (!this.setFile(fileObj)) {
            return `Error: unable to set file ${JSON.stringify(upload)}`
        }
    }
    return fileObj
}
DataController.prototype.setFile = function(fileObj) {
    this.appData.fileObjs[fileObj.getActiveDate()] = fileObj;
    return true
}
DataController.prototype.listNodes = function() {
    /* TODO sync stored list in local DB and Drive and check for newest + make updateList function to add remove efficiently */
    // if (storedList) { return storedList }
    // else {
        const getPath = dateTime => [dateTime.substr(0,4), ...dateTime.substr(4).match(/.{2}/g)]; 
        const fileRefs = Object.keys(this.appData.fileObjs).sort();
        const nodes = {};
        for (let fileRef of fileRefs) {
            const path = getPath(fileRef.substr(0, 8));
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
            head.push(fileRef);
        }
        return nodes
    // }
}
DataController.prototype.getFileObjs = function(from = '0', to = '0') {

}

DataController.prototype.getRefs = function(from = '0', to = '0') {
    const keys = Object.keys(this.appData.fileObjs).sort();
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
    return new Promise((resolve, reject) => {
        if (this.appData.fileObjs.hasOwnProperty(fileRef)) {
            resolve(this.appData.fileObjs[fileRef]);
        }
        else {
                // get from local db
                // else get from cloud/Google drive
                // else reject
        }
    });
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