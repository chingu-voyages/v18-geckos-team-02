import React, {useState, useEffect} from 'react';
import Node from './Node';
import styled from 'styled-components';
import { fileObjsSubcription } from '../services/dataController';

const Wrapper = styled.main`
  display: grid;
  place-items: center center;
  margin: 2vw;
  margin-top: 0;
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

function Main({editMode, showUploads})  {
  const [activeFileObjs, setActiveFileObjs] = useState(null);
  useEffect(() => {
    fileObjsSubcription.subscribe(setActiveFileObjs);
    return () => fileObjsSubcription.unsubscribe(setActiveFileObjs);
  }, []
  )

  function getActiveNodeDate() {
    const obj = activeFileObjs[0];
    if(obj) {
      return new Date(obj.unFormatDate(obj.getActiveDate()).substr(0, 10)).toDateString()
    }
  } 

  let output = 'tutorial Gifs';
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
