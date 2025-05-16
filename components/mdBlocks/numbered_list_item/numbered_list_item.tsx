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
    order:number;
}

export default function NumberedListItem(props:Props) {
    const {mdBlock,depth,order} =props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()

    let o = 0;


    return (
        <div className='my-1.5' id={mdBlock.blockId}>
            <p style={colorProperty}>
                <span>{order}.  </span>
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
            {mdBlock.children.map((child,i)=>{
                if(child.type==="numbered_list_item"){
                     o = o + 1
                    return (
                        <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                            <MdBlockComponent mdBlock={child} depth={depth + 1} order={o} />
                        </div>
                    )
                }else{
                    o = 0
                    return (
                        <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                            <MdBlockComponent mdBlock={child} depth={depth +1} />
                        </div>
                    )
                }
                })}
        </div>
    )
}
