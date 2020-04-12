export default function FileObj(file, tags, activeTimeStamp, timeStamps) {
    const fileObj = {
        fileType: this.detectFileType(file),
        timeStamps: {},
        activeTimeStamp,
        tags,
        formatDate: this.formatDate,
        detectFileType: this.detectFileType
    }
    fileObj.file = fileObj.fileType === 'Note' || fileObj.fileType === 'unknown' ? file : URL.createObjectURL(file);
    Object.keys(timeStamps).forEach(key => fileObj.timeStamps[key] = this.formatDate(timeStamps[key]));
    return fileObj
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
FileObj.prototype.detectFileType = function(file) {
    if (file instanceof File) {
        if (file.hasOwnProperty('type')) {
            return file.type
        }
        else {
            return 'File'
        }
    }
    else {
        if (typeof file === 'string') {
            return 'Note'
        }
        else {
            return 'unknown'
        }
    }
}