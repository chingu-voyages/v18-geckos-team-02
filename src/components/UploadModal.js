import React from 'react';
import styled from 'styled-components';
import DateAndTagsEditor from './DateAndTagsEditor';

const ModalBox = styled.div`
  max-width: 414px;
  margin: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
`;
const AddedFiles = styled.div`
  min-height: 50vh;
  border: 2px solid ${props => props.theme.blue};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FileList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  aligb-items: center;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  padding: 0.5rem;
`;

const FileName = styled.p`
  flex-basis: 50%;
`;

const DeleteButton = styled.button`
  color: ${props => props.theme.grey};
  background: none;
  outline: none;
  border: 1px solid ${props => props.theme.lightGrey};
  font-size: 2rem;
  padding: 0.1rem 0.5rem;

  &:hover {
    color: ${props => props.theme.offWhite};
    background: ${props => props.theme.red};
  }
`;

const UploadButton = styled.button`
  padding: 0.8rem;
  margin: 1rem auto;
  border: none;
  width: 90%;
  color: ${props => props.theme.offWhite};
  background: ${props => props.theme.blue};
  cursor: ${props => props.disabled ? "not-allowed": "pointer"};
`;

const UploadModal = ({ uploads, deleteUpload, updateDatesOrTags, sumbitUploads }) => {
  return (
    <ModalBox>
      <AddedFiles>
        <ModalTitle>Files ready to upload!</ModalTitle>
        <FileList>
          {uploads.map(upload =>
            <FileItem key={upload.uid}>
            <FileName>{upload.file.name}</FileName>
              <DateAndTagsEditor {...{ uploads: [upload], updateDatesOrTags }}/>
              <DeleteButton
                onClick={ () => deleteUpload(upload.uid) }
                aria-label="Delete upload">
                &times;
            </DeleteButton>
          </FileItem>)}
        </FileList>
      </AddedFiles>
      {uploads.length > 1 && <DateAndTagsEditor {...{ uploads, updateDatesOrTags }} />}
      {uploads.length < 1
        ? <UploadButton disabled>Upload</UploadButton>
        : <UploadButton onClick={sumbitUploads}>Upload</UploadButton>}  
    </ModalBox>
    );
}
 
export default UploadModal;
