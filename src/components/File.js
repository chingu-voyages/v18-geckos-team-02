import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {getFile, removeFiles} from '../services/dataController';
import placeholder from '../assets/placeholder.svg';

const Wrapper = styled.div`
    max-width: 100%;
    display: grid;
    place-items: center center;
`;
const Img = styled.img`
    max-width: 100%;
`;
const Note = styled(Wrapper)`
    background: ${props => props.theme.offWhite};
    min-height: 100%;
    padding: 10%;
`;
const FileIcon = styled.div`
    max-width: 100%;
    display: grid;
    place-items: center center;
    background: ${props => props.background};
    color: ${props => props.theme.darkGrey};
    width: 300px;
    height: 150px;
`;

const Options = styled.button`
    width: auto;
    background: red;
    position: absolute;
`;

const OptionsContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: flex-end;
`;

const FileContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 50vw;

    @media (max-width: 1000px){
        max-width: 70vw;
    }

    @media (max-width: 500px){
        max-width: 90vw;
    }
`;

const Time = styled.time`
    color: ${props => props.theme.orange};
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.blue};
`;

export default function File({fileObj, showTime, time, isMain}) {
    const [file, setFile] = useState(placeholder);
    const enableEditOptions = isMain;
    const enableDownload = isMain;

    function removeFile() {
        let selectedFile = fileObj;
        removeFiles([selectedFile]);
    }

    const ref = useRef(null);

    useEffect(() => {
        const refCurrent = ref.current;
        if (ref.current) {
            let observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    getFile(fileObj.fileRef).then(blob => {
                        let url = "TODO import file not found image here";
                        if (blob) {
                            url = URL.createObjectURL(blob);
                        }
                        setFile(url);
                        observer.unobserve(ref.current);
                    }); 
                }
            });
            observer.observe(ref.current); 
            return () => observer.unobserve(refCurrent);
        }
    }, [ref, fileObj]);

    const DownloadWrapper = props => {
        if (props.enabled) {
            return <a href={file} download={fileObj.name}>
                {props.children}
            </a>
        }
        return props.children
    }
   
    if (fileObj) {
        return (
            <>
            <FileContainer ref={ref} >
                {enableEditOptions && <time dateTime={time}>{time}</time>}
                {isMain &&
                <OptionsContainer className="edit-options"> 
                    <Options onClick={removeFile}>X</Options> 
                </OptionsContainer> 
                }
                <DownloadWrapper enabled={enableDownload}>
                    {fileObj.type.includes('image') ? 
                        <Img src={file} alt="" /> : 
                        fileObj.type === 'note' ? <Note className="note"><h1>{fileObj.name}</h1><p>{fileObj.text}</p></Note> :
                        <FileIcon {...charsToColour(fileObj.type)}>{fileObj.name}</FileIcon>
                    }
                </DownloadWrapper>
            </FileContainer>
            </>
        )
    }
    else { // TODO make placeholder
        return <></>
    }
}

function charsToColour(str, opacity = 0.8) {
    let nineDigitStr = '';
    let i = 0;
    while(nineDigitStr.length < 9) {
        nineDigitStr += str.charCodeAt(i%str.length);
        i++;
    }
    let [r,g,b] = nineDigitStr.match(/.{3}/g);
    const max255 = numStr => parseInt(numStr, 10)%255;
    const invertN = numStr => 255 - max255(numStr);
    return {background: `rgba(${max255(r)},${max255(g)},${max255(b)},${opacity})`, color: `rgb(${invertN(r)},${invertN(g)},${invertN(b)})`}
}