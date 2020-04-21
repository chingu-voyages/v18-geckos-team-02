import FileObj from './FileObj';
const dates = {};

function listNodes() {
    /* TODO sync stored list in local DB and Drive and check for newest + make updateList function to add remove efficiently */
    // if (storedList) { return storedList }
    // else {
        const getPath = dateTime => [dateTime.substr(0,4), ...dateTime.substr(4).match(/.{2}/g)]; 
        const fileRefs = Object.keys(dates).sort();
        const nodes = {};
        for (let fileRef of fileRefs) {
            const path = getPath(fileRef.substr(0, 8));
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
            head.push(fileRef);
        }
        return nodes
    // }
}

function getRefs(from = '0', to = '0') {
    const keys = Object.keys(dates).sort();
    const fileRefs = [];
    for (let key of keys) {
        if (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to) {
            fileRefs.push(key)
        }
        else if (key.substr(0, to.length) > to) {
            break;
        }
    }
    return fileRefs
}

function getFile(fileRef) {
    return new Promise((resolve, reject) => {
        if (dates.hasOwnProperty(fileRef)) {
            resolve(dates[fileRef]);
        }
        else {
                // get from local db
                // else get from cloud/Google drive
                // else reject
        }
    });
}

function addFiles(uploadsArr) {
    let fileObj;
    for (let upload of uploadsArr) {
        fileObj = new FileObj(upload);
        if (!setFile(fileObj)) {
            return `Error: unable to set file ${JSON.stringify(upload)}`
        }
    }
    return fileObj
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

function findKey(nearestTo) {
    const dateKeys = Object.keys(dates).sort();
    if (nearestTo === 'start') {
        return dateKeys[0];
    }
    else if (nearestTo === 'end') {
        return dateKeys[dateKeys.length-1];
    }
    else {
        return dateKeys.find(key => key.substr(0, nearestTo.length) >= nearestTo);
    }
}

export {listNodes, getRefs, getFile, addFiles, updateFile, removeFile, findKey}

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