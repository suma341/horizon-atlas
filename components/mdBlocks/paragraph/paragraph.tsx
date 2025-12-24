import React from 'react';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { MdBlock } from '@/types/MdBlock';
import RenderParent from '../renderParent';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Paragraph(props:Props){
    try{
        const {mdBlock,depth} = props;
    const textData = mdBlock.parent.paragraph
    if(!textData)return;
    const colorProperty = getColorProperty(textData.color);

    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text,i) => {
                    return <RenderParent key={i} text={text} i={i} />
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />
        </div>
    )
    }catch(e){
        throw new Error(`error in Paragraph error: ${e}`)
    }
}