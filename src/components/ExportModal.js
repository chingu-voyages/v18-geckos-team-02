import React, {useState, useEffect} from 'react';
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

    return (
            <ExportModalWindow>
                <StatusSection>Loading.....</StatusSection>
                <TitleSection>Title </TitleSection>
                <ButtonSection>
                    <Button>
                        <Tick src={completionTick} alt ="export timeline button" />
                    </Button>
                </ButtonSection>
            </ExportModalWindow>
    );
};

export default ExportModal;