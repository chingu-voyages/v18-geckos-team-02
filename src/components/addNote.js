import React from 'react';
import styled from 'styled-components';

const NotesWrapper = styled.div`
  max-width: 414px;
  height: 100%;
  background: ${props => props.theme.lightGrey};
  margin: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const NotesForm = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Input = styled.input`
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: none;
  outline-color: ${props => props.theme.blue};
`;

const NotesArea = styled.textarea`
  height: 30vh;
  padding: 0.6rem;
  border: none;
  outline-color: ${props => props.theme.blue};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0 0;
`;

const Button = styled.button`
border: none;
outline: none;
color: #F6F6F6;
background: ${props => props.primary ?
  props.theme.blue : props.theme.red};
padding: 0.6rem;
width: 45%;
cursor: pointer;
`;

const AddNote = () => {
  return (
    <NotesWrapper>
      <NotesForm>
        <FormGroup>
          <Input type="text"
            name="title"
            id="title" // Is id necessary here?
            placeholder="Title"
            aria-label="Title"
          />
          <NotesArea type="text-area"
            name="notes"
            id="notes"
            placeholder="Enter your notes here"
            aria-label="Notes area"
          />
          <ButtonGroup>
            <Button primary
              type="submit">
              Submit
            </Button>
            <Button type="button">
              Cancel
            </Button>   
          </ButtonGroup>
        </FormGroup>
      </NotesForm>
    </NotesWrapper>
    );
}
 
export default AddNote;