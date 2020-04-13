import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as EditorIcon } from './../assets/editor-icon.svg';

const EditorBox = styled.div`
  position: relative;
`;

const EditorForm = styled.form`
  width: 310px;
  margin: auto;
  padding: 1rem;
  background: ${props => props.theme.lightGrey};
  text-align: right;
  position: absolute;
  top: 2.2rem;
  right: 0;
  z-index: 999;
`;

const Label = styled.label`
`;

const LineBreak = styled.br``;

const Input = styled.input`
  border: none;
  padding: 0.5rem;
  margin: 0.5rem;

  ${props => props.type === "text" && css`
    padding: 0.6rem;
  `}
`;

function DateAndTagsEditor({ file, updateUploads }) {
  const now = new Date().toISOString();
  const currentDate = now.substr(0, 10);
  const currentTime = now.substring(11, 16);

  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({ customDate: currentDate, customTime: currentTime, tags: "" });
  
  const handleCustomValueChange = e => {
    const {name, value} = e.target
    setValues({ ...values, [name]: value });
    updateUploads(file, values);
  }

  return (
    <EditorBox>
      <EditorIcon
        onClick={() => setIsOpen(isOpen === false ? true : false)}
      /> 
      {isOpen && 
        <EditorForm>
          <Label>Custom Date:  
            <Input
              type="date"
              name="customDate"
              value={ values.customDate }
              onChange={ handleCustomValueChange }
            /> 
          </Label> 
          <LineBreak />
          <Label>Time: 
            <Input
              type="time"
              name="customTime"
              value={ values.customTime }
              onChange={ handleCustomValueChange }
            />
          </Label> 
          <LineBreak />
          <Label>Tags:  
            <Input
              type="text"
              name="tags"
              value={ values.tags }
              placeholder="Enter tags..."
              onChange={ handleCustomValueChange }
            />
          </Label> 
          <LineBreak />
        </EditorForm>
      }
    </EditorBox>
  );
}

export default DateAndTagsEditor;
