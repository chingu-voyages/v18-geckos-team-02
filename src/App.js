import React, {useState} from 'react';
import Main from './components/Main';
import Timeline from './components/Timeline';
import NavBar from './components/NavBar';
import UploadModal from './components/UploadModal';
import styled, {ThemeProvider} from 'styled-components';
import GlobalStyle, {theme} from './theme/globalStyles';

function App() {
  const [appTheme, setAppTheme] = useState(theme);
  const [showUploads, setShowUploads] = useState(false);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={appTheme}>
        {showUploads && <UploadModal close={() => setShowUploads(false)} />}
        <Main />
        <nav>
          <Timeline />
          <NavBar {...{showUploads, setShowUploads}} />
        </nav>
      </ThemeProvider>
    </>
  );
}

export default App;
