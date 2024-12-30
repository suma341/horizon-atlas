import { searchMDKeyword } from '@/lib/mdBlockHelper'
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading1(props:Props) {
    const {mdBlock} = props;
    const text = mdBlock.parent.slice(2);
    const textBlocks = searchMDKeyword(text);

    return (
        <div>
            <h1 className='my-3 mt-5 font-bold text-4xl'>
                {textBlocks.map((block, i)=>(
                    <span style={block.style} key={i}>{block.text}</span>
                ))}
            </h1>
        </div>
    )
}
