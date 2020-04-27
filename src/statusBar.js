import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';


const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border: 1px solid red;
    height: 90vh;
`;

const BarContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const Bar = styled.div`
    display: flex;
    height: 16px;
    width: 12px;
    background-color: #1B71D5;
    border-radius: 20px;
    margin: 0px 1px 0px 1px;
    transition: height 0.3s;
`;


// .bar.expanded {
//     height: 100px;
// }

function statusBar() {


    return (
        <MainContainer>
            <BarContainer>
                <Bar class="bar1"></Bar>
                <Bar class="bar2"></Bar>
                <Bar class="bar3"></Bar>
                <Bar class="bar4"></Bar>
                <Bar class="bar5"></Bar>
                <Bar class="bar6"></Bar>
                <Bar class="bar7"></Bar>
                <Bar class="bar8"></Bar>
                <Bar class="bar9"></Bar>
                <Bar class="bar10"></Bar>
                <Bar class="bar11"></Bar>
                <Bar class="bar12"></Bar>
            </BarContainer>
            <MessageContainer></MessageContainer>
        </MainContainer>
    )
} 

export default statusBar;