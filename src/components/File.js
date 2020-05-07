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
const FileIcon = styled.a`
    max-width: 100%;
    display: grid;
    place-items: center center;
    background: ${props => props.background};
    color: ${props => props.color};
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

export default function File({fileObj, showTime, time, isMain}) {
    const [file, setFile] = useState(placeholder);

    function handleClick(e) {
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
   
    if (fileObj) {
        return (
            <>
            <FileContainer ref={ref} >
                {showTime && <time dateTime={time}>{time}</time>}
                {isMain &&
                <OptionsContainer className="edit-options"> 
                    <Options onClick={handleClick}>X</Options> 
                </OptionsContainer> 
                }
                {fileObj.type.includes('image') ? 
                    <Img src={file} alt="" /> : 
                    fileObj.type === 'note' ? <Note className="note"><h1>{fileObj.name}</h1><p>{fileObj.text}</p></Note> :
                    <FileIcon href={file} download={fileObj.name} {...charsToColour(fileObj.type)}>{fileObj.name}</FileIcon>
                }
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