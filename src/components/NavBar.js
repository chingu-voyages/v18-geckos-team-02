import React from 'react';
import styled  from 'styled-components';
import plusSign from '../assets/plusSign.svg';
import logo from './../../src/assets/wavy-logo.svg';
import minusSign from '../assets/minusSign2.svg';
import EditButton from  '../assets/trashIcon.svg';
import ImportButton from '../assets/importButton.svg';
import ExportButton from '../assets/exportButton.svg';


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

const TogglenModalButton = styled.div`
    display: flex;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
`;
const LogoWrapper = styled.div`
  position: absolute;
  left: 0;
`;

const EditModeButton = styled.img`
    display: flex;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
`;

const ExportButtonContainer = styled.img`
  display: flex;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;
`;

const ImportButtonContainer = styled.img`
  display: flex;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;
`;

function NavBar({showUploads, setShowUploads, editMode, setEditMode}) {
  return (
    <NavBarContainer>
      <LogoWrapper>
        <img src={logo} alt="Wavy logo"/>
      </LogoWrapper>
        <ButtonContainer>
          <TogglenModalButton onClick={() => setShowUploads(!showUploads)}>
            {
              !showUploads ?
              <img src={plusSign} alt="toggle upload modal open button" /> : 
              <img  src={minusSign} alt="toggle upload modal closed button" />  
            } 
          </TogglenModalButton>
          <EditModeButton src={EditButton} onClick={() => setEditMode(!editMode)} />
          <ImportButtonContainer src={ImportButton} alt="import a timline button" />
          <ExportButtonContainer src={ExportButton} alt="export a timline button" />

        </ButtonContainer>
    </NavBarContainer>
  );
}

export default NavBar;
