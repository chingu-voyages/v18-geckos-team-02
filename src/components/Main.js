import React, {useState} from 'react';
import Node from './Node';
import styled from 'styled-components';

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

function Main({getFileObjs, getFile, removeFile, activeNode})  {
  const [fileObjs, setFileObjs] = useState();
  const [activeNodeDate, setActiveNodeDate] = useState();

  getFileObjs(activeNode, activeNode.substr(0,8)+'2359').then(fileObjs => {
    setActiveNodeDate(new Date(fileObjs[0].unFormatDate(fileObjs[0].getActiveDate()).substr(0, 10)).toDateString());
    setFileObjs(fileObjs);
  });


  
  let output = 'tutorial Gifs';
  if (activeNodeDate) {
    output = <>
    <Header>
      <time dateTime={activeNodeDate}>{activeNodeDate}</time>
    </Header>
    <Node {...{fileObjs, getFile, removeFile}} timeWanted />
    </>;
  }
  
  return (
    <Wrapper>
      {output}
    </Wrapper>
  );
}

export default Main;
