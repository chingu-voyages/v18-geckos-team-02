const dates = {};

function listNodes(from, to) {
    const getPath = dateTime => dateTime.split(/[\/\s:]/g);
    const files = getFiles({from, to});
    const nodes = {};
    for (let file of files) {
        const path = getPath(file.key.substr(0, 12));
        let head = nodes;
        for (let key of path) {
            if (!head.hasOwnProperty(key)) {
                head[key] = {};
            }
            head = head[key];
        }
        head = file;
    }
    return nodes
}

function getFiles(from, to) {
    const keys = Object.keys(dates);
    const files = [];
    for (let key in keys) {
        if (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to) {
            files.push({...dates[key], key})
        }
        else if (key.substr(0, to.length) > to) {
            break;
        }
    }
    return files
}

function setFile(fileObj, nDuplicate = 0) {
    let key = `${fileObj.timeStamps[fileObj.activeTimeStamp]}${nDuplicate ? `(${nDuplicate})` : ''}`;
    if (dates.hasOwnProperty(key)) {
        return setFile(fileObj, nDuplicate++);
    }
    else {
        dates[key] = fileObj;
        return true
    }
}

function updateFile(fileObj) {
    let key = fileObj.timeStamps[fileObj.activeTimeStamp];
    if (dates[key]) {
        Object.assign(dates[key], fileObj);
        return true
    }
    throw `Error: no such file under key: ${key}`
}

function removeFile(fileObj) {
    let key = fileObj.timeStamps[fileObj.activeTimeStamp];
    if (dates[key]) {
        delete dates[key];
        return true
    }
    throw `Error: no such file under key: ${key}`
}

export {listNodes, getFiles, setFile, updateFile, removeFile}