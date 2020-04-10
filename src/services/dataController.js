import FileObj from './FileObj';
const dates = {};

function listNodes(from = '0', to = '0') {
    const getPath = dateTime => [dateTime.substr(0,4), ...dateTime.substr(4).match(/.{2}/g)];
    const files = getFiles(from, to);
    const nodes = {};
    for (let file of files) {
        const path = getPath(file.key.substr(0, 8));
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
        head.push(file);
    }
    return nodes
}

function getFiles(from = '0', to = '0') {
    const keys = Object.keys(dates);
    const files = [];
    for (let key of keys) {
        if (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to) {
            files.push({...dates[key], key})
        }
        else if (key.substr(0, to.length) > to) {
            break;
        }
    }
    return files
}

function addFiles(uploadsArr) {
    for (let {file, tags, activeTimeStamp, timeStamps} of uploadsArr) {
        const fileObj = new FileObj(file, tags, activeTimeStamp, timeStamps);
        if (!setFile(fileObj)) {
            return `Error: unable to set file ${JSON.stringify(file)}`
        }
    }
    return true
}

function updateFile(fileObj) {
    let key = fileObj.key;
    if (dates[key]) {
        Object.assign(dates[key], fileObj);
        return true
    }
    return `Error: no such file under key: ${key}`
}

function removeFile(fileObj) {
    let key = fileObj.key;
    if (dates[key]) {
        delete dates[key];
        return true
    }
    return `Error: no such file under key: ${key}`
}

export {listNodes, getFiles, addFiles, updateFile, removeFile}

function setFile(fileObj, nDuplicate = 0) {
    let key = `${fileObj.timeStamps[fileObj.activeTimeStamp]}${nDuplicate ? `(${nDuplicate})` : ''}`;
    if (dates.hasOwnProperty(key)) {
        return setFile(fileObj, nDuplicate + 1);
    }
    else {
        dates[key] = fileObj;
        return true
    }
}