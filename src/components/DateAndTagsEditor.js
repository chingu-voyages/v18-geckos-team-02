import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as EditorIcon } from './../assets/editor-icon.svg';

const EditorBox = styled.div`
  position: relative;
`;
const baseCss = css`
  border: none;
  padding: 0.5rem;
  margin: 0.5rem;
  background: ${props => props.theme.lightGrey};
`;

const EditorForm = styled.form`
  width: 250px;
  margin: auto;
  padding: 1rem;
  background: ${props => props.theme.grey};
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
  const currentDate = Date.now();
  const uids = uploads.map(upload => upload.uid);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    user: currentDate,
    modified: !uploads[0].file.lastModified ? currentDate : uploads[0].file.lastModified,
    tags: "",
    time:!uploads[0].file.lastModified ? currentDate : uploads[0].file.lastModified,
    activeTimeStamp: "modified",
  });
  
  const handleCustomValueChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  useEffect(() => {
    if (!isOpen) {
      const {user, modified, tags, activeTimeStamp} = values;
      updateDatesOrTags(uids, {
        timeStamps: {
          modified: modified,
          user: user,
        },
        activeTimeStamp: activeTimeStamp,
        tags: [tags],
      });
    }
  }, [isOpen]);

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
                  name={values.time}
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
                  onChange={handleCustomValueChange}
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