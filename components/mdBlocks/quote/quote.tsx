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

export default function Quote(props:Props) {
    const {mdBlock,depth} = props;
    const text = mdBlock.parent.split(" ")[1];
    const [mdTypeAndTextList,setMd]=useState<MdTypeAndText[]>([]);
    useEffect(()=>{
        const inputData:MdTypeAndText = {
            text,
            type: [],
            link:[]
        }
        const setData = parseMarkdown(inputData);
        setMd(setData)
    },[mdBlock.blockId])

    return (
        <div className='my-1 border-l-2 border-neutral-800 pl-3' id={mdBlock.blockId}>
            <TextBlock mdTypeAndTextList={mdTypeAndTextList} />
            {mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}

