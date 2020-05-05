export default function FileObj({uid, fileRef, activeTimeStamp, timeStamps, tags, type, name, text}) {
    this.uid = uid;
    this.timeStamps = {};
    this.activeTimeStamp = activeTimeStamp || 'modified';
    this.tags = tags || [];
    this.fileRef = fileRef;
    this.name = name;
    this.text = text || '';
    this.type = type;
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
FileObj.prototype.getActiveDate = function() {
    return this.timeStamps[this.activeTimeStamp];
}
FileObj.prototype.setActiveDate = function(name, dateTime) {
    this.activeTimeStamp = name;
    this.timeStamps[name] = this.formatDate(dateTime);
}