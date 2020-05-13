import React from 'react';
import styled  from 'styled-components';
import plusSign from '../assets/plusSign.svg';
import logo from './../../src/assets/wavy-logo.svg';
import minusSign from '../assets/minusSign2.svg';
import EditButton from  '../assets/trashTumbleIcon.svg';
import ImportButton from '../assets/importButton.svg';
import ExportButton from '../assets/exportButton.svg';
import { importTimeLine } from '../services/dataController';

const NavBarContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 5fr auto 5fr auto 1fr;
    grid-template-areas: '. logo . buttons . importexport .';
    justify-content: space-between;
    place-items: center center;
    width: 100%;
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
  grid-area: logo;
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
    width: auto;
    grid-area: buttons;
`;

const ToggleModalButton = styled.div`
    display: flex;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
    cursor: pointer;
    @media (max-width: 800px){
      height: 40px;
      width: 40px;
    }
`;

const ImportExportTools = styled.div`
  display: flex;
  flex-flow: row nowrap;
  grid-area: importexport;
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
  cursor: pointer;
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
  cursor: pointer;
  @media (max-width: 800px){
    height: 40px;
    width: 40px;
  }
`;



function NavBar({showUploads, setShowUploads, editMode, setEditMode, showExports, setShowExports}) {

  function handleUpload(e) {
    importTimeLine(e.target.files[0]);
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
        <EditModeButton alt="Edit" src={EditButton} onClick={() => setEditMode(!editMode)} />
      </ButtonContainer>
      <ImportExportTools>
        <ImportButtonInput type="file" id="file" accept=".wavy" onChange={handleUpload} />
        <ImportButtonLabel htmlFor="file">
          <ImportButtonIcon src={ImportButton} alt="import a timeline file" />
        </ImportButtonLabel> 
        <ExportButtonContainer src={ExportButton} onClick={() => setShowExports(!showExports) } alt="open export options list" />
      </ImportExportTools>
    </NavBarContainer>
  );
}

export default NavBar;
