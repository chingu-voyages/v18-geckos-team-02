import React from 'react';
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

function Main({activeNode, getRefs, getFile}) {
  let output = 'tutorial Gifs';
  if (activeNode) {
    const fileRefs = getRefs(activeNode, activeNode.substr(0,8)+'2359');
    const nodeDate = new Date(`${activeNode.substr(0,4)}-${activeNode.substr(4,2)}-${activeNode.substr(6,2)}`).toDateString();
    output = <>
    <Header>
      <time dateTime={nodeDate}>{nodeDate}</time>
    </Header>
    <Node {...{fileRefs, getFile}} timeWanted />
    </>;
  }
  
  return (
    <Wrapper>
      {output}
    </Wrapper>
  );
}

export default Main;
