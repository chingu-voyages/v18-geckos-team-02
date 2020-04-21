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

export default function Node({ fileRefs, timeWanted = false }) {
    let lastTime = '';
    function updateLastTime(time) {
        lastTime = time;
    }
    return (
        <Wrapper>
           {fileRefs.map(fileRef => <File key={fileRef} {...{fileRef, timeWanted, lastTime, updateLastTime}} />)}
        </Wrapper>
    )
}