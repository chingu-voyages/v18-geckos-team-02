import React, {useState, useEffect} from 'react';
import Node from './Node';
import styled from 'styled-components';
import { fileObjsSubcription } from '../services/dataController';
import plusSign from '../assets/plusSign.svg';

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
      height: 40px;
      width: 40px;
    }
`;

const StartHelp = styled.div`
  height: 80vh;
  width: 80%;
  margin-left: 10%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
`;

function Main({editMode, showUploads, setShowUploads})  {
  const [activeFileObjs, setActiveFileObjs] = useState(null);
  useEffect(() => {
    fileObjsSubcription.subscribe(setActiveFileObjs);
    return () => fileObjsSubcription.unsubscribe(setActiveFileObjs);
  }, []);

  function getActiveNodeDate() {
    const obj = activeFileObjs[0];
    if(obj) {
      return new Date(obj.getActiveDate().substr(0, 10)).toDateString()
    }
  } 

  let output = (<>
    <Header>
      <StartHelp>
      <h1>Welcome!</h1>
      <PlusImg onClick={() => setShowUploads(true)} src={plusSign} alt="toggle upload modal open button" />
      <h2>Add some files to begin.</h2>
      </StartHelp>
    </Header>
  </>);
  if (activeFileObjs && activeFileObjs.length > 0) {
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
