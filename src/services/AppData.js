import {  readAppData, writeAppData } from './localStorage';
export default function AppData(statusSubcriber) {
    this.setStatus = statusSubcriber;
    this.lastModified = null;
    this.basedOn = null;
    this.changeLog = [];
    this.fileObjs = {};
    this.init();
}
AppData.prototype.init = async function() {
    const data = await readAppData();
    if (data) {
        this.rebase(data);
      //  setActiveNode(findFirstFileObj().getActiveDate().substr(0,8));
    }
}
AppData.prototype.add = function(fileObj, log = true) {
    log && this.changeLog.push({ func: 'add', data: fileObj });
    this.fileObjs[fileObj.uid] = fileObj;
    writeAppData(this);
}
AppData.prototype.update = function(fileObj, log = true) {
    log && this.changeLog.push({ func: 'update', data: fileObj });
    Object.assign(this.fileObjs[fileObj.uid], fileObj);
    writeAppData(this);
}
AppData.prototype.delete = function(uid, log = true) {
    log && this.changeLog.push({ func: 'delete', data: uid });
    delete this.fileObjs[uid];
    writeAppData(this);
}
AppData.prototype.rebase = function(newAppData) {
    this.basedOn = newAppData.lastModified;
    this.fileObjs = newAppData.fileObjs;
    for (let op in this.changeLog) {
        this[op.func](op.data, false);
    }
    this.changeLog = [];
    writeAppData(this);
}
