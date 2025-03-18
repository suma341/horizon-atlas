"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import MdBlockComponent from '../mdBlock';
import { parseMarkdown } from '@/lib/parseMD';
import { MdTypeAndText } from '@/types/textAndType';
import TextBlock from '../text';
import { getColorProperty } from '@/lib/backgroundCorlor';

type Props={
    mdBlock:MdBlock;
    depth:number;
    quote?:boolean;
}

type Text={
    parent:string,
    color:string
}

export default function Paragraph(props:Props){
    const {mdBlock,depth,quote} = props;
    const [mdTypeAndTextList,setMd]=useState<MdTypeAndText[]>([]);
    const textData:Text = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);
    useEffect(()=>{
        const inputData:MdTypeAndText = {
            text: textData.parent,
            type: [],
            link:[]
        }
        const setData = parseMarkdown(inputData);
        setMd(setData)
    },[mdBlock.blockId])

    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <div style={colorProperty}>
                <TextBlock mdTypeAndTextList={mdTypeAndTextList} />
            </div>
            {(quote===false || quote===undefined) && mdBlock.children.length!==0 && mdBlock.children.map((child,i)=>{
                return (<div key={i}>
                    <MdBlockComponent mdBlock={child} depth={depth + 1} />
                </div>)
            })}
        </div>
    )
}