import React from 'react';
import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { ParagraphData } from '@/types/paragraph';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';
import RenderParent from '../renderParent';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Paragraph(props:Props){
    try{
        const {mdBlock,depth} = props;
    const textData = typeAssertio<ParagraphData>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()


    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text,i) => {
                    return <RenderParent key={i} text={text} i={i} handleClick={()=>handleClick(text.href,text.scroll)} />
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>{
                return (<div key={i} className='ml-2'>
                    <MdBlockComponent mdBlock={child} depth={depth + 1} />
                </div>)
            })}
        </div>
    )
    }catch(e){
        throw new Error(`error in Paragraph error: ${e}`)
    }
}