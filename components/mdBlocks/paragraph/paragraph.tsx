"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';
import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { ParagraphData } from '@/types/paragraph';
import { assignCss } from '@/lib/assignCssProperties';

type Props={
    mdBlock:MdBlock;
    depth:number;
    quote?:boolean;
}

export default function Paragraph(props:Props){
    const {mdBlock,depth,quote} = props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

    const handleClick =(href:string | null)=>{
        if(href && href!==""){
            if(window!==undefined){
                window.location.href = href
            }
        }
    }

    if(textData.parent.length===0){
        console.log("text",textData)
    }

    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text,i)=>{
                    const style = assignCss(text)
                    return (
                    <span key={i} style={style} onClick={()=>handleClick(text.href)}>{text.plain_text}</span>
                )})}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {(quote===false || quote===undefined) && mdBlock.children.length!==0 && mdBlock.children.map((child,i)=>{
                return (<div key={i}>
                    <MdBlockComponent mdBlock={child} depth={depth + 1} />
                </div>)
            })}
        </div>
    )
}