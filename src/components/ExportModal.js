import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { exportTimeLine } from '../services/dataController';
import completionTick from '../assets/completionTick.svg';
import logo from './../../src/assets/wavy-logo.svg';

const ExportModalWindow = styled.div`
    display: flex;
    flex-direction: column;
    justify-items: center;
    width: 200px;
    height: 160px;
    background: ${props => props.theme.lightGrey};
    position: fixed;
    bottom: 180px;
    float: right;
    right: 30px;
`;

const TitleArea = styled.div`
    width: inherit;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    color: ${props => props.theme.orange};
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.blue};
    font-size: 18px;
    font-weight: 800;
    // border: solid red 1px;
`;

const ActionArea = styled.div`
    display: flex;
    flex-direction: column;
    width: inherit;
    height: 130px;
    align-items: center;
    padding-top: 20px;
    color: ${props => props.theme.orange};
    // border: solid red 1px;
`;
const TitleInputArea = styled.div`
    // display: flex;
    // flex-direction: column;
    width: inherit;
    height: inherit;
    // align-items: center;
    // padding-top: 20px;
    // color: ${props => props.theme.orange};
`;

const InputSection = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

const Input = styled.input`
    background: ${props => props.theme.lightBlue};
    width: 60%;
    height: 30px;
    margin-top: 10px;
    border: 1px solid ${props => props.theme.darkBlue}; 
    outline: none;
    margin-right: 5px;

    ::placeholder {
        color: ${props => props.theme.orange};
        opacity: 1; 
      }
      
      :-ms-input-placeholder  {
        color: ${props => props.theme.orange};
      }
      
      ::-ms-input-placeholder  {
        color: ${props => props.theme.orange};
      }
`;

const InputSubmitButton = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

const ButtonLabel = styled.label`
    width: 30px;
    height: 30px;
    background: ${props => props.theme.blue};
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    border: none;
    outline: none;
    position: relative;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
`;

const Tick = styled.img`
    width: 20px;
    height: 20px;
`;

const HiddenDownloadLink = styled.a`
  display: none;
`;

const SpinnerSection = styled.div`
  // border: solid green 1px;
  width: inherit;
  height: inherit;
  position: relative;
  bottom: 10px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Logo = styled.img`
  width: 160px;
  height: 40px;
  animation: rotation 1.5s infinite linear;
@keyframes rotation {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(359deg);
  }
}

`;

function ExportModal () {

    const [downloadStatus, setDownloadStatus] = useState(null);
    const downloadLinkRef = useRef();

    const [title, setTitle] = useState('');
    
    async function startDownload(e) {
      if (!downloadStatus && downloadStatus !== 'inprogress') {
        setDownloadStatus('inprogress');
        try {
          const file = await exportTimeLine();
          if (file) {
            setDownloadStatus(null);
            const url = await URL.createObjectURL(file);
            downloadLinkRef.current.href = url;
            if (title) {
              downloadLinkRef.current.download = title+'.wavy';
            } else {
              downloadLinkRef.current.download = Date.now().toString()+'.wavy';
            }
            downloadLinkRef.current.click();
          }
        }
        catch (e) {
          setDownloadStatus(null);
          console.error(e);
        }
      }
      return true
    }

    function handleSubmit(e) {
      e.preventDefault();
      startDownload(e);
    }


    return (
            <ExportModalWindow>
                <TitleArea>Export your Timeline</TitleArea>
                <ActionArea>
                {!downloadStatus && downloadStatus !== 'inprogress' ?
                <TitleInputArea>
                  <div>Give your creation a title....</div> 
                  <InputSection onSubmit={handleSubmit}>
                    <Input 
                      type="text" 
                      placeholder=" Title..." 
                      onChange={(e) => setTitle(e.target.value) }
                      >
                    </Input>
                    <HiddenDownloadLink ref={downloadLinkRef} />
                    <InputSubmitButton type="submit" id="submit"/>
                    <ButtonLabel htmlFor="submit">
                      <Tick src={completionTick} alt ="export timeline button"/>
                    </ButtonLabel>
                  </InputSection>
                </TitleInputArea>
                   : downloadStatus === 'inprogress' ?
                    <SpinnerSection><Logo src={logo}/></SpinnerSection> 
                   : <div>Download Ready</div>
                  }
                </ActionArea>
              
            </ExportModalWindow>
    );
};

export default ExportModal;