import React from 'react'
import { getColorProperty } from '@/lib/backgroundCorlor';
import { MdBlock } from '@/types/MdBlock';
import RenderParent from '../renderParent';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Quote(props:Props) {
    try{
        const {mdBlock,depth} = props;
        const textData = mdBlock.parent.paragraph

        if(!textData)return;
        const colorProperty = getColorProperty(textData.color);

    return (
        <div className='my-1 border-l-2 border-neutral-800 pl-3' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text,i)=>{
                    return <RenderParent key={i} text={text} i={i} />
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />
        </div>
    )
    }catch(e){
        throw new Error(`error in quote: ${e}`)
    }
}

