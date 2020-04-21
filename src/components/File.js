import React, { useState } from 'react';
import styled from 'styled-components';
import { getFile } from '../services/dataController';

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

export default function File({fileRef, timeWanted, lastTime, updateLastTime}) {
    const [fileObj, setFileObj] = useState(false);
    getFile(fileRef).then(file => { setFileObj(file) }, err => console.error(err));
    if (fileObj) {
        if (timeWanted) {
            var time = fileObj.timeStamps[fileObj.activeTimeStamp].substr(8).match(/.{2}/g).join(':');
            var showTime = time !== lastTime;
            updateLastTime(time);
        }
        return (
            <>
                {timeWanted && showTime && <time dateTime={time}>{time}</time>}
                {fileObj.type.includes('image') ? 
                    <Img src={URL.createObjectURL(fileObj.file)} alt="" /> : 
                    fileObj.type === 'note' ? <Note className="note"><h1>{fileObj.file.name}</h1><p>{fileObj.file.text}</p></Note> :
                    <FileIcon href={URL.createObjectURL(fileObj.file)} download={fileObj.file.name} {...charsToColour(fileObj.type)}>{fileObj.file.name}</FileIcon>
                }
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