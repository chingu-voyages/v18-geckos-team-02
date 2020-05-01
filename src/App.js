import React, {useState, useEffect, useRef} from 'react';
import Main from './components/Main';
import Timeline from './components/Timeline';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import AddNoteModal from './components/AddNoteModal';
import styled, {ThemeProvider} from 'styled-components';
import GlobalStyle, {theme} from './theme/globalStyles';
import DataController from './services/DataController';

function App() {
  const [status, setStatus] = useState('');
  const [nodesList, setNodesList] = useState([]);
  const [activeNode, setActiveNode] = useState('');
  const dataController = useRef(new DataController(setStatus, setNodesList, setActiveNode));
  const {addFiles, getFileObjs, getFile, start, removeFiles} = dataController.current;
  useEffect(() => { start() }, [start]);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [appTheme, setTheme] = useState(theme);
  const [test, setTest] = useState('');

  const [fileObjs, setFileObjs] = useState([]);
  const [activeNodeDate, setActiveNodeDate] = useState('');

  useEffect(() => {
    if (activeNode) {
      const objs = getFileObjs(activeNode, activeNode.substr(0,8)+'2359');
      if (objs && objs.length > 0) {
        setActiveNodeDate(new Date(objs[0].unFormatDate(objs[0].getActiveDate()).substr(0, 10)).toDateString());
        setFileObjs(objs);
        console.log(objs);
      }
    }
  }, [activeNode, getFileObjs, uploads]);

  function addUploadsToList(newUploads) {
    const newUploadsArr = Object.values(newUploads).map(upload => formatNewUpload(upload));
    const fileIds = uploads.map(upload => upload.fileId);
    const noDuplicateIdsArr = newUploadsArr.filter(upload => removeDuplicate(fileIds, upload));
    setUploads([...uploads, ...noDuplicateIdsArr]);
    setUploadModalOpen(true);
    setNoteModalOpen(false);
  }

  function removeDuplicate(fileIds, upload) {
    const isDuplicate = fileIds.some(id => id === upload.fileId);
    if (isDuplicate)
      alert(`"${upload.file.name}" already added to list`);
    return !isDuplicate;
  }

  function deleteUpload(uid) {
    const appendedUploads = uploads.filter(upload => upload.uid !== uid);
    setUploads(appendedUploads);
  }

  function updateDatesOrTags(uids, uploadMeta) {
    for (let uid of uids) {
      const index = uploads.findIndex(upload => upload.uid === uid);
      const hasOwnTags = uploads[index].hasOwnProperty("tags") && uploads[index].tags[0] !== "";
      const privateTags = hasOwnTags && [...uploads[index].tags];
      Object.assign(uploads[index], uploadMeta); // TODO change from mutating uploads object
      if (hasOwnTags) {
        if (uploadMeta.tags[0] !== "") {
          const combinedTags = uploads[index].tags.concat(privateTags);
          uploads[index].tags = combinedTags;
        } else {
          uploads[index].tags = privateTags;
        }
      }
      setUploads([...uploads]);
    }
  }

  function getTags(upload) {
    if (upload.hasOwnProperty("tags") && upload.tags[0] !== "") {
      return upload.tags;
    }
  }
  function deleteTag(upload, tag) {
    const newTags = upload.tags.filter((selectedTag, index) => selectedTag[index] !== tag);
    upload.tags = newTags;
    setUploads([...uploads]);
  }

  let newUploadCount = 0;
  function formatNewUpload(upload) {
    const dateNow = Date.now();
    const { name, lastModified, size } = upload;
    return ({
      uid: dateNow+`${++newUploadCount}`,
      file: upload,
    })
  }

  function sumbitUploads() {
    console.log(uploads);
    addFiles(uploads);
    setUploads([]);
    setUploadModalOpen(false);
  }

  function handleCancel() {
    setUploads([]);
    setUploadModalOpen(false);
  }
    
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={appTheme}>
        {uploadModalOpen && !noteModalOpen &&
          <UploadModal close={handleCancel} {...{ uploads, deleteUpload, updateDatesOrTags, sumbitUploads, getTags, deleteTag }} />}
        {noteModalOpen && <AddNoteModal close={() => setUploadModalOpen(false)} onCancel={() => setNoteModalOpen(false)} {...{ addUploadsToList }} />}
        <Main {...{getFile, fileObjs, removeFile, activeNode, getFileObjs, activeNodeDate, test }} />
        <nav>
          <Timeline {...{ activeNode, setActiveNode, nodesList, getFile, removeFile }} />
          <NavBar openNote={() => setNoteModalOpen(true)} {...{ addUploadsToList }} />
        </nav>
      </ThemeProvider>
    </>
  );
}

export default App;
