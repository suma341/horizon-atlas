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

export default function Heading1(props:Props) {
    const {mdBlock} = props;
    const [textBlocks,setText] = useState<MdTypeAndText[]>([]);
    const text = mdBlock.parent.slice(2);
    useEffect(()=>{
        const md = parseMarkdown({text,type:[],link:[]})
        setText(md);
    },[mdBlock])

    return (
        <div id={mdBlock.blockId}>
            <h1 className='mb-1 mt-8 font-bold text-3xl'>
                {textBlocks.map((block, i)=>{
                    const style = assignCssProperties(block);
                    return(
                    <span style={style} key={i}>{block.text}</span>
                )})}
            </h1>
        </div>
    )
}
