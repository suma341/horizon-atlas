"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React, { useEffect, useState } from 'react'
import MdBlockComponent from '../mdBlock';
import { MdTypeAndText } from '@/types/textAndType';
import { parseMarkdown } from '@/lib/parseMD';
import TextBlock from '../text';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function ToggleBlock(props:Props) {
    const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [mdTypeAndTextList,setMd]=useState<MdTypeAndText[]>([]);
    useEffect(()=>{
        const inputData:MdTypeAndText = {
            text: mdBlock.parent,
            type: [],
            link:[]
        }
        const setData = parseMarkdown(inputData);
        setMd(setData)
    },[mdBlock.blockId])

    return (
        <div className='my-1 border-neutral-800 pl-1.5' id={mdBlock.blockId}>
            <div className='flex'>
                <button
                    className="text-left space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <TextBlock mdTypeAndTextList={mdTypeAndTextList} />
            </div>
            {isOpen && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}

