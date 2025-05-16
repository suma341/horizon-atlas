import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import MdBlockComponent from '../mdBlock';

type Props ={
    mdBlock:MdBlock;
    depth:number;
}

function Column_list({mdBlock,depth}:Props) {
    const columns:MdBlock[] = mdBlock.children

  return (
    <div className='md:flex md:gap-3' id={mdBlock.blockId}>
        {columns.map((column,i)=>(
            <div key={i} className='md:flex-1'>
                {column.children.map((child,j)=>(
                    <MdBlockComponent mdBlock={child} depth={depth} key={j} />
                ))}
            </div>
        ))}
    </div>
  )
}

export default Column_list