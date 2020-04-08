import React from 'react';
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
  return (
    <>
      <GlobalStyle />
      <Demo>
        <AppTitle>Timeline app</AppTitle>
      </Demo>
    </>
  );
}

export default App;
