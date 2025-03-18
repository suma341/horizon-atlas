"use client";
import { assignCssProperties } from '@/lib/assignCssProperties';
import { parseMarkdown } from '@/lib/parseMD';
import { MdTypeAndText } from '@/types/textAndType';
import { MdBlock } from 'notion-to-md/build/types'
import React, { useEffect, useState } from 'react'
import MdBlockComponent from '../mdBlock';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading1(props:Props) {
    const {mdBlock,depth} = props;
    const [textBlocks,setText] = useState<MdTypeAndText[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const text = mdBlock.parent.slice(2);
    useEffect(()=>{
        const md = parseMarkdown({text,type:[],link:[]})
        setText(md);
    },[mdBlock])

    return (
        <div id={mdBlock.blockId}>
            {mdBlock.children.length===0 && <h1 className='mb-1 mt-8 font-bold text-3xl'>
                {textBlocks.map((block, i)=>{
                    const style = assignCssProperties(block);
                    return(
                    <span style={style} key={i}>{block.text}</span>
                )})}
            </h1>}
            {mdBlock.children.length !==0 && <div className='flex'>
                <button
                    className="text-left text-xl space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <h1 className='mb-1 mt-8 font-bold text-3xl'>
                    {textBlocks.map((block, i)=>{
                        const style = assignCssProperties(block);
                        return(
                        <span style={style} key={i}>{block.text}</span>
                    )})}
                </h1>
            </div>}
            {isOpen && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}
