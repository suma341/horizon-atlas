"use client";
import { MdBlock } from 'notion-to-md/build/types'
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

export default function NumberedListItem(props:Props) {
    const {mdBlock,depth,sameDepth} =props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

    const numberDepth = sameDepth ?? 1;

    const { handleClick } = usePageLink()
    return (
        <div className='my-1.5' id={mdBlock.blockId}>
            <p style={colorProperty}>
                <span>{numberDepth}.  </span>
                {textData.parent.map((text)=>{
                    const style = assignCss(text)
                    return renderTextWithBreaks(text.plain_text,style,()=>handleClick(text.href,text.scroll))
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>
                <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                    <MdBlockComponent mdBlock={child} depth={depth +1} sameDepth={child.type==="numbered_list_item" ? numberDepth + 1 : undefined} />
                </div>
            )}
        </div>
    )
}
