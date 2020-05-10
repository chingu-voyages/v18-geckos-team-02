import React, { useState, Fragment, useEffect } from 'react';
import styled from 'styled-components';
import Node from './Node';
import openTimelineIcon from '../assets/openIcon.svg';
import { nodesListSubcription, setActiveNode, activeNode } from '../services/dataController';

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
&.editing .edit-options {
  display: flex;
}
& .edit-options {
  display: none;
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
// color: ${props => props.theme.darkGrey};
font-size: 11px;
&::before,
&::after {
  display: inline-block;
  content: '';
  border-top: 1px solid ${props => props.theme.blue};
  width: 50%;
  margin: 0 12px;
  transform: translateY(50%);
}
&::before {
  border-left: 1px solid ${props => props.theme.blue};
}
&::after {
  border-right: 1px solid ${props => props.theme.blue};
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
  // color: ${props => props.theme.darkGrey};
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
  width: ${props => (props.wide/2)+'vw'};
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
const ExpandButton = styled.div`
position:fixed;
cursor: pointer;
bottom: 94px;
right: 40px;
width: 50px;
height: 50px;
z-index: 100;
&.close img {
  transform: rotate(180deg);
}
`;

function Timeline({editMode}) {

  const [showNodes, setShowNodes] = useState(false);
  const [nodesList, setNodesList] = useState(null);

  useEffect(() => {
    nodesListSubcription.subscribe(setNodesList);
    return () => nodesListSubcription.unsubscribe(setNodesList);
  }, []
  )

  let output = '';
  if (nodesList && Object.keys(nodesList).length > 0) {
    let lastDate = null;
    const scrollTo = ref =>
      ref.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'center'
    });
    const TimeLine = <Line>
      {Object.keys(nodesList).sort().map(year => {
        const ref = React.createRef(); 
        return (
          <Year ref={ref} key={year}>
            <Title onClick={() => scrollTo(ref)}>{year}</Title>
            <Months>
              {Object.keys(nodesList[year]).sort().map(month => {
                const ref = React.createRef();
                const monthStr = new Date(`${year}-${month}-01`).toDateString().substr(4,3);
                return (
                  <Month ref={ref} key={year+month}>
                    <Title onClick={() => scrollTo(ref)}>{monthStr}</Title>
                    <Dates>
                      <Bar wide={5} className={showNodes && 'expanded'}></Bar>
                      {Object.keys(nodesList[year][month]).sort().map(date => {
                        let totalBars = 0;
                        if (lastDate) {
                          totalBars += ((year - lastDate.year) > 0 && 10) || ((month - lastDate.month) > 0 && 5) || (date - lastDate.date > 0 && 1);
                        }
                        lastDate = {year,month,date};
                        const nodeDate = new Date(`${year}-${month}-${date}`).toDateString();
                        const ref = React.createRef();
                        const isActive = year+month+date === activeNode;
                        const handleClick = () => {
                          setActiveNode(nodesList[year][month][date][0]);
                          scrollTo(ref);
                        }
                        const handleLoad = () => {
                          if (isActive) {
                            scrollTo(ref);
                          }
                        }
                        return (<Fragment key={year+month+date+totalBars}> 
                          <Bar wide={totalBars} className={showNodes && 'expanded'}></Bar>
                          <DateItem ref={ref} className={(isActive ? 'active ' : '')+(showNodes && 'expanded')} onLoad={handleLoad} onClick={handleClick}>
                            <header>{nodeDate.substr(0,3)+' '+nodeDate.substr(8,2)}</header>
                            {showNodes && <Node fileObjs={nodesList[year][month][date]} />}
                          </DateItem>
                        </Fragment>) 
                      })}
                    <Bar wide={5} className={showNodes && 'expanded'}></Bar>
                    </Dates>
                  </Month>
                )
              })}
            </Months>
          </Year>
        )
        
      })} 
    </Line>;
    output = <Wrapper className={`${!showNodes && 'contracted'} ${editMode && 'editing'}`}>
      <ExpandButton className={showNodes && 'close'} onClick={() => setShowNodes(!showNodes)}><img src={openTimelineIcon} alt="close timeline" /></ExpandButton>
      {TimeLine}
    </Wrapper>;
  }
  return output;
}

export default Timeline;
