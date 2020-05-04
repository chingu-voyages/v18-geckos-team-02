import React, {useState, useEffect} from 'react';
import Node from './Node';
import styled from 'styled-components';
import { subscribeActiveFileObjs } from '../services/dataController';

const Wrapper = styled.main`
  display: grid;
  place-items: center center;
  margin: 2vw;
  margin-top: 0;
  & section>div {
    margin: 8px;
    min-height: 150px;
  }
  & section>.note {
    min-width: 300px;
  }
  color: ${props => props.theme.darkGrey};
`;
const Header = styled.header`
  width: 100%;
  text-align: center;
  margin: 24px;
`;

function Main()  {
  const [activeFileObjs, setActiveFileObjs] = useState([])
  useEffect(() => {
    subscribeActiveFileObjs(setActiveFileObjs);
  }, []
  )

  function getActiveNodeDate() {
    const obj = activeFileObjs[0];
    if(obj) {
      return new Date(obj.unFormatDate(obj.getActiveDate()).substr(0, 10)).toDateString()
    }
  } 

  let output = 'tutorial Gifs';
  if (activeFileObjs.length !== 0) {
    output = <>
    <Header>
      <time>{getActiveNodeDate()}</time>
    </Header>
    <Node fileObjs={activeFileObjs} timeWanted />
    </>;
  }
  
  return (
    <Wrapper>
      {output}
    </Wrapper>
  );
}

export default Main;
