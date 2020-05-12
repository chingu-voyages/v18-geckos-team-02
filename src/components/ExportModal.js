import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { exportTimeLine } from '../services/dataController';
import completionTick from '../assets/completionTick.svg';

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
`;

const ActionArea = styled.div`
    display: flex;
    flex-direction: column;
    width: inherit;
    height: 140px;
    align-items: center;
    padding-top: 20px;
    color: ${props => props.theme.orange};
`;

const InputSection = styled.div`
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

const Button = styled.button`
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
                <TitleArea>Export your Timeline</TitleArea>
                <ActionArea>Give your creation a title.... 
                  <InputSection>
                    <Input type="text" placeholder=" Title..."></Input>
                    <Button onClick={startDownload}  alt ="export timeline button" >
                          <Tick src={completionTick} />
                    </Button>
                  </InputSection>
                  <HiddenDownloadLink ref={downloadLinkRef} />
                </ActionArea>
            </ExportModalWindow>
    );
};

export default ExportModal;