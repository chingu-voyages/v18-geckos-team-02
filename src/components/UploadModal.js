import React , {useState, useEffect} from 'react';
import styled from 'styled-components';
import DateAndTagsEditor from './DateAndTagsEditor';
import { uploadFuncs } from '../services/dataController';
import AddNoteModal from './AddNoteModal';
import completionTick from '../assets/completionTick.svg';

const { add, submit, subscribe, deleteUpload } = uploadFuncs;

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
  min-height: 52vh;
  position: relative;
  top: -16px;
  width: 108%;
  background-color: ${props => props.theme.offWhite};
  padding: 1rem;
  margin-bottom: 7px;
  display: grid;
  grid-template-rows: 40px auto 40px;
  // justify-content: center;
`;

const ModalTitle = styled.h2`
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${props => props.theme.orange};
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
  margin-left: 15px;
  margin-right: 15px;
`;

const FileName = styled.p`
  flex-basis: 50%;
`;

const GlobalWrapper = styled.div`
  justify-self: center;   
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
  width: ${props => props.name === "cancel" ? "30%" : "70%"};
  color: ${props => props.theme.offWhite};
  background: ${props => props.name === "cancel" ? props.theme.red : props.theme.blue};
  cursor: ${props => props.disabled === true ? "not-allowed": "pointer"};
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
`;

const ButtonGroup = styled.div`
  margin: 1rem auto;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ToolsGroups = styled.div`
    display: flex;
    flex-direction: row;
    width: 70%;
    margin-top: 5px;
    justify-content: space-between;
    align-items: center;
    place-self: bottom center;

`;

const AddNoteButton = styled.div`
  width: 120px;
  height: 60px;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Proza Libre', sans-serif;
  background-color: white;
  opacity: 0.9;
  color: #EA9713;
  font-size: 15px;
  cursor: pointer;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
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
  width: 120px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  font-family: 'Proza Libre', sans-serif;
  background: white;
  opacity: 0.9;
  color: #EA9713;
  font-size: 15px;
  cursor: pointer;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
`;

const Img = styled.img`
  height: 40px;
  padding: none;
`;



const getShortName = fileName =>  fileName.length <= 23 ? fileName : fileName.substr(0, 20) + "...";
  
  // fileName.length < 22 ? fileName : fileName.substr(0, 20) + "-" + fileName.substr(20, 18) + "...";


function UploadModal({close}) {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  useEffect(() => {
    subscribe(setUploads);
    return subscribe(setUploads);
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
          <ModalTitle>{uploads.length < 1 ? "Upload some file(s)" : "Uploads"}</ModalTitle>
          <FileList>
            {uploads.map(upload =>
              <FileItem key={upload.uid}>
              <FileName>{getShortName(upload.file.name).toLowerCase()}</FileName>
                <DateAndTagsEditor {...{ uploads: [upload] }}/>
                <DeleteButton
                  onClick={ () => deleteUpload(upload.uid) }
                  aria-label="Delete upload">
                  &times;
              </DeleteButton>
            </FileItem>)}
          </FileList>
          {uploads.length > 1 && <GlobalWrapper><DateAndTagsEditor {...{ uploads }} /></GlobalWrapper>}
        </AddedFiles>

        <ToolsGroups>
            <FileUploadInput type="file" id="file" onChange={handleOnChange} multiple/> 
            <FileUploadLabel htmlFor="file">ADD FILES</FileUploadLabel>
            <AddNoteButton onClick={() => setNoteModalOpen(true)}>ADD NOTE</AddNoteButton>
          </ToolsGroups>

        <ButtonGroup>
          <Button disabled={uploads.length < 1 ? true : false } onClick={() => {submit(); close()}}><Img src={completionTick} alt='green tick' /></Button>
        </ButtonGroup>
        
      </UploadModalWrapper>
    </ModalWindow>
  </>);

  

  return noteModalOpen ? <AddNoteModal close={() => setNoteModalOpen(false)}/> : modal;
}
 
export default UploadModal;
