import React, { useState } from 'react'
import { getColorProperty } from '@/lib/backgroundCorlor';
import { MdBlock } from '@/types/MdBlock';
import RenderParent from '../renderParent';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function ToggleBlock(props:Props) {
    try{
        const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);
    const textData = mdBlock.parent.paragraph
    if(!textData)return;
    
    const colorProperty = getColorProperty(textData.color);


    return (
        <div key={mdBlock.blockId} className='my-1 border-neutral-800 pl-1.5' id={mdBlock.blockId} style={colorProperty}>
            <div className='flex'>
                <button
                    className="text-left space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className='relative top-[-5px]'>{isOpen ? "▼" : "▶︎"}</span>
                </button>
                <p>
                    {textData.parent.map((text,i)=>{
                        return <RenderParent key={i} text={text} i={i} />
                    })}
                    {textData.parent.length===0 && <span className='opacity-0' >a</span>}
                </p>
            </div>
            {isOpen && <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />}
        </div>
    )
    }catch(e){
        throw new Error(`error in Toggle: ${e}`)
    }
}

