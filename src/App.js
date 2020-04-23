import React, {useState, useEffect} from 'react';
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
  const dataController = new DataController(setStatus);
  const {addFiles, getRefs, listNodes, getFile, findKey} = dataController;

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(findKey('start'));
  const [uploads, setUploads] = useState([]);
  const [appTheme, setTheme] = useState(theme);

  useEffect(() => {
    // addFiles([...dummyData]);
  }, [])

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

  function updateDatesOrTags(uids, values) {
    for (let uid of uids) {
      const index = uploads.findIndex(upload => upload.uid === uid);
      Object.assign(uploads[index], values);
    }
  }

  let newUploadCount = 0;
  function formatNewUpload(upload) {
    const dateNow = Date.now();
    const { name, lastModified, size } = upload;
    return ({
      uid: dateNow+`${++newUploadCount}`,
      file: upload,
      timeStamps: {
        modified: !lastModified ? dateNow : lastModified,
        user: dateNow
      },
      activeTimeStamp: 'modified',
      tags: [],
      fileId: !lastModified ? name.replace(/ /g,'') + dateNow : name.replace(/ /g,'') + size + lastModified
    })
  }

  function sumbitUploads() {
    const lastStoredFile = addFiles(uploads);
    setUploads([]);
    setUploadModalOpen(false);
    setActiveNode(lastStoredFile.timeStamps[lastStoredFile.activeTimeStamp]);
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
        <Main {...{activeNode, setActiveNode, getRefs, getFile}} />
        <nav>
          <Timeline {...{ activeNode, setActiveNode, listNodes, getFile }} />
          <NavBar openNote={() => setNoteModalOpen(true)} {...{ addUploadsToList }} />
        </nav>
      </ThemeProvider>
    </>
  );
}

export default App;
