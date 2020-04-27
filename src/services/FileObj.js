export default function FileObj({uid, file, fileRef, activeTimeStamp, timeStamps, tags, type}) {
    this.uid = uid;
    this.fileRef = fileRef || this.makeFileRef(file);
    this.timeStamps = {};
    this.activeTimeStamp = activeTimeStamp;
    this.tags = tags;
    this.type = type || this.checkType(file.type, file.name);
    Object.keys(timeStamps).forEach(key => this.timeStamps[key] = this.formatDate(timeStamps[key]));
}
FileObj.prototype.formatDate = function(dateTime) {
    if (this.isFormatedDate(dateTime)) { 
        return dateTime
    }
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
FileObj.prototype.unFormatDate = function(date) {
    if (this.isFormatedDate(date)) {
        return `${date.substr(0,4)}-${date.substr(4,2)}-${date.substr(6,2)}-${date.substr(8,2)}-${date.substr(10,2)}`
    }
    else {
        console.error(date+' not formatted!')
    }
}
FileObj.prototype.isFormatedDate = function(date) {
    return !(typeof date !== 'string' || date.match(/\D/) || date.length !== 14)
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
FileObj.prototype.setActiveDate = function(name, dateTime) {
    this.activeTimeStamp = name;
    this.timeStamps[name] = this.formatDate(dateTime);
}