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

export default function Heading3(props:Props) {
    const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [textBlocks,setText] = useState<MdTypeAndText[]>([]);
    const text = mdBlock.parent.slice(4);
    useEffect(()=>{
        const md = parseMarkdown({text,type:[],link:[]})
        setText(md);
    },[mdBlock])
    
    return (
        <div id={mdBlock.blockId}>
            {mdBlock.children.length===0 && <h3 className='my-2 mt-4 font-bold text-xl'>
                {textBlocks.map((block, i)=>{
                    const style = assignCssProperties(block)
                    return(
                    <span style={style} key={i}>{block.text}</span>
                )})}    
            </h3>}
            {mdBlock.children.length !==0 && <div className='flex'>
                <button
                    className="text-left text-xl space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <h3 className='my-2 mt-4 font-bold text-xl'>
                    {textBlocks.map((block, i)=>{
                        const style = assignCssProperties(block)
                        return(
                        <span style={style} key={i}>{block.text}</span>
                    )})}    
                </h3>
            </div>}
            {isOpen && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}
