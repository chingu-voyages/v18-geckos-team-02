import React, { useState } from 'react';
import styled, { css } from 'styled-components';
// import DateAndTagsEditor from './DateAndTagsEditor';

const NotesForm = styled.form`
  max-width: 414px;
  margin: auto;
  background: ${props => props.theme.lightGrey};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 2rem 2rem;
`;

const formControlBase = css`
  padding: 0.8rem;
  margin-top: 1rem;
  border: none;
  width: 100%;
`;
const Input = styled.input`
  ${formControlBase}
`;

const Button = styled.button`
  ${formControlBase}
  background: ${props => props.primary
    ? props.theme.blue
    : props.theme.red};
  color: ${props => props.theme.offWhite};
  width: 45%;
  outline: none;
`;

const NotesArea = styled.textarea`
  height: 30vh;
  ${formControlBase}
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const AddNoteModal = ({ onSubmit, onCancel }) => {

  const [notesTitle, setNotesTitle] = useState("");
  const [notesBody, setNotesBody] = useState("");

  return (
    <NotesForm onSubmit={ onSubmit }>
      <Input type="text"
        name="title"
        id="title" 
        placeholder="Title"
        aria-label="Title"
        value={ notesTitle }
        onChange={ e => setNotesTitle(e.target.value) }
      />
      <NotesArea type="text-area"
        name="notes"
        id="notes"
        placeholder="Enter your notes here"
        aria-label="Notes area"
        value={ notesBody }
        onChange={ e => setNotesBody(e.target.value) }
      />
      <ButtonGroup>
        <Button
          type="submit"
          value="Submit"
          primary>Submit</Button>
        <Button
          onClick={ onCancel }
          type="button"> 
          Back
        </Button>
      </ButtonGroup>
      </NotesForm>
    );
}
 
export default AddNoteModal;

 

