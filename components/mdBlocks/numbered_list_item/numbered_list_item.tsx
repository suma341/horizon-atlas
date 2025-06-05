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
    order:number;
}

export default function NumberedListItem(props:Props) {
    const {mdBlock,depth,order} =props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()
    return (
        <div className='my-1.5' id={mdBlock.blockId}>
            <p style={colorProperty}>
                <span>{order}.  </span>
                {textData.parent.map((text)=>{
                    const style = assignCss(text)
                    return renderTextWithBreaks(text.plain_text,style,()=>handleClick(text.href,text.scroll))
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>{
                if(child.type==="numbered_list_item"){
                    return (
                        <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                            <MdBlockComponent mdBlock={child} depth={depth + 1} order={order + 1} />
                        </div>
                    )
                }else{
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
