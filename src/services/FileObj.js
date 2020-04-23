export default function FileObj({uid, file, activeTimeStamp, timeStamps, tags}) {
    this.uid = uid;
    this.file = file;
    this.fileRef = this.makeFileRef(file);
    this.timeStamps = {};
    this.activeTimeStamp = activeTimeStamp;
    this.tags = tags;
    Object.keys(timeStamps).forEach(key => this.timeStamps[key] = this.formatDate(timeStamps[key]));
    this.type = this.checkType(file.type, file.name);
}
FileObj.prototype.formatDate = function(dateTime) {
    const makeMinTwoDigits = n => {
        const str = n+'';
        return str.length === 1 ? '0'+str : str
    };
    const d = new Date(dateTime);
    return d.getFullYear() +
        makeMinTwoDigits(d.getMonth()+1) +
        makeMinTwoDigits(d.getDate()) +
        makeMinTwoDigits(d.getHours()) +
        makeMinTwoDigits(d.getMinutes()) +
        makeMinTwoDigits(d.getSeconds());
}
FileObj.prototype.checkType = function(type, name) {
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
FileObj.prototype.makeFileRef = function(file) {
    return file.name+file.size+file.lastModified
}
FileObj.prototype.getActiveDate = function() {
    return this.timeStamps[this.activeTimeStamp];
}
FileObj.prototype.setActiveTimeStamp = function(name, dateTime) {
    this.activeTimeStamp = name;
    this.timeStamps[name] = this.formatDate(dateTime);
}