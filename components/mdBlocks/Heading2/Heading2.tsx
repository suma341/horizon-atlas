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
        <div className='w-11/12'>
            <h2 className='my-2 mt-5 font-bold text-3xl'>
                {textBlocks.map((block, i)=>(
                    <span style={block.style} key={i}>{block.text}</span>
                ))}
            </h2>
        </div>
    )
}
