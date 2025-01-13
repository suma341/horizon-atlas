import { searchMDKeyword } from '@/lib/mdBlockHelper'
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading3(props:Props) {
    const {mdBlock} = props;
    const text = mdBlock.parent.slice(4);
    const textBlocks = searchMDKeyword(text);
    
    return (
        <div className='w-11/12'>
            <h3 className='my-2 mt-4 font-bold text-xl'>
                {textBlocks.map((block, i)=>(
                    <span style={block.style} key={i}>{block.text}</span>
                ))}    
            </h3>
        </div>
    )
}
