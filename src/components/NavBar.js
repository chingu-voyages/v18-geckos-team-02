import React from 'react';
import styled  from 'styled-components';
import { uploadFuncs } from '../services/dataController';

const { add } = uploadFuncs;

const NavBarContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 70px;
    background: #1B71D5;
    opacity: 0.7;
    position: fixed;
    bottom: 0px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const AddButton = styled.button`
  width: 140px;
  height: 60px;
  border-radius: 20px;
  padding: 1px;
  display: flex;
  margin: 3px;
  justify-content: center;
  align-items: center;
  font-family: 'Proza Libre', sans-serif;
  background-color: white;
  opacity: 0.9;
  border: solid 3px #1B71D5;
  border-radius: 20px;
  color: #EA9713;
  font-size: 15px;
`;

const FileUploadLabel = styled.label`
  width: 140px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 1px;
  margin: 3px;
  font-family: 'Proza Libre', sans-serif;
  background-color: white;
  opacity: 0.9;
  border: solid 3px #1B71D5;
  color: #EA9713;
  font-size: 15px;
`;

function NavBar({showUploads, setShowUploads}) {
  return (
    <NavBarContainer>
        <ButtonContainer>
          <AddButton onClick={() => setShowUploads(!showUploads)}>{showUploads ? '-' : '+'}</AddButton>
        </ButtonContainer>
    </NavBarContainer>
  );
}

export default NavBar;
