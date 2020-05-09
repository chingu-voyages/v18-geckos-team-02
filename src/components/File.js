import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {getFile, removeFiles} from '../services/dataController';
import placeholder from '../assets/placeholder.svg';
import trashIcon from '../assets/trashIcon.svg';

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
    color: ${props => props.theme.darkGrey};
    & h1 {
        color: ${props => props.theme.darkGrey};
    }
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

const TrashButton = styled.button`
    background: none;
    outline: none;
    border: none;
    & img {
        width: 50px;
        height: 50px;
    }
    &:hover {
      color: ${props => props.theme.offWhite};
      background: ${props => props.theme.red};
    }
`;

const OptionsContainer = styled.div`
    width: 50px;
    position: absolute;
    bottom: 10px;
    right: 10px;
`;

const FileContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 50vw;
    position: relative;
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
    padding-top: 32px;
`;

const Link = styled.a`
    text-decoration: none;
    width: 100%;
    height: 100%;
`;


const FileNotFound = styled.div`
    max-width: 100%;
    display: grid;
    place-items: center center;
    background: ${props => props.theme.red};
    color: ${props => props.theme.offWhite};
    width: 300px;
    height: 150px;
    text-align: center;
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
                        let url = null
                        if (blob) {
                            url = URL.createObjectURL(blob);
                        }
                        setFile(url);
                        if (url === null) {
                            fileObj.flagMissingData();
                        }
                        observer.unobserve(ref.current);
                    }); 
                }
            });
            observer.observe(ref.current); 
            return () => observer.unobserve(refCurrent);
        }
    }, [ref, fileObj, fileObj.fileMissing]);

    const DownloadWrapper = props => {
        const condenseSize = size => size < 1000 ? size+'B' : size < Math.pow(10, 6) ? (size/1000).toFixed(2)+'KB' : size < Math.pow(10, 9) ? (size/Math.pow(10, 6)).toFixed(2)+'MB' : (size/Math.pow(10, 9)).toFixed(2)+'GB';
const info = `
${fileObj.name} 
lastModifed: ${fileObj.unFormatDate(fileObj.timeStamps.modified)} 
${fileObj.timeStamps.user ? 'userSetTime: '+fileObj.unFormatDate(fileObj.timeStamps.user)+'\n' : ''}type: ${fileObj.type}
${fileObj.tag?.length > 0 ? 'tags: '+fileObj.tags.join(' ')+'\n' : ''}${fileObj.size ? 'size: '+condenseSize(fileObj.size)+'\n' : ''}
    
`;
        if (props.enabled) {
            return <Link title={info} href={file} download={fileObj.name}>
                {props.children}
            </Link>
        }
        return props.children
    }
   
    if (fileObj) {
        return (
            <FileContainer ref={ref} >
                {showTime && <Time dateTime={time}>{time}</Time>}
                {enableEditOptions &&
                <OptionsContainer className="edit-options"> 
                    <TrashButton onClick={removeFile}>
                        <img src={trashIcon} alt='x' />
                    </TrashButton> 
                </OptionsContainer> 
                }
                {file === null ? <FileNotFound>File Not Found! Please upload file: {fileObj.name}</FileNotFound> :
                <DownloadWrapper enabled={enableDownload}>
                    {fileObj.type.includes('image') ? 
                        <Img src={file} alt="" /> : 
                        fileObj.type === 'note' ? <Note className="note"><h1>{fileObj.name}</h1><p>{fileObj.text}</p></Note> :
                        <FileIcon {...charsToColour(fileObj.type)}>{fileObj.name}</FileIcon>
                    }
                </DownloadWrapper>}
            </FileContainer>
        )
    }
    else { 
        return <FileNotFound>File has vanished! :&lt;</FileNotFound>
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