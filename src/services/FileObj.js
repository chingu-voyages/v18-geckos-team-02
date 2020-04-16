export default function FileObj({uid, file, activeTimeStamp, timeStamps, tags}) {
    const fileObj = {
        uid,
        file,
        timeStamps: {},
        activeTimeStamp,
        tags,
        formatDate: this.formatDate
    }
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