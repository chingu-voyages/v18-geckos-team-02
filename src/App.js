import React, {useState} from 'react';
import Main from './components/Main';
import Timeline from './components/Timeline';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import {ThemeProvider} from 'styled-components';
import GlobalStyle, {theme} from './theme/globalStyles';

function App() {
  const [editMode, setEditMode] = useState(false);
  const [showUploads, setShowUploads] = useState(false);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        {showUploads && <UploadModal close={() => setShowUploads(false)} />}
        <Main {...{editMode, showUploads, setShowUploads}} />
        <nav>
          <Timeline {...{editMode}} />
          <NavBar {...{showUploads, setShowUploads, editMode, setEditMode}} />
        </nav>
      </ThemeProvider>
    </>
  );
}

export default App;
