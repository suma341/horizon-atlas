import React from 'react'
import { RenderChildren } from '../mdBlock';
import { MdBlock } from '@/types/MdBlock';

type Props ={
    mdBlock:MdBlock;
    depth:number;
}

function Column_list({mdBlock,depth}:Props) {
    try{
        const columns:MdBlock[] = mdBlock.children

    return (
        <div className='md:flex md:gap-3' id={mdBlock.blockId}>
            {Array.isArray(columns) && columns.map((column,i)=>(
                <div key={i} className='md:flex-1'>
                    <RenderChildren mdBlocks={column.children} depth={depth + 1} />
                </div>
            ))}
        </div>
    )
    }catch(e){
        throw new Error(`error in column_list error: ${e}`)
    }
}

export default Column_list