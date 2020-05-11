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
    bottom: 200px;
    float: right;
    right: 30px;
`;

const StatusSection = styled.div`
    width: inherit;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TitleSection = styled.div`
    width: inherit;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ButtonSection = styled.div`
    width: inherit;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Button = styled.button`
    width: 60%;
    height: 30px;
    background: ${props => props.theme.blue};
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    border: none; 
    outline: none;
`;

const Tick = styled.img`
    width: 25px;
    height: 25px
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
                <StatusSection>Loading.....</StatusSection>
                <TitleSection>Title </TitleSection>
                <ButtonSection>
                    <Button onClick={startDownload}  alt ="export timeline button" >
                        <Tick src={completionTick} />
                    </Button>
                </ButtonSection>
            </ExportModalWindow>
    );
};

export default ExportModal;