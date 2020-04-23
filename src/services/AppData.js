export default function AppData() {
    this.lastModified = '0';
    this.fileObjs = {};
}
AppData.prototype.update = function(fileObjsArr, lastModified = Date.now().toString()) {
    fileObjsArr.forEach(fileObj => this.fileObjs[fileObj.ref] = fileObj);
    this.lastModified = lastModified;
}