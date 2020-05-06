import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as EditorIcon } from './../assets/editor-icon.svg';
import { uploadFuncs } from '../services/dataController';

const { update } = uploadFuncs;

const EditorBox = styled.div`
  position: relative;
`;
const baseCss = css`
  border: none;
  padding: 0.5rem;
  margin: 0.5rem;
  background: ${props => props.theme.lightGrey};
`;

const EditorForm = styled.div`
  width: 280px;
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

const TagLists = styled.ul`
  padding: none;
`;

const Tag = styled.li`
  color: ${props => props.theme.lightGrey};
  background: ${props => props.theme.darkGrey};
  display: inline-block;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 3px;
  margin: 0.5rem 0.5rem auto auto;
`;

const DeleteBtn = styled.span`
  cursor: pointer;
  color: ${props => props.theme.greyBlue};
  font-weight: 700;
  font-size: 1rem;
  margin-left: 0.3rem;
  
  &:hover {
    color: ${props => props.theme.red};
  }
`;

function DateAndTagsEditor({ uploads, global = false }) {
  const uids = uploads.map(upload => upload.uid);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    activeTimeStamp: uploads.activeTimeStamp || "modified",
    user: (uploads.timeStamps && uploads.timeStamps.user) || formatForyyyyMMdd(Date.now()),
    modified: (uploads[0].file && uploads[0].file.lastModified) || (uploads.timeStamps && uploads.timeStamps.modified) || Date.now(),
    time: formatForHHMM((uploads.timeStamps && uploads.timeStamps.user) || Date.now()) || '00:00',
    tags: uploads.tags || []
  });
  const [tags, setTags] = useState([...new Set(uploads.map(upload => upload.tag).filter(tag => tag))]);
  const removeTag = tag => setTags( [...tags.slice(0, tags.indexOf(tag)), ...tags.slice(tags.indexOf(tag)+1)] );

  const handleCustomValueChange = e => {
    let { name, value } = e.target;
    if (name === 'tags') {
      if (value.match(/,/g) || e.key === "Enter") {
        const cleanedValue = value.replace(/^\s+|,|\s+$/g, '');
        if (cleanedValue !== "") {
          const newTags = [...new Set([...tags, cleanedValue])];
          setTags(newTags);
          update(uids, { tags: newTags });
        }
        value = '';
      }
      setValues({ ...values, tags: value });
    }
    if (name === 'user') {
      setValues({ ...values, user: value, activeTimeStamp: 'user'});
      const userDatePlusTime = formatForyyyyMMdd(value)+' '+formatForHHMM(values['time']);
        if (userDatePlusTime) {
        update(uids, {activeTimeStamp: 'user', timeStamps: { user: userDatePlusTime }});
      }
    }
    else if (name === 'time') {
      setValues({ ...values, time: value });
      const userDatePlusTime = formatForyyyyMMdd(values['user'])+' '+formatForHHMM(value);
      if (userDatePlusTime) {
        update(uids, {timeStamps: { user: userDatePlusTime }});
      }
    }
    else if (name === 'activeTimeStamp') {
      setValues({ ...values, activeTimeStamp: value });
      update(uids, {activeTimeStamp: value});
      if (value === 'user') {
        update(uids, {timeStamps: { user: values.user }});
      } 
    } 
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
      {values.activeTimeStamp === 'modified' ? <>
        <Input
            type="date"
            value={formatForyyyyMMdd(values.modified)}
            onChange={handleCustomValueChange}
            disabled
        /> 
        <Input
          type="time"
          value={formatForHHMM(values.modified)}
          onChange={handleCustomValueChange}
          disabled
        /> 
      </> : 
          <>
            <Input
                type="date"
                name="user"
                value={formatForyyyyMMdd(values.user)}
                onChange={handleCustomValueChange}
            /> 
            <Input
              type="time"
              name="time"
              value={formatForHHMM(values.time)}
              onChange={handleCustomValueChange}
            /> 
          </>}
          <LineBreak />
              <Label>Tags:  
                <Input
                  type="text"
                  name="tags"
                  value={ values.tags }
                  placeholder="Enter tags..."
                  onChange={handleCustomValueChange}
                  onKeyPress={handleCustomValueChange}
                />
              </Label> 
              <LineBreak />
          <TagLists>
            {!global && tags.map(tag => <Tag key={tag}>{tag}<DeleteBtn ariaLabel="Delete tag" onClick = {() => removeTag(tag)}>&times;</DeleteBtn></Tag>)}
            </TagLists>
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
  const output = d.getFullYear() + '-' +
      makeMinTwoDigits(d.getMonth()+1) + '-' +
      makeMinTwoDigits(d.getDate());
  if (output.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return output
  }
  else {
    return date
  }
}

function formatForHHMM(date) {
  const d = new Date(date);
  const output = makeMinTwoDigits(d.getHours()) + ':' +
  makeMinTwoDigits(d.getMinutes());
  if (output.match(/^\d\d:\d\d$/)) {
    return output
  }
  else {
    return date
  }
}