import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
        width: 100%;
        display: flex;
        flex-direction: column;
        align-self: center;
    `;

export default function Node({ files, timeWanted = false }) {
    let lastTime = '';
    const File = fileObj => {
        if (timeWanted) {
            var time = fileObj.timeStamps[fileObj.activeTimeStamp].substr(8).match(/.{2}/g).join(':');
            var showTime = time !== lastTime;
            lastTime = time;
        }
        return (
            <div>
                {timeWanted && showTime && <h1>{time}</h1>}
                {fileObj.file}
            </div>
        )
    }
    return (
        <Wrapper>
           {files.map(fileObj => <File key={fileObj.key} {...fileObj} />)}
        </Wrapper>
    )
}