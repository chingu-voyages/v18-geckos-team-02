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
  const {addFiles, getFileObjs, getFile, start} = dataController.current;
  useEffect(() => start(), []);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [appTheme, setTheme] = useState(theme);

  const [fileObjs, setFileObjs] = useState([]);
  const [activeNodeDate, setActiveNodeDate] = useState('');
  useEffect(() => {
    if (activeNode) {
      const objs = getFileObjs(activeNode, activeNode.substr(0,8)+'2359');
      if (objs && objs.length > 0) {
        setActiveNodeDate(new Date(objs[0].unFormatDate(objs[0].getActiveDate()).substr(0, 10)).toDateString());
        setFileObjs(objs);
      }
    }
  }, [activeNode]);

  function addUploadsToList(newUploads) {
    const newUploadsArr = Object.values(newUploads).map(upload => formatNewUpload(upload));
    setUploads([...uploads, ...newUploadsArr]);
    setUploadModalOpen(true);
    setNoteModalOpen(false);
  }

  function deleteUpload(uid) {
    const appendedUploads = uploads.filter(upload => upload.uid !== uid);
    setUploads(appendedUploads);
  }

  function updateDatesOrTags(uids, values) {
    for (let uid of uids) {
      const index = uploads.findIndex(upload => upload.uid === uid);
      Object.assign(uploads[index], values);
    }
  }

  let newUploadCount = 0;
  function formatNewUpload(upload) {
    const dateNow = Date.now();
    return ({
      uid: dateNow+`${++newUploadCount}`,
      file: upload,
      timeStamps: {
        modified: !upload.lastModifiedDate ? dateNow : upload.lastModifiedDate,
        user: dateNow
      },
      activeTimeStamp: 'modified',
      tags: []
    })
  }

  function sumbitUploads() {
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
          <UploadModal close={handleCancel} {...{ uploads, deleteUpload, updateDatesOrTags, sumbitUploads }} />}
        {noteModalOpen && <AddNoteModal close={() => setUploadModalOpen(false)} onCancel={() => setNoteModalOpen(false)} {...{ addUploadsToList }} />}
        <Main {...{activeNodeDate, fileObjs, getFile}} />
        <nav>
          <Timeline {...{ activeNode, setActiveNode, nodesList, getFile }} />
          <NavBar openNote={() => setNoteModalOpen(true)} {...{ addUploadsToList }} />
        </nav>
      </ThemeProvider>
    </>
  );
}

export default App;
