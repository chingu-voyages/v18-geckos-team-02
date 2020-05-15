import React, {useState, useEffect} from 'react';
import Node from './Node';
import styled from 'styled-components';
import { fileObjsSubcription } from '../services/dataController';
import plusSign from '../assets/plusSign.svg';
import ImportButton from '../assets/importButton.svg';
import { importTimeLine, lastImported } from '../services/dataController';

const Wrapper = styled.main`
  display: grid;
  place-items: center center;
  margin: 2vw;
  margin-top: 0;
  padding-bottom: 200px;
  & section>div {
    margin: 8px;
  }
  & section .note {
    min-width: 300px;
  }
  & .edit-options {
    display: none;
  }
  &.editing .edit-options {
    display: flex;
  }

  &.hidden {
    overflow: hidden;
    max-height: 100vh;
  }
  color: ${props => props.theme.darkGrey};
`;
const Header = styled.header`
  width: 100%;
  text-align: center;
  margin: 24px;
  // color: ${props => props.theme.orange};
`;

const PlusImg = styled.img`
    height: 120px;
    width: 120px;
    @media (max-width: 500px){
      height: 80px;
      width: 80px;
    }
`;

const StartHelp = styled.div`
  width: 80%;
  margin-left: 10%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
`;

const ImportButtonInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

const ImportButtonLabel = styled.label`
  height: 80px;
  width: 80px;
  align-items: center;
  justify-content: center;
  margin: 8px;
  @media (max-width: 800px){
    height: 60px;
    width: 60px;
  }
`;

const ImportButtonIcon = styled.img`
  display: flex;
  height: 80px;
  width: 80px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (max-width: 800px){
    height: 60px;
    width: 60px;
  }
`;

function Main({editMode, showUploads, setShowUploads})  {
  const [activeFileObjs, setActiveFileObjs] = useState(null);
  const [importing, setImporting] = useState(false);
  useEffect(() => {
    fileObjsSubcription.subscribe(setActiveFileObjs);
    return () => fileObjsSubcription.unsubscribe(setActiveFileObjs);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/import')) {
      const name = window.location.search.substr(1);
      lastImported().then(fileName =>{
        if (fileName && name !== fileName) {
          setImporting(name);
        }
        else {
          setImporting(false);
        }
      });
    }
  })

  function getActiveNodeDate() {
    const obj = activeFileObjs[0];
    if(obj) {
      return new Date(obj.getActiveDate().substr(0, 10)).toDateString()
    }
  } 

  function handleUpload(e) {
    importTimeLine(e.target.files[0], importing).then(() => setImporting(false));
  }

  let output = (<>
    <Header>
      <StartHelp>
      <h1>Welcome!</h1>
      <PlusImg onClick={() => setShowUploads(true)} src={plusSign} alt="toggle upload modal open button" />
      <h2>Add some files to begin.</h2>
      </StartHelp>
      <StartHelp>
      <ImportButtonInput type="file" id="file" accept=".html" onChange={handleUpload} />
        <ImportButtonLabel htmlFor="file">
          <ImportButtonIcon src={ImportButton} alt="import a timeline file" />
      </ImportButtonLabel> 
      <h3>Or import a .wavy file</h3>
      </StartHelp>
    </Header>
  </>);
  if (importing) {
    output = (<>
      <Header>
          <h1>Import a Timeline</h1>
      </Header>
      <ImportButtonInput type="file" id="file" accept=".html" onChange={handleUpload} />
            <ImportButtonLabel htmlFor="file">
            <ImportButtonIcon src={ImportButton} alt="import a timeline file" />
      </ImportButtonLabel> 
      <h2>Please upload your {importing}.html file</h2>
    </>);
  }
  else if (activeFileObjs && activeFileObjs.length > 0) {
    output = <>
    <Header>
      <time>{getActiveNodeDate()}</time>
    </Header>
    <Node fileObjs={activeFileObjs} isMain />
    </>;
  }
  
  return (
    <Wrapper className={editMode ? 'editing' : showUploads ? "hidden" : ''}>
      {output}
    </Wrapper>
  );
}

export default Main;
