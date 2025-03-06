"use client";
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import MdBlockComponent from '../mdBlock';
import { parseMarkdown } from '@/lib/parseMD';
import { assignCssProperties } from '@/lib/assignCssProperties';
import { MdTypeAndText } from '@/types/textAndType';

type Props={
    mdBlock:MdBlock;
    parent:string;
    depth:number;
    quote?:boolean;
}

export default function Paragraph(props:Props){
    const {parent,mdBlock,depth,quote} = props;
    const [mdTypeAndTextList,setMd]=useState<MdTypeAndText[]>([]);
    useEffect(()=>{
        const inputData:MdTypeAndText = {
            text: parent,
            type: [],
            link:[]
        }
        const setData = parseMarkdown(inputData);
        setMd(setData)
    },[])
    if(mdBlock.parent==="c"){
        return null;
    }

    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p>
                {mdTypeAndTextList.map((text, index) => {
                    const style = assignCssProperties(text);
                    if(text.link.length === 0){
                        return ( 
                            <span key={index} style={style}>
                                {text.text}
                            </span>)
                    }else{
                        if(text.link[0]===''){
                            return (<span key={index} style={style}>
                                <span className='text-neutral-500 underline'>{text.text}</span>
                            </span>)
                        }else{
                            return (<span key={index} style={style}>
                                <Link href={text.link[0]} className='text-neutral-500 underline cursor-pointer hover:text-neutral-800'>{text.text}</Link>
                            </span>)
                        }
                    }
                })}
            </p>
            {(quote===false || quote===undefined) && mdBlock.children.length!==0 && mdBlock.children.map((child,i)=>{
                return (<div key={i}>
                    <MdBlockComponent mdBlock={child} depth={depth + 1} />
                </div>)
            })}
        </div>
    )
}