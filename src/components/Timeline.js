import React, { useState, Fragment } from 'react';
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
background: ${props => props.theme.greyBlueTransp};
padding-top: 18px;
&.contracted {
  min-height: 94px;
  height: 94px;
}
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
const Dates = styled.div`
width: 100%;
display: flex;
flex-flow: row nowrap;
justify-content: stretch;
`;
const DateItem = styled.div`
display: grid;
grid-template-rows: 18px 0;
&.expanded {
  grid-template-rows: 18px 20vw;
}
place-items: start center;
width: 10vw;
& header {
  color: ${props => props.theme.darkGrey};
  font-size: 10px;
  text-align: center;
}
& section {
  word-break: break-all;
  display: inline-block;
  max-height: 100%;
  width: 100%;
  overflow-y: auto;
  background: ${props => props.theme.blue};
  border-radius: 8px;
  padding: 0.2vw;
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
    padding: 0.2vw;
    &>div {
      max-height: 100%;
    }
  }
}
&.active section {
  background: ${props => props.theme.lightBlue};
}
`;
const Gap = styled.div`
width: 5vw;
place-items: start center;
`;
const Bar = styled(Gap)`
  &.expanded::before {
    display: inline-block;
    content: '';
    height: 0.5vw;
    width: 100%;
    background: ${props => props.theme.blue};
    position: relative;
    top: 10.5vw;
  }
`;
const ExpandButton = styled.button`
position:fixed;
bottom: 90px;
right: 10px;
width: 34px;
height: 34px;
background: none;
border: none;
z-index: 100;
&.close img {
  transform: rotate(180deg);
}
`;

function Timeline({activeNode, setActiveNode, listNodes, getFile}) {
  const [showNodes, setShowNodes] = useState(false);
  const nodes = listNodes();
  let output = '';
  if (nodes) {
    let lastDate = null;
    const scrollTo = ref =>
      ref.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'center'
    });
    const TimeLine = <Line>
      {Object.keys(nodes).sort().map((year, i, arr) => {
        const yearEnd = i === arr.length-1;
        const yearStart = i === 0;
        const ref = React.createRef();
        return (
          <Year ref={ref} key={year}>
            <Title onClick={() => scrollTo(ref)}>{year}</Title>
            <Months>
              {Object.keys(nodes[year]).sort().map((month, i, arr) => {
                const monthEnd = i === arr.length-1;
                const monthStart = i === 0;
                const ref = React.createRef();
                const monthStr = new Date(`${year}-${month}-01`).toDateString().substr(4,3);
                return (
                  <Month ref={ref} key={year+month}>
                    <Title onClick={() => scrollTo(ref)}>{monthStr}</Title>
                    <Dates>
                      {Object.keys(nodes[year][month]).sort().map((date, i, arr) => {
                        const dateEnd = i === arr.length-1;
                        const dateStart = i === 0;
                        const atStart = dateStart && monthStart && yearStart;
                        const atEnd = dateEnd && monthEnd && yearEnd;
                        const showBar = lastDate && (date > parseInt(lastDate.date)+1 || month > parseInt(lastDate.month)+1 || year > parseInt(lastDate.year)+1);
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
                        return (<Fragment key={year+month+date+showBar}> 
                          {atStart && <Gap></Gap>}
                          {showBar && <Bar className={showNodes && 'expanded'}></Bar>}
                          <DateItem ref={ref} className={(isActive ? 'active ' : '')+(showNodes && 'expanded')} onLoad={handleLoad} onClick={handleClick}>
                            <header>{nodeDate.substr(0,3)+' '+nodeDate.substr(8,2)}</header>
                            {showNodes && <Node fileRefs={nodes[year][month][date]} {...{getFile}} />}
                          </DateItem>
                          {atEnd && <Gap></Gap>}
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
    output = <Wrapper className={!showNodes && 'contracted'}>
      <ExpandButton className={showNodes && 'close'} onClick={() => setShowNodes(!showNodes)}><img src={openTimelineIcon} alt="close timeline" /></ExpandButton>
      {TimeLine}
    </Wrapper>;
  }
  return output;
}

export default Timeline;
