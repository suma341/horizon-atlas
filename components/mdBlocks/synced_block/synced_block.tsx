import React from 'react'
import { MdBlock } from '@/types/MdBlock';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

function Synced_block({mdBlock,depth}:Props) {
  return (
    <div id={mdBlock.blockId}>
        <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />
    </div>
  )
}

export default Synced_block