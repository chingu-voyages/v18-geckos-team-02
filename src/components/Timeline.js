import React, { useState } from 'react';
import { listNodes } from '../services/dataController';

function Timeline() {
  const [scope, setScope] = useState({from: '0', to: '9'});
  const nodes = listNodes(scope);
  return (
    <div>
      <button>back</button>
      {Object.keys(nodes).map(year => <div key={year}>
        <h1>{year}</h1>
        {Object.keys(nodes[year]).map(month => <div key={year+month}>
          <h2>{month}</h2>
          {Object.keys(nodes[year][month]).map(date => <div key={year+month+date}>
            <h3>{date}</h3>
            {nodes[year][month][date].map(fileObj => <div key={fileObj.key}>
              {fileObj.fileType}
            </div>)}
          </div>)}
        </div>)}
      </div>)}
      <button>forwards</button>
    </div>
    
  );
}

export default Timeline;
