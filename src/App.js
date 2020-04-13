import React, {useState} from 'react';
import Main from './components/Main';
import Timeline from './components/Timeline';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import AddNoteModal from './components/AddNoteModal';
import styled from 'styled-components';
import GlobalStyle from './theme/globalStyles';


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
