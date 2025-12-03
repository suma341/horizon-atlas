import React from 'react'
import MdBlockComponent from '../mdBlock';
import { ParagraphData } from '@/types/paragraph';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';
import { renderTextWithBreaks } from '../renderTextWithBreaks';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Quote(props:Props) {
    try{
        const {mdBlock,depth} = props;
    const textData = typeAssertio<ParagraphData>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()

    return (
        <div className='my-1 border-l-2 border-neutral-800 pl-3' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text)=>{
                    const style = assignCss(text)
                    return renderTextWithBreaks(text.plain_text,style,()=>handleClick(text.href,text.scroll))
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
    }catch(e){
        throw new Error(`error in quote: ${e}`)
    }
}

