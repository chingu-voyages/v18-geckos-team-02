import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { uploadFuncs } from '../services/dataController'; 
import { ReactComponent as BackArrow } from './../assets/back-arrow.svg';
import { ReactComponent as TickIcon } from './../assets/completionTick.svg';
// import DateAndTagsEditor from './DateAndTagsEditor';

const { add } = uploadFuncs;

const ModalWindow = styled.section`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: ${props => props.theme.greyBlueTransp};
`;

const NotesForm = styled.div`
  max-width: 414px;
  margin: auto;
  background: ${props => props.theme.lightGrey};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 2rem 2rem;
  position: relative;
  z-index: 60;
  top: 20px;
`;

const formControlBase = css`
  padding: 0.8rem;
  margin-top: 1rem;
  border: none;
  width: 100%;
`;
const Input = styled.input`
  ${formControlBase};
`;

const Button = styled.button`
  ${formControlBase}
  background: ${props => props.theme.blue};
  width: 100%;
  outline: none;
`;

const NotesArea = styled.textarea`
  height: 30vh;
  ${formControlBase};
`;

const AddNoteModal = ({ close }) => {
  const [notesTitle, setNotesTitle] = useState("");
  const [notesBody, setNotesBody] = useState("");
  
  const submit = () => {
    const note = {
      name: notesTitle,
      text: notesBody,
      type: 'note'
    };
    add([note]);
    close();
  }
  const hasNotes = notesTitle !== "" && notesBody !== "";

  return (
    <ModalWindow>
      <NotesForm>
        <Input type="text"
          name="title"
          id="title" 
          placeholder="Title"
          ariaLabel="Title"
          value={ notesTitle }
          onChange={ e => setNotesTitle(e.target.value) }
        />
        <NotesArea type="text-area"
          name="notes"
          id="notes"
          placeholder="Enter your notes here"
          ariaLabel="Notes area"
          value={ notesBody }
          onChange={ e => setNotesBody(e.target.value) }
        />
          <Button
          type={hasNotes ? "submit" : "button"}
          onClick={hasNotes ? submit : close}>{hasNotes ? <TickIcon /> : <BackArrow />}
        </Button>
        </NotesForm>
    </ModalWindow>
    );
}
 
export default AddNoteModal;

 

