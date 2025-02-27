"use client";
import { searchMDKeyword } from '@/lib/mdBlockHelper'
import { MdTypeAndText } from '@/types/parent';
import { MdBlock } from 'notion-to-md/build/types'
import React, { useEffect, useState } from 'react'

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading3(props:Props) {
    const {mdBlock} = props;
    const [textBlocks,setText] = useState<MdTypeAndText[]>([]);
    const text = mdBlock.parent.slice(4);
    useEffect(()=>{
        const md = searchMDKeyword(text)
        setText(md);
    },[])
    
    return (
        <div id={mdBlock.blockId}>
            <h3 className='my-2 mt-4 font-bold text-xl'>
                {textBlocks.map((block, i)=>(
                    <span style={block.style} key={i}>{block.text}</span>
                ))}    
            </h3>
        </div>
    )
}
