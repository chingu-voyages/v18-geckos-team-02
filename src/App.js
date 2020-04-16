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

const Demo = styled.div`
  width: 30rem;
  height: 30rem;;
  margin: 5rem auto;
  background: #00bfff;
  color: #f6f6f6;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppTitle = styled.h1`
  font-size: 4rem;
`;

function App() {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(findKey('start'));
  const [files, setFiles] = useState([]);
  const [appTheme, setTheme] = useState(theme);

  function addFilesToList(uploads) {
    const uploadsArr = uploads[0] instanceof File ? Object.values(uploads) : uploads;
    const dateNow = Date.now();
    uploadsArr.forEach((upload, i) => uploadsArr[i].uid = dateNow+`${i}`);
    setFiles([...files, ...uploadsArr]);
    setUploadModalOpen(true);
    setNoteModalOpen(false);
  }

  function deleteUpload(uid) {
    const appendedFiles = files.filter(file => file.uid !== uid);
    setFiles(appendedFiles);
  }

  function updateUpload(upload, customValues) {
    const { tags, user, modified, activeTimeStamp } = customValues;  
    if (upload instanceof Array) {
      upload.forEach(file => {
        if (file.tags) {
          file.tags += ` ${customValues.tags}`; 
        }
      })
    } else {
      upload.timeStamps = {created: modified, modified, user};
      upload.activeTimeStamp = activeTimeStamp;
      upload.tags = tags;
    }
  }

  function updateUploads(uidArr) {
    // TODO update date and tags and selected timeStamp: timeStamps -> modified + user, activeTimeStamp
    const updatedUploadsArr = [];
    uidArr.forEach(fileItem => {
      if (!fileItem.activeTimeStamp) {
        updateUpload(fileItem, {tags: "", user: fileItem.uid.substr(0,13), modified: fileItem.lastModified, activeTimeStamp: "modified"});
      }
      updatedUploadsArr.push(fileItem);
    });
    setFiles(updatedUploadsArr);
    // addFiles(updatedUploadsArr);
  }  

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={appTheme}>
       {uploadModalOpen && !noteModalOpen &&
          <UploadModal close={() => setNoteModalOpen(false)} {...{ files, deleteUpload, updateUpload, updateUploads }} />}
        {noteModalOpen && <AddNoteModal close={() => setUploadModalOpen(false)} onCancel={() => setNoteModalOpen(false)} {...{ addFilesToList }} />}
        <Main {...{activeNode, setActiveNode}} />
        {!uploadModalOpen && !noteModalOpen && timelineOpen && <Timeline close={() => setTimelineOpen(false)} {...{activeNode, setActiveNode}} />}
        <NavBar openModal={() => setNoteModalOpen(true)} openNote={() => setUploadModalOpen(true)} openTimeline={() => setTimelineOpen(true)} {...{addFilesToList}} />
      </ThemeProvider>
    </>
  );
}

export default App;
