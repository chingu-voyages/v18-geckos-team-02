import React from 'react';
import styled from 'styled-components';
import DateAndTagsEditor from './DateAndTagsEditor';

const ModalWindow = styled.section`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${props => props.theme.greyBlueTransp};
`;

const UploadModalWrapper = styled.div`
  max-width: 414px;
  margin: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.lightGrey};
  position: relative;
  z-index: 60;
`;
const AddedFiles = styled.div`
  min-height: 50vh;
  width: 100%;
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
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  padding: 0.5rem;
`;

const FileName = styled.p`
  flex-basis: 50%;
`;

const DeleteButton = styled.button`
  background: none;
  outline: none;
  border: 1px solid ${props => props.theme.greyBlue};
  font-size: 2rem;
  padding: 0.1rem 0.5rem;

  &:hover {
    color: ${props => props.theme.offWhite};
    background: ${props => props.theme.red};
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  border: none; 
  width: ${props => props.name === "cancel" ? "30%" : "63%"};
  color: ${props => props.theme.offWhite};
  background: ${props => props.name === "cancel" ? props.theme.red : props.theme.blue};
  cursor: ${props => props.disabled === true ? "not-allowed": "pointer"};
`;

const ButtonGroup = styled.div`
  margin: 1rem auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const getShortName = fileName =>  fileName.length <= 23 ? fileName : fileName.substr(0, 20) + "...";
  
  // fileName.length < 22 ? fileName : fileName.substr(0, 20) + "-" + fileName.substr(20, 18) + "...";


const UploadModal = ({ uploads, deleteUpload, updateDatesOrTags, sumbitUploads, close, getTags, deleteTag }) => {
  return (
    <ModalWindow>
      <UploadModalWrapper>
        <AddedFiles>
          <ModalTitle>{uploads.length < 1 ? "Upload some file(s)" : "Files ready to upload!"}</ModalTitle>
          <FileList>
            {uploads.map(upload =>
              <FileItem key={upload.uid}>
              <FileName>{getShortName(upload.file.name).toLowerCase()}</FileName>
                <DateAndTagsEditor {...{ uploads: [upload], updateDatesOrTags, getTags, deleteTag }}/>
                <DeleteButton
                  onClick={ () => deleteUpload(upload.uid) }
                  aria-label="Delete upload">
                  &times;
              </DeleteButton>
            </FileItem>)}
          </FileList>
        </AddedFiles>
        {uploads.length > 1 && <DateAndTagsEditor {...{ uploads, updateDatesOrTags, getTags, global }} />}
        <ButtonGroup>
          <Button disabled={uploads.length < 1 ? true : false } onClick={sumbitUploads}>Save</Button>
          <Button onClick={ close } name="cancel">Cancel</Button>
        </ButtonGroup>
      </UploadModalWrapper>
    </ModalWindow>
    );
}
 
export default UploadModal;
