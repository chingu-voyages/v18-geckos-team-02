import React, {useState} from 'react';
import Main from './components/Main';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import AddNoteModal from './components/AddNoteModal';

function App() {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  return (
    <>
      {uploadModalOpen && !noteModalOpen && <UploadModal close={() => setNoteModalOpen(false)} />}
      {noteModalOpen && <AddNoteModal close={() => setUploadModalOpen(false)} />}
      <Main />
      <NavBar openModal={() => setNoteModalOpen(true)} openNote={() => setUploadModalOpen(true)} />
    </>
  );
}

export default App;
