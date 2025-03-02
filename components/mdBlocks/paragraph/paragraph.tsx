"use client";
import { searchMDKeyword } from '@/lib/mdBlockHelper';
import { MdTypeAndText } from '@/types/parent';
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import MdBlockComponent from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    parent:string;
    depth:number;
    quote?:boolean;
    slug:string;
}

export default function Paragraph(props:Props){
    const {parent,mdBlock,depth,quote,slug} = props;
    const [mdTypeAndTextList,setMd]=useState<MdTypeAndText[]>([]);
    useEffect(()=>{
        const md = searchMDKeyword(parent)
        setMd(md)
    },[])
    if(mdBlock.parent==="c"){
        return null;
    }

    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p>
                {mdTypeAndTextList.map((text, index) => {
                    if(text.type.split(" ").length > 1){
                        console.log(text)
                    }
                    if(text.link === undefined){
                        return ( 
                            <span key={index} style={text.style}>
                                {text.text}
                            </span>)
                    }else{
                        if(text.link===''){
                            return (<span key={index} style={text.style}>
                                <span className='text-neutral-500 underline'>{text.text}</span>
                            </span>)
                        }else{
                            return (<span key={index} style={text.style}>
                                <Link href={text.link} className='text-neutral-500 underline cursor-pointer hover:text-neutral-800'>{text.text}</Link>
                            </span>)
                        }
                    }
                })}
            </p>
            {(quote===false || quote===undefined) && mdBlock.children.length!==0 && mdBlock.children.map((child,i)=>{
                return (<div key={i}>
                    <MdBlockComponent slug={slug} mdBlock={child} depth={depth + 1} />
                </div>)
            })}
        </div>
    )
}