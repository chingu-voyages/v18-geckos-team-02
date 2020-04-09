import React from 'react';
import styled from 'styled-components';

const ModalBg = styled.div`
  background: rgba(0, 0, 0, 0.5);
  max-width: 414px;
  height: 100%;
  padding: 4rem;
  display: flex;
  align-items: center;
`;

const UploadForm = styled.form``;

const Btn = styled.button`
  border: none;
  color: #F6F6F6;
  background: ${props => props.primary ? "#60C3FF" : "#FC5F6B"};
  padding: 0.6rem;
  width: 7rem;
  margin: 0.5rem;
`;


const UploadModal = () => {
  return ( 
    <ModalBg>
      <UploadForm>
        <Btn primary
          type="button">
          Upload Files
        </Btn>
        <Btn type="button">
          Add Notes
        </Btn>
      </UploadForm>
    </ModalBg>
   );
}
 
export default UploadModal;