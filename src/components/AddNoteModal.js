import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {uploadFuncs} from'../services/dataController'; 
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
  background: ${props => props.primary
    ? props.theme.blue
    : props.theme.red};
  color: ${props => props.theme.offWhite};
  width: 45%;
  outline: none;
  cursor: ${props => props.disabled ? "not-allowed": "pointer"};
`;

const NotesArea = styled.textarea`
  height: 30vh;
  ${formControlBase};
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
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
        <ButtonGroup>
          <Button disabled={notesTitle === "" || notesBody === "" ? true : false }
            type="submit"
            value="Submit"
            onClick={submit}>Submit</Button>
          <Button
            onClick={close}
            type="button"> 
            Back
          </Button>
        </ButtonGroup>
        </NotesForm>

    </ModalWindow>
    );
}
 
export default AddNoteModal;

 

