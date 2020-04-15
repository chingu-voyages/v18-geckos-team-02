import React, { useState, Fragment } from 'react';
import { listNodes } from '../services/dataController';
import styled from 'styled-components';
import Node from './Node';
import openTimelineIcon from '../assets/openTimelineButton.svg';

const Wrapper = styled.div`
width: 100%;
min-height: 30vw;
position: fixed;
bottom: 70px;
left: 0;
display: grid;
overflow: auto;
&::-webkit-scrollbar {
  height: 8px;
}
&::-webkit-scrollbar-track {
  background: ${props => props.theme.greyBlue};
}
&::-webkit-scrollbar-thumb {
  background: ${props => props.theme.darkBlue};
  border-radius: 8px;
}
&::-webkit-scrollbar-thumb:hover {
  background: ${props => props.theme.lightBlue};
}
z-index: 50;
`;
const Line = styled.div`
min-width: 100%;
display: flex;
flex-flow: row nowrap;
justify-content: flex-start;
`;
const Title = styled.header`
width: 100%;
text-align: center;
display: flex;
flex-flow: row nowrap;
color: ${props => props.theme.darkGrey};
font-size: 11px;
&::before,
&::after {
  display: inline-block;
  content: '';
  border-top: 1px solid ${props => props.theme.darkGrey};
  width: 50%;
  margin: 0 12px;
  transform: translateY(50%);
}
&::before {
  border-left: 1px solid ${props => props.theme.darkGrey};
}
&::after {
  border-right: 1px solid ${props => props.theme.darkGrey};
}
`;
const Year = styled.div`
display: grid;
grid-template-rows: 18px auto;
place-items: start center;
`;
const YearTitle = styled(Title)`
font-size: 11px;
`;
const Months = styled.div`
width: 100%;
display: flex;
flex-flow: row nowrap;
justify-content: center;
`;
const Month = styled.div`
display: grid;
grid-template-rows: 18px auto;
place-items: start center;
`;
const MonthTitle = styled(Title)`
font-size: 11px;
`;
const Dates = styled.div`
width: 100%;
display: flex;
flex-flow: row nowrap;
justify-content: stretch;
`;
const DateItem = styled.div`
display: grid;
grid-template-rows: 18px 20vw;
place-items: start center;
width: 10vw;
& h3 {
  font-size: 10px;
}
& section {
  word-break: break-all;
  display: inline-block;
  max-height: 100%;
  overflow-y: auto;
  background: ${props => props.theme.blue};
  border-radius: 8px;
  &::-webkit-scrollbar {
  width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.darkBlue};
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.lightBlue};
  }
  &>div {
    font-size: 0.8vw;
    height: 5vw;
    overflow: hidden;
    padding: 8px;
  }
}
&.active section {
  background: ${props => props.theme.lightBlue};
}
`;
const Gap = styled.div`
  width: 5vw;
  place-items: start center;
  &::before {
    display: inline-block;
    content: '';
    height: 0.5vw;
    width: 100%;
    background: ${props => props.theme.blue};
    position: relative;
    top: 10.5vw;
  }
`;
const CloseButton = styled.button`
position:fixed;
bottom: 90px;
right: 10px;
background: none;
border: none;
z-index: 100;
& img {
  transform: rotate(180deg);
}
`;

function Timeline({close, activeNode, setActiveNode}) {
  const [maxNodes, setMaxNodes] = useState(11); // 7 and 'date' === 7 different days
  const [start, setStart] = useState('0'); // dateTime YYYYMMDDHHMMSS -> 0 === year 0
  const nodes = listNodes(start, maxNodes, 'date');
  let lastDate = null;

  const scrollTo = ref =>
    ref.current.scrollIntoView({
    behavior: 'smooth',
    inline: 'center'
  });
  const TimeLine = <Line>
    {Object.keys(nodes).sort().map(year => {
      const ref = React.createRef();
      return (
        <Year ref={ref} key={year}>
          <YearTitle onClick={() => scrollTo(ref)}>{year}</YearTitle>
          <Months>
            {Object.keys(nodes[year]).sort().map(month => {
              const ref = React.createRef();
              return (
                <Month ref={ref} key={year+month}>
                  <MonthTitle onClick={() => scrollTo(ref)}>{month}</MonthTitle>
                  <Dates>
                    {Object.keys(nodes[year][month]).sort().map(date => {
                      const showGap = lastDate && (date > parseInt(lastDate.date)+1 || month > parseInt(lastDate.month)+1 || year > parseInt(lastDate.year)+1);
                      lastDate = {year,month,date};
                      const nodeDate = new Date(`${year}-${month}-${date}`).toDateString();
                      const ref = React.createRef();
                      const isActive = year+month+date === activeNode;
                      const handleClick = () => {
                        setActiveNode(year+month+date);
                        scrollTo(ref);
                      }
                      const handleLoad = () => {
                        if (isActive) {
                          scrollTo(ref);
                        }
                      }
                      return (<Fragment key={year+month+date+showGap}> 
                        {showGap && <Gap></Gap>}
                        <DateItem ref={ref} className={isActive ? 'active' : ''} onLoad={handleLoad} onClick={handleClick}>
                          <h3>{nodeDate.substr(0,3)+' '+nodeDate.substr(8,2)}</h3>
                          <Node files={nodes[year][month][date]} />
                        </DateItem>
                      </Fragment>) 
                  })}
                  </Dates>
                </Month>
              )
            })}
          </Months>
        </Year>
      )
    })} 
  </Line>;
  return (<Wrapper>
     <CloseButton onClick={close}><img src={openTimelineIcon} alt="close timeline" /></CloseButton>
     {TimeLine}
  </Wrapper>);
}

export default Timeline;
