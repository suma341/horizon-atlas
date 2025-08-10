"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import MdBlockComponent from '../mdBlock';
import { ParagraphData } from '@/types/paragraph';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';
import { renderTextWithBreaks } from '../renderTextWithBreaks';

type Props={
    mdBlock:MdBlock;
    depth:number;
    sameDepth?:number;
}

export default function BulletedListItem(props:Props) {
    const {mdBlock,depth,sameDepth} =props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

    const bulletedListDepth = sameDepth ?? 0;

    const { handleClick } = usePageLink();

    return (
        <div id={mdBlock.blockId}>
            <p style={colorProperty}>
                <span className='font-bold text-xl'>{bulletedListDepth % 3===0 && "・"}</span>
                <span className='font-bold text-xs mr-1'>{bulletedListDepth % 3===1 && "○   "}</span>
                <span className='font-bold text-xs mr-1'>{bulletedListDepth % 3===2 && "■   "}</span>
                {textData.parent.map((text)=>{
                    const style = assignCss(text)
                    return renderTextWithBreaks(text.plain_text,style,()=>handleClick(text.href,text.scroll))
                    })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>(
                <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                    <MdBlockComponent mdBlock={child} depth={depth +1} sameDepth={child.type==="bulleted_list_item" ? bulletedListDepth + 1 : undefined} />
                </div>
            ))}
        </div>
    )
}
