import React from 'react';
import styled from 'styled-components';
import File from './File';

const Wrapper = styled.section`
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
`;

export default function Node({ fileObjs, timeWanted = false, getFile }) {
    let lastTime = '';
    let output = '';
    if (fileObjs) {
        output = fileObjs.map(fileObj => {
            let showTime = timeWanted;
            if (timeWanted) {
                var time = fileObj.getActiveDate().substr(8).match(/.{2}/g).join(':');
                showTime = time !== lastTime;
                lastTime = time;
            }
            return <File key={fileObj.uid} {...{fileObj, showTime, time, getFile}} />
        });
    }
    return (
        <Wrapper>
            {output}
        </Wrapper>
    )
}