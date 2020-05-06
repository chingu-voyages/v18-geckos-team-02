import React from 'react';
import styled  from 'styled-components';
import { uploadFuncs } from '../services/dataController';
import plusSign from '../assets/plusSign.svg';
import minusSign from '../assets/minusSign.svg'

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

const EditModeButton = styled.div`
    display: flex;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
`;

function NavBar({showUploads, setShowUploads, editMode, setEditMode}) {
  return (
    <NavBarContainer>
        <ButtonContainer>
          <TogglenModalButton onClick={() => setShowUploads(!showUploads)}>
            {
              !showUploads ?
              <img src={plusSign} alt="toggle upload modal open button" /> : 
              <img  src={minusSign} alt="toggle upload modal open button" />  
            } 
          </TogglenModalButton>
          <EditModeButton onClick={() => setEditMode(!editMode)}>
            E
          </EditModeButton>
        </ButtonContainer>
    </NavBarContainer>
  );
}

export default NavBar;
