import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { exportTimeLine } from '../services/dataController';
import completionTick from '../assets/completionTick.svg';

const ExportModalWindow = styled.div`
    display: flex;
    flex-direction: column;
    justify-items: center;
    width: 200px;
    height: 200px;
    background: ${props => props.theme.lightGrey};
    position: fixed;
    bottom: 180px;
    float: right;
    right: 30px;
    // border: 1px solid red;
`;

const StatusSection = styled.div`
    width: inherit;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    // border: 1px solid red;
`;

const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
    width: inherit;
    height: 80px;
    display: flex;
    align-items: center;
    // justify-content: center;
    display: flex;
    color: ${props => props.theme.orange};
    // border: 1px solid red;
    margin-bottom: 10px;
    padding-top: 5px;

`;

const Input = styled.input`
    background: ${props => props.theme.lightBlue};
    width: 60%;
    height: 30px;
    margin-top: 10px;
    border: 1px solid ${props => props.theme.darkBlue}; 
    outline: none;

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

const ButtonSection = styled.div`
    width: inherit;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
`;

const Button = styled.button`
    width: 60%;
    height: 40px;
    background: ${props => props.theme.blue};
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    border: none;
    outline: none;
`;

const Tick = styled.img`
    width: 30px;
    height: 30px;
`;

const HiddenDownloadLink = styled.a`
  display: none;
`;

function ExportModal () {

    const [downloadStatus, setDownloadStatus] = useState(null);
    const downloadLinkRef = useRef();
    
    async function startDownload(e) {
      if (!downloadStatus && downloadStatus !== 'inprogress') {
        setDownloadStatus('inprogress');
        try {
          const file = await exportTimeLine();
          if (file) {
            setDownloadStatus(null);
            const url = await URL.createObjectURL(file);
            downloadLinkRef.current.href = url;
            downloadLinkRef.current.download = Date.now().toString()+'.wavy';
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

    return (
            <ExportModalWindow>
                <StatusSection>... of files ready</StatusSection>
                <TitleSection>Give your creation a title.... 
                  <Input type="text" placeholder=" Title..."></Input>
                </TitleSection>
                <ButtonSection>
                    <Button onClick={startDownload}  alt ="export timeline button" >
                        <Tick src={completionTick} />
                    </Button>
                </ButtonSection>
                <HiddenDownloadLink ref={downloadLinkRef} />
            </ExportModalWindow>
    );
};

export default ExportModal;