import React from 'react';
import styled  from 'styled-components';

export const NavBarContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 70px;
    background: #1B71D5;
    opacity: 0.7;
    position: fixed;
    bottom: 0px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const AddNoteButton = styled.button`
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

export const FileUploadInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

export const FileUploadLabel = styled.label`
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

function NavBar({ openTimeline, openNote, addUploadsToList }) {

  function handleOnChange(e) {
    addUploadsToList(e.target.files);
    e.target.value = null;
  }
  return (
    <NavBarContainer>
        <ButtonContainer>
          <FileUploadInput type="file" id="file" onChange={handleOnChange} multiple/> 
          <FileUploadLabel htmlFor="file">UPLOAD FILES</FileUploadLabel>
          <AddNoteButton onClick={openNote}>ADD NOTE</AddNoteButton>
        </ButtonContainer>
    </NavBarContainer>
  );
}

export default NavBar;
