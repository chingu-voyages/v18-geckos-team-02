import React, {useState} from 'react';
import Main from './components/Main';
import Timeline from './components/Timeline';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import AddNoteModal from './components/AddNoteModal';
import styled, {ThemeProvider} from 'styled-components';
import GlobalStyle, {theme} from './theme/globalStyles';
import dummyData from './tests/dummyData';
import { addFiles, findKey } from './services/dataController';
addFiles([...dummyData]);

function App() {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(findKey('start'));
  const [uploads, setUploads] = useState([]);
  const [appTheme, setTheme] = useState(theme);

   /* 
    upload from a file -> {name: String, lastModified: Interger, lastModifiedDate: DateTime, size: Interger, type: String}
    upload from note -> {name: String, text: String, type: "note"}

    --^ formated ^--
    file -> { 
      uid: String,
      file: {name: String, lastModified: Interger, lastModifiedDate: DateTime, size: Interger, type: String},
      timeStamps: {
        modified: DateTime,
        user: DateTime
      },
      activeTimeStamp: String,
      tags: Array
    }
    note -> {
      uid: String,
      file: {name: String, text: String, type: "note"},
      timeStamps: {
        modified: DateTime,
        user: DateTime
      },
      activeTimeStamp: String,
      tags: Array
    }
  */

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

  function updateDatesOrTags(uids, { tags, user, modified, activeTimeStamp }) {
    for (let uid of uids) {
      const index = uploads.findIndex(upload => upload.uid === uid);
      if (tags) {
        uploads[index].tags = [...uploads[uid].tags, ...tags];
      }
      if (user) {
        uploads[index].timeStamps.user = user;
      }
      if (modified) {
        uploads[index].timeStamps.modified = modified;
      }
      if (activeTimeStamp) {
        uploads[index].activeTimeStamp = activeTimeStamp;
      }
    }
  }

  let newUploadCount = 0;
  function formatNewUpload(upload) {
    const dateNow = Date.now();
    return ({
      uid: dateNow+`${++newUploadCount}`,
      file: upload,
      timeStamps: {
        modified: upload.lastModifiedDate,
        user: dateNow
      },
      activeTimeStamp: 'modified',
      tags: []
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
        <Main {...{activeNode, setActiveNode}} />
        {!uploadModalOpen && !noteModalOpen && timelineOpen && <Timeline close={() => setTimelineOpen(false)} {...{ activeNode, setActiveNode }} />}
        <NavBar openNote={() => setNoteModalOpen(true)} openTimeline={() => setTimelineOpen(true)} {...{ addUploadsToList }} />
      </ThemeProvider>
    </>
  );
}

export default App;
