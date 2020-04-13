import React from 'react';
import Node from './Node';
import { getFiles } from '../services/dataController';

function Main({activeNode}) {
  const files = getFiles(activeNode, activeNode.substr(0,8)+'2359');
  const nodeDate = new Date(`${activeNode.substr(0,4)}-${activeNode.substr(4,2)}-${activeNode.substr(6,2)}`).toDateString();
  return (
    <>
      <h1>{nodeDate}</h1>
      <Node files={files} />
    </>
  );
}

export default Main;
