import React , {useState, useEffect} from 'react';
import styled from 'styled-components';
import DateAndTagsEditor from './DateAndTagsEditor';
import { uploadFuncs } from '../services/dataController';
import AddNoteModal from './AddNoteModal';

const { add, submit, subscribe, cancel } = uploadFuncs;

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
  display: grid;
  grid-template-rows: 40px auto 40px;
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

export const ToolsGroups = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    place-self: bottom center;
`;

const AddNoteButton = styled.button`
  width: 140px;
  height: 60px;
  border-radius: 20px;
  padding: 1px;
  display: flex;
  margin: 3px;
  justify-content: center;
  align-items: center;
  font-family: 'Proza Libre', sans-serif;
  background-color: white;
  opacity: 0.9;
  border: solid 3px #1B71D5;
  border-radius: 20px;
  color: #EA9713;
  font-size: 15px;
`;

export const FileUploadInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

export const FileUploadLabel = styled.label`
  width: 140px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 1px;
  margin: 3px;
  font-family: 'Proza Libre', sans-serif;
  background-color: white;
  opacity: 0.9;
  border: solid 3px #1B71D5;
  color: #EA9713;
  font-size: 15px;
`;

const getShortName = fileName =>  fileName.length <= 23 ? fileName : fileName.substr(0, 20) + "...";
  
  // fileName.length < 22 ? fileName : fileName.substr(0, 20) + "-" + fileName.substr(20, 18) + "...";


function UploadModal({close}) {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  useEffect(() => {
    subscribe(setUploads);
  }, []
  )

  function handleOnChange(e) {
    add(e.target.files);
    e.target.value = null;
  }

  const modal = (<>
    <ModalWindow>
      <UploadModalWrapper>
        <AddedFiles>
          <ModalTitle>{uploads.length < 1 ? "Upload some file(s)" : "Files ready to upload!"}</ModalTitle>
          <FileList>
            {uploads.map(upload =>
              <FileItem key={upload.uid}>
              <FileName>{getShortName(upload.file.name).toLowerCase()}</FileName>
                <DateAndTagsEditor {...{ uploads: [upload] }}/>
                <DeleteButton
                  onClick={ () => delete(upload.uid) }
                  aria-label="Delete upload">
                  &times;
              </DeleteButton>
            </FileItem>)}
          </FileList>
        </AddedFiles>
        <ToolsGroups>
            <FileUploadInput type="file" id="file" onChange={handleOnChange} multiple/> 
            <FileUploadLabel htmlFor="file">ADD FILES</FileUploadLabel>
            <AddNoteButton onClick={() => setNoteModalOpen(true)}>ADD NOTE</AddNoteButton>
          </ToolsGroups>
        {uploads.length > 1 && <DateAndTagsEditor {...{ uploads }} />}
        <ButtonGroup>
          <Button disabled={uploads.length < 1 ? true : false } onClick={() => {submit(); close()}}>Save</Button>
          {/* <Button onClick={() => {cancel(); close()}} name="cancel">Cancel</Button> */}
        </ButtonGroup>
      </UploadModalWrapper>
    </ModalWindow>
  </>);

  

  return noteModalOpen ? <AddNoteModal close={() => setNoteModalOpen(false)}/> : modal;
}
 
export default UploadModal;
