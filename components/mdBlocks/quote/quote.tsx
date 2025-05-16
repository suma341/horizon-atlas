"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import MdBlockComponent from '../mdBlock';
import { ParagraphData } from '@/types/paragraph';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Quote(props:Props) {
    const {mdBlock,depth} = props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()

    return (
        <div className='my-1 border-l-2 border-neutral-800 pl-3' id={mdBlock.blockId}>
            <p style={colorProperty}>
                    {textData.parent.map((text)=>{
                        const style = assignCss(text)
                        return text.plain_text.split("\n").map((line,index)=>{
                            return (<>
                                <span key={index} style={style} onClick={()=>handleClick(text.href,text.scroll)}>{line}</span>
                                {text.plain_text.split("\n")[1] && <br />}
                            </>)
                        })})}
                    {textData.parent.length===0 && <span className='opacity-0' >a</span>}
                </p>
            {mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}

