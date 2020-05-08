import React from 'react';
import styled  from 'styled-components';
import plusSign from '../assets/plusSign.svg';
import logo from './../../src/assets/wavy-logo.svg';
import minusSign from '../assets/minusSign2.svg';
import EditButton from  '../assets/trashTumbleIcon.svg';
import ImportButton from '../assets/importButton.svg';
import ExportButton from '../assets/exportButton.svg';
import {exportTimeLine, importTimeLine} from '../services/dataController';

const NavBarContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 200px 1fr;
    justify-content: center;
    width: 100vw;
    height: 70px;
    background: #1B71D5;
    opacity: 0.7;
    position: fixed;
    bottom: 0px;
`;

const Logo = styled.img`
  padding-left: 30px;
  width: 230px;
  height: 50px;
  align-self: center;

  @media (max-width: 800px){
    width: 70px;
    height: 30px;
    align-self: center;
    padding-left: 5px;

  }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    justify-content: center;
    align-items: center;
    justify-self: center;
    border: 1px solid green;
    width: auto;
`;

const ToggleModalButton = styled.div`
    display: flex;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;

    @media (max-width: 800px){
      height: 40px;
      width: 40px;
    }
`;

const PlusImg = styled.img`
    height: 60px;
    width: 60px;

    @media (max-width: 800px){
      height: 40px;
      width: 40px;
    }
`;

const MinusImg = styled.img`
    height: 60px;
    width: 60px;
    @media (max-width: 800px){
      height: 40px;
      width: 40px;
    }
`;


const EditModeButton = styled.img`
    display: flex;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
    margin-left: 5px;

    @media (max-width: 800px){
      height: 40px;
      width: 40px;
    }
`;

export const ImportButtonInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

export const ImportButtonLabel = styled.label`
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;
  margin-left: 5px;

  @media (max-width: 800px){
    height: 40px;
    width: 40px;
  }
`;

const ImportButtonIcon = styled.img`
  display: flex;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;

  @media (max-width: 800px){
    height: 40px;
    width: 40px;
  }
`;

const ExportButtonContainer = styled.img`
  display: flex;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  
  @media (max-width: 800px){
    height: 40px;
    width: 40px;
  }
`;

function NavBar({showUploads, setShowUploads, editMode, setEditMode}) {
  function handleOnChange(e) {
    importTimeLine(e.target.files));
    e.target.value = null;
  }

  return (
    <NavBarContainer>
      <Logo src={logo} alt="Wavy logo"/>
        <ButtonContainer>
          <ToggleModalButton onClick={() => setShowUploads(!showUploads)}>
            {
              !showUploads ?
              <PlusImg src={plusSign} alt="toggle upload modal open button" /> : 
              <MinusImg  src={minusSign} alt="toggle upload modal closed button" />  
            } 
          </ToggleModalButton>
          <EditModeButton src={EditButton} onClick={() => setEditMode(!editMode)} />
          <ImportButtonInput type="file" id="file" onChange={handleOnChange} multiple/>
          <ImportButtonLabel htmlFor="file">
            <ImportButtonIcon src={ImportButton} alt="import a timeline file" />
          </ImportButtonLabel> 
          <ExportButtonContainer src={ExportButton} onClick={exportTimeLine} alt="export a timline file" />

        </ButtonContainer>
    </NavBarContainer>
  );
}

export default NavBar;