import AppData from './AppData';
import FileObj from './FileObj';
import errorHandler from './errorHandler';
import { writeFile, readFile, readAppData, writeAppData } from './storage';
export default function DataController(statusSubcriber, nodeListSubcriber, setActiveNode) {
    this.appData = new AppData(statusSubcriber);
    this.setStatus = statusSubcriber;
    this.nodeListSubcriber = nodeListSubcriber;
    this.setActiveNode = setActiveNode;
    this.addFiles = this.addFiles.bind(this);
    this.listNodes = this.listNodes.bind(this);
    this.getFileObjs = this.getFileObjs.bind(this);
    this.getFile = this.getFile.bind(this);
    this.start = this.start.bind(this);
    this.removeFiles = this.removeFiles.bind(this);
}
DataController.prototype.start = async function() {
    const data = await readAppData('local');
    if (data) {
        this.appData.rebase(data);
        this.updateList();
        this.setActiveNode(this.findFirstFileObj().getActiveDate().substr(0,8));
    }
}
DataController.prototype.syncAppData = async function() {
    // if client basedOn date === cloud lastModified date --> replace cloud data with client data
    // if client basedOn date !== cloud lastModified date --> pull in new cloud data --> run each operation from log on new data --> clear log --> compare client basedOn date === cloud lastModified date again
}
DataController.prototype.updateList = function() {
    this.nodeListSubcriber(this.listNodes());
}
DataController.prototype.addFiles = async function(uploadsArr) {
    this.setStatus('Uploading files');
    let fileObj;
    for (let upload of uploadsArr) {
        const ref = makeFileRef(upload.file);
        const {name, text = '', type} = upload.file;
        const checkedType = checkFileType(type, name);
        fileObj = new FileObj({...upload, name, text, fileRef: ref, type: checkedType});
        const activeDate = fileObj.getActiveDate();
        const fObjsWithSameFile = Object.values(this.appData.fileObjs).filter(fObj => fObj.fileRef === ref).map(fObj => fObj.getActiveDate());
        if (fObjsWithSameFile.filter(date => date === activeDate).length === 0) {
            this.appData.fileObjs[fileObj.uid] = fileObj;
        }
        if (fObjsWithSameFile.length < 1) {
            this.setStatus('Uploading '+upload.file.name);
            await writeFile(ref, upload.file);
        }
    }
    this.updateList();
    this.setActiveNode(fileObj.getActiveDate().substr(0,8));
    this.setStatus('Storing updates locally');
    await writeAppData(this.appData);
    this.setStatus('');
    return true
}
DataController.prototype.listNodes = function() {
        const getPath = dateTime => [dateTime.substr(0,4), ...dateTime.substr(4).match(/.{2}/g)]; 
        const fileObjs = Object.values(this.appData.fileObjs);
        const nodes = {};
        for (let fileObj of fileObjs) {
            const path = getPath(fileObj.getActiveDate().substr(0, 8));
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
            head.push(fileObj);
        }
        return nodes
}
DataController.prototype.getFileObjs = function(from = '0', to = '0') {
    return Object.values(this.appData.fileObjs).filter(fileObj => {
            const key = fileObj.getActiveDate();
            return (key.substr(0, from.length) >= from && key.substr(0, to.length) <= to)
        }).sort((a, b) => a.getActiveDate() - b.getActiveDate());
}

DataController.prototype.getFile = async function(fileRef) {
    try {
        let file = await readFile(fileRef);
        if (!file) {
            // file = await - get from cloud/Google drive
        }
        if (!file) {
            throw new Error(`File with ref: ${fileRef} not found!`)
        }
        return file
    }
    catch (e) {
        errorHandler(e);
    }
}
DataController.prototype.findFirstFileObj = function() {
    const fileObjs = Object.values(this.appData.fileObjs).sort((a, b) => a.getActiveDate() - b.getActiveDate());
    return fileObjs[0];
}

DataController.prototype.removeFiles = function(fileObjs) {
    fileObjs.forEach(fileObj => {
        let key = fileObj.uid;
        if (this.appData.fileObjs[key]) {
        delete this.appData.fileObjs[key];
        this.updateList()
        this.setStatus('Deleted');
        console.log(this.appData.fileObjs);
        return true
    }
    return `Error: no such file under key: ${key}`

    })
}
    


function updateFile(fileObj) {
    let key = fileObj.key;
    if (this.appData.fileObjs[key]) {
        Object.assign(this.appData.fileObjs[key], fileObj);
        return true
    }
    return `Error: no such file under key: ${key}`
}

function makeFileRef(file) {
    return file.name+file.size+file.lastModified
}

function checkFileType(type, name) {
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