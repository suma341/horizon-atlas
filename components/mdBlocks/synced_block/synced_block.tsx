import { MdBlock } from 'notion-to-md/build/types';
import React from 'react'
import MdBlockComponent from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

function Synced_block({mdBlock,depth}:Props) {
  return (
    <div id={mdBlock.blockId}>
        {mdBlock.children.map((child)=>(
            <MdBlockComponent key={child.blockId} mdBlock={child} depth={depth} />
        ))}
    </div>
  )
}

export default Synced_block