// import React from 'react';
// import UploadItem from './UploadItem';
// import DateAndTagsEditor from './DateAndTagsEditor';

// function UploadModal() {
//   return (
//     <>
//       UploadModal
//     </>
//   );
// }

// export default UploadModal;

import React from 'react';
import styled from 'styled-components';

const ModalBg = styled.div`
  background: rgba(0, 0, 0, 0.5);
  max-width: 414px;
  margin: auto;
  height: 100%;
  padding: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const UploadForm = styled.form``;

const FormGroup = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: space-around;
`;

const Btn = styled.button`
  border: none;
  outline: none;
  color: #F6F6F6;
  background: ${props => props.primary ?
    props.theme.lightBlue : props.theme.red};
  padding: 0.6rem;
  width: 7rem;
  margin: 0.5rem;
  cursor: pointer;
`;

const CloseBtnWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 1rem;
`;

const CloseBtn = styled(Btn)`
  margin: 0;
  font-size: 4rem;
  width: auto;
  padding: 0;
  background: none;
  color: ${props => props.theme.red};
`;

const UploadModal = () => {
  return ( 
    <ModalBg>
      <CloseBtnWrapper>
        <CloseBtn
          aria-label="close upload modal"
          type="button">
          &times;
        </CloseBtn> 
      </CloseBtnWrapper>
      <UploadForm>
        <FormGroup>
          <Btn primary
            type="button">
            Upload Files
          </Btn>
          <Btn type="button">
            Add Notes
          </Btn>
        </FormGroup>
      </UploadForm>
    </ModalBg>
   );
}
 
export default UploadModal;
