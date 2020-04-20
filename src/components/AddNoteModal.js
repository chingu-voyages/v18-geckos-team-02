import React, { useState } from 'react';
import styled, { css } from 'styled-components';
// import DateAndTagsEditor from './DateAndTagsEditor';

const ModalWindow = styled.section`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

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

const AddNoteModal = ({ addUploadsToList, onCancel }) => {
  const [notesTitle, setNotesTitle] = useState("");
  const [notesBody, setNotesBody] = useState("");
  
  const handleSubmit = e => {
    e.preventDefault();
    const note = {
      name: notesTitle,
      text: notesBody,
      type: 'note'
    };
    addUploadsToList([note]);
  }

  return (
    <ModalWindow>
      <NotesForm onSubmit={handleSubmit}>
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
            primary>Submit</Button>
          <Button
            onClick={ onCancel }
            type="button"> 
            Back
          </Button>
        </ButtonGroup>
        </NotesForm>

    </ModalWindow>
    );
}
 
export default AddNoteModal;

 

