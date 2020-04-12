import React, { useState, Fragment } from 'react';
import { listNodes } from '../services/dataController';
import styled from 'styled-components';
import Node from './Node';

const Wrapper = styled.div`
width: 100%;
height: 30%;
position: fixed;
bottom: 80px;
left: 0;
display: grid;
grid-template-rows: auto 32px;
overflow-x: auto;
`;
const Line = styled.div`
min-width: 100%;
display: flex;
flex-flow: row nowrap;
justify-content: center;
`;
const Title = styled.header`
width: 100%;
text-align: center;
display: flex;
flex-flow: row nowrap;
&::before,
&::after {
  display: inline-block;
  content: '';
  border-top: 1px solid black;
  width: 50%;
  margin: 0 12px;
  transform: translateY(50%);
}
&::before {
  border-left: 1px solid black;
}
&::after {
  border-right: 1px solid black;
}
`;
const Year = styled.div`
display: grid;
grid-template-rows: 32px 32px;
place-items: start center;
`;
const YearTitle = styled(Title)`
font-size: 32px;
`;
const Months = styled.div`
width: 100%;
display: flex;
flex-flow: row nowrap;
justify-content: center;
`;
const Month = styled.div`
display: grid;
grid-template-rows: 32px 32px;
place-items: start center;
`;
const MonthTitle = styled(Title)`
font-size: 28px;
`;
const Dates = styled.div`
width: 100%;
display: flex;
flex-flow: row nowrap;
justify-content: stretch;
`;
const DateItem = styled.div`
display: grid;
grid-template-rows: 64px 128px;
margin: 8px;
place-items: start center;
`;
const Gap = styled.div`
width: 50px;
height: 100px;
background: linear-gradient(transparent 50%, blue 60%, transparent 0%);
`;
const Buttons = styled.div`
width: 100%;
display: flex;
flex-flow: nowrap;
justify-content: space-between;
`;

function Timeline() {
  const [maxNodes, setMaxNodes] = useState(7); // 7 and 'date' === 7 different days
  const [start, setStart] = useState('0'); // dateTime YYYYMMDDHHMMSS -> 0 === year 0
  const nodes = listNodes(start, maxNodes, 'date');

  let lastDate = {year:0,month:0,date:0};
  const TimeLine = <Line>
    {Object.keys(nodes).sort().map(year =>
      <Year key={year}>
        <YearTitle>{year}</YearTitle>
        <Months>
          {Object.keys(nodes[year]).sort().map(month =>
            <Month key={year+month}>
              <MonthTitle>{month}</MonthTitle>
              <Dates>
                {Object.keys(nodes[year][month]).sort().map(date => {
                  const showGap = date > parseInt(lastDate.date)+1 || month > parseInt(lastDate.month)+1 || year > parseInt(lastDate.year)+1;
                  lastDate = {year,month,date};
                  const nodeDate = new Date(`${year}-${month}-${date}`).toDateString();
                  return (<Fragment key={year+month+date+showGap}> 
                    {showGap && 
                      <DateItem>
                        <div></div>
                        <Gap></Gap>
                      </DateItem>
                    }
                    <DateItem>
                      <h3>{nodeDate.substr(0,3)+' '+nodeDate.substr(8,2)}</h3>
                      <Node files={nodes[year][month][date]} />
                    </DateItem>
                  </Fragment>) 
              })}
              </Dates>
            </Month>
          )}
        </Months>
      </Year>
    )} 
  </Line>;
  return (<Wrapper>
     {TimeLine}
    <Buttons><button>back</button><button>forward</button></Buttons>
  </Wrapper>);
}

export default Timeline;
