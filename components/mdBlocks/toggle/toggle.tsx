import React, { useState } from 'react'
import MdBlockComponent from '../mdBlock';
import { ParagraphData } from '@/types/paragraph';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';
import RenderParent from '../renderParent';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function ToggleBlock(props:Props) {
    try{
        const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);
    const textData = typeAssertio<ParagraphData>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
    
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()

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
                        return <RenderParent key={i} text={text} i={i} handleClick={()=>handleClick(text.href,text.scroll)} />
                    })}
                    {textData.parent.length===0 && <span className='opacity-0' >a</span>}
                </p>
            </div>
            {isOpen && mdBlock.children.map((child)=>(
                <div className='ml-4' key={child.blockId}>
                    <MdBlockComponent mdBlock={child} depth={depth + 1} />
                </div>
            ))}
        </div>
    )
    }catch(e){
        throw new Error(`error in Toggle: ${e}`)
    }
}

