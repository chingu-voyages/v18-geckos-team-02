import React, {useState, useEffect, useRef} from 'react';
import Main from './components/Main';
import Timeline from './components/Timeline';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import AddNoteModal from './components/AddNoteModal';
import styled, {ThemeProvider} from 'styled-components';
import GlobalStyle, {theme} from './theme/globalStyles';

function App() {

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [appTheme, setAppTheme] = useState(theme);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={appTheme}>
          <UploadModal />
        {noteModalOpen && <AddNoteModal onCancel={() => setNoteModalOpen(false)}/>}
        <Main />
        <nav>
          <Timeline />
          <NavBar openNote={() => setNoteModalOpen(true)} />
        </nav>
      </ThemeProvider>
    </>
  );
}

export default App;
