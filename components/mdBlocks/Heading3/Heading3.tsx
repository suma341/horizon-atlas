"use client";
import { assignCssProperties } from '@/lib/assignCssProperties';
import { parseMarkdown } from '@/lib/parseMD';
import { MdTypeAndText } from '@/types/textAndType';
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
        const md = parseMarkdown({text,type:[],link:[]})
        setText(md);
    },[mdBlock])
    
    return (
        <div id={mdBlock.blockId}>
            <h3 className='my-2 mt-4 font-bold text-xl'>
                {textBlocks.map((block, i)=>{
                    const style = assignCssProperties(block)
                    return(
                    <span style={style} key={i}>{block.text}</span>
                )})}    
            </h3>
        </div>
    )
}
