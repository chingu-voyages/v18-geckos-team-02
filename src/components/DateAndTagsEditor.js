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

function DateAndTagsEditor({ uploads, updateDatesOrTags }) {
  const now = new Date().toISOString();
  const currentDate = now.substr(0, 10);
  const currentTime = now.substring(11, 16);
  const uids = uploads.map(upload => upload.uid);

  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    user: uploads[0].timeStamps.user || currentDate,
    modified: uploads[0].timeStamps.modified,
    tags: [],
    activeTimeStamp: "modified",
  });
  
  const handleCustomValueChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    updateDatesOrTags(uids, {[name]: value});
  }

  return (
    <EditorBox>
      <EditorIcon
        onClick={() => setIsOpen(isOpen === false ? true : false)}
      /> 
      {isOpen && 
        <EditorForm>
          <Select name="activeTimeStamp" ariaLabel="Select date to use" onChange={handleCustomValueChange} value={values.activeTimeStamp}>
            <Option value="modified">Date Modified</Option>
            <Option value="user">Custom Date</Option>
          </Select>
      
            <LineBreak />
            <Input
                type="date"
                name={values.activeTimeStamp}
                value={formatForyyyyMMdd(values[values.activeTimeStamp])}
                onChange={handleCustomValueChange}
                disabled={values.activeTimeStamp === "user" ? false : true}
            /> 

              <LineBreak />
              <Label>Time: 
                <Input
                  type="time"
                  name={values.activeTimeStamp}
                  value={formatForHHMM(values[values.activeTimeStamp])}
                  onChange={handleCustomValueChange}
                  disabled={values.activeTimeStamp === "user" ? false : true}
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

const makeMinTwoDigits = n => {
  const str = n+'';
  return str.length === 1 ? '0'+str : str
};
function formatForyyyyMMdd(date) {
  const d = new Date(date);
  return d.getFullYear() + '-' +
      makeMinTwoDigits(d.getMonth()+1) + '-' +
      makeMinTwoDigits(d.getDate());
}

function formatForHHMM(date) {
  const d = new Date(date);
  return makeMinTwoDigits(d.getHours()) + ':' +
  makeMinTwoDigits(d.getMinutes());
}