import { readAppData, writeAppData } from './localStorage';
export default function AppData(handleFileObjsChange) {
    this.fileObjsUpdate = handleFileObjsChange;
    this.lastModified = null;
    this.basedOn = null;
    this.changeLog = [];
    this.fileObjs = {};
    this.init();
}
AppData.prototype.onUpdate = function() {
    this.fileObjsUpdate();
    writeAppData(this);
}
AppData.prototype.init = async function() {
    const data = await readAppData();
    if (data) {
        this.clear();
        this.rebase(data);
    }
}
AppData.prototype.add = function(fileObj, log = true) {
    log && this.changeLog.push({ func: 'add', data: fileObj });
    this.fileObjs[fileObj.uid] = fileObj;
    this.onUpdate();
}
AppData.prototype.update = function(fileObj, log = true) {
    log && this.changeLog.push({ func: 'update', data: fileObj });
    Object.assign(this.fileObjs[fileObj.uid], fileObj);
    this.onUpdate();
}
AppData.prototype.delete = function(uid, log = true) {
    log && this.changeLog.push({ func: 'delete', data: uid });
    delete this.fileObjs[uid];
    this.onUpdate();
}
AppData.prototype.rebase = function(newAppData) {
    this.basedOn = newAppData.lastModified;
    this.fileObjs = newAppData.fileObjs;
    for (let op of this.changeLog) {
        this[op.func](op.data, false);
    }
    this.changeLog = [];
    this.onUpdate();
}
AppData.prototype.clear = function() {
    this.lastModified = null;
    this.basedOn = null;
    this.changeLog = [];
    this.fileObjs = {};
    this.onUpdate();
}
