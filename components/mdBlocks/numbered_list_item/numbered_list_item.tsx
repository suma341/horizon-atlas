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

export default function NumberedListItem(props:Props) {
    const {mdBlock,depth} =props;
    const splitedText = mdBlock.parent.split(' ');
    const text = splitedText.slice(1).join("");
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
        <div className='my-1.5' id={mdBlock.blockId}>
            <p className='flex'>
                <TextBlock mdTypeAndTextList={mdTypeAndTextList} />
            </p>
            {mdBlock.children.map((child,i)=>(
                <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                    <MdBlockComponent mdBlock={child} depth={depth +1} />
                </div>
            ))}
        </div>
    )
}
