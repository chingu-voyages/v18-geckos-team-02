import React, {useState} from 'react';
import Main from './components/Main';
import Timeline from './components/Timeline';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import AddNoteModal from './components/AddNoteModal';

import dummyData from './tests/dummyData';
import { addFiles } from './services/dataController';
addFiles([...dummyData]);

function App() {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(true); // true for testing MAKE False when NavBar is done
  return (
    <>
      {uploadModalOpen && !noteModalOpen && <UploadModal close={() => setNoteModalOpen(false)} />}
      {noteModalOpen && <AddNoteModal close={() => setUploadModalOpen(false)} />}
      <Main />
      {!uploadModalOpen && !noteModalOpen && timelineOpen && <Timeline close={() => setTimelineOpen(false)} />}
      <NavBar openModal={() => setNoteModalOpen(true)} openNote={() => setUploadModalOpen(true)} openTimeline={() => setTimelineOpen(true)} />
    </>
  );
}

export default App;
