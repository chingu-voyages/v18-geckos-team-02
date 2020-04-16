import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as EditorIcon } from './../assets/editor-icon.svg';

const EditorBox = styled.div`
  position: relative;
`;
const baseCss = css`
  border: none;
  padding: 0.5rem;
  margin: 0.5rem;
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

const Label = styled.label``;
const LineBreak = styled.br``;

const Select = styled.select`
${baseCss};
`;

const Option = styled.option`
${baseCss};
`;

const Input = styled.input`
${baseCss};
  ${props => props.type === "text" && css`
    padding: 0.6rem;
  `}
`;

function DateAndTagsEditor({ file, files, lastModified, updateUpload }) {
  const now = new Date().toISOString();
  const currentDate = now.substr(0, 10);
  const currentTime = now.substring(11, 16);

  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    user: currentDate,
    modified: lastModified,
    customTime: currentTime,
    tags: "",
    activeTimeStamp: "modified"
  });
  
  const handleCustomValueChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    updateUpload(file || files, values);
  }

  return (
    <EditorBox>
      <EditorIcon
        onClick={() => setIsOpen(isOpen === false ? true : false)}
      /> 
      {isOpen && 
        <EditorForm>
          <Select name="activeTimeStamp" ariaLabel="Select date to use" onChange={handleCustomValueChange}>
            <Option value="modified">Date Modified</Option>
            <Option value="user">Custom Date</Option>
          </Select>
      
            <LineBreak />
            <Input
                type="date"
                name="user"
                value={ values.activeTimeStamp === "modified" ? values.modified : values.user }
                onChange={handleCustomValueChange}
                disabled={values.activeTimeStamp === "user" ? false : true}
            /> 

              <LineBreak />
              <Label>Time: 
                <Input
                  type="time"
                  name="customTime"
                  value={ values.customTime }
                  onChange={handleCustomValueChange}
                  disabled
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
