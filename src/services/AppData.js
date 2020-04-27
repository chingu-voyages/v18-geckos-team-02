import { writeFile, readFile, readAppData, writeAppData } from './storage';

export default function AppData(statusSubcriber) {
    this.setStatus = statusSubcriber;
    this.lastModified = null;
    this.basedOn = null;
    this.changeLog = [];
    this.fileObjs = {};
}
AppData.prototype.update = function(fileObjsArr, lastModified = Date.now().toString()) {
    fileObjsArr.forEach(fileObj => this.fileObjs[fileObj.ref] = fileObj);
    this.lastModified = lastModified;
}

AppData.prototype.add = function(fileObj, log = true) {
    log && this.changeLog.push({ func: 'add', data: fileObj });
    this.fileObjs[fileObj.uid] = fileObj;
}
AppData.prototype.update = function(fileObj, log = true) {
    log && this.changeLog.push({ func: 'update', data: fileObj });
    Object.assign(this.fileObjs[fileObj.uid], fileObj);
}
AppData.prototype.delete = function(uid, log = true) {
    log && this.changeLog.push({ func: 'delete', data: uid });
    delete this.fileObjs[uid];
}
AppData.prototype.rebase = function(newAppData) {
    this.basedOn = newAppData.lastModified;
    this.fileObjs = newAppData.fileObjs;
    for (let op in this.changeLog) {
        this[op.func](op.data, false);
    }
    this.changeLog = [];
}

//AppData.prototype.compare