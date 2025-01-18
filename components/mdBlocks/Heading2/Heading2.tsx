import { searchMDKeyword } from '@/lib/mdBlockHelper'
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading2(props:Props) {
    const {mdBlock} = props;
    const text = mdBlock.parent.slice(3);
    const textBlocks = searchMDKeyword(text);
    
    return (
        <div>
            <h2 className='mb-1 mt-6 font-bold text-2xl'>
                {textBlocks.map((block, i)=>(
                    <span style={block.style} key={i}>{block.text}</span>
                ))}
            </h2>
        </div>
    )
}
