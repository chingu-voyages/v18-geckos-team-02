import FileObj from './FileObj';
const dates = {};
const nodeDetailLookup = {
    'year': 0,
    'month': 4,
    'date': 6,
    'hour': 8,
    'min': 10,
    'sec': 12
}

function listNodes(fromNode = '0', maxNodes = 7, nodeDetail = 'date') {
    const getPath = dateTime => [dateTime.substr(0,4), ...dateTime.substr(4).match(/.{2}/g)];
    const dateKeys = Object.keys(dates).sort();
    const startKey = dateKeys.find(key => key.substr(0, fromNode.length) >= fromNode);
    let nodesToFind = maxNodes;
    let lastSegmentFound = '0';
    let endKey = dateKeys[dateKeys.length-1];
    for (let key of dateKeys) {
        const keySegment = key.substr(nodeDetailLookup[nodeDetail], nodeDetail === 'year' ? 4 : 2);
        if (nodesToFind === 1) {
            endKey = key;
            break;
        }
        else if (keySegment !== lastSegmentFound) {
            lastSegmentFound = keySegment;
            nodesToFind--;
        }
    }
    const files = getFiles(startKey, endKey);
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
    const keys = Object.keys(dates).sort();
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

export {listNodes, getFiles, addFiles, updateFile, removeFile, findKey}

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