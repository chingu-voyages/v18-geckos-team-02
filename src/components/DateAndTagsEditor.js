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

const EditorForm = styled.form`
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

function DateAndTagsEditor({ uploads, getTags, deleteTag, global }) {
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
      update(uids, {
        timeStamps: {
          modified: modified,
          user: user,
        },
        activeTimeStamp: activeTimeStamp,
        tags: tags.split(","),
      });
    }
    values.tags = "";
  }, [isOpen]);

  const Tags = getTags(uploads[0]);

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
          <TagLists>
            {!global && Tags && Tags.map((tag, index) => <Tag key={tag+index}>{tag}<DeleteBtn ariaLabel="Delete tag" onClick = {() => deleteTag(uploads[0], tag[index])}>&times;</DeleteBtn></Tag>)}
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
  return d.getFullYear() + '-' +
      makeMinTwoDigits(d.getMonth()+1) + '-' +
      makeMinTwoDigits(d.getDate());
}

function formatForHHMM(date) {
  const d = new Date(date);
  return makeMinTwoDigits(d.getHours()) + ':' +
  makeMinTwoDigits(d.getMinutes());
}