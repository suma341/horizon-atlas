import { assignCss } from '@/lib/assignCssProperties';
import React, { useState } from 'react'
import { getColorProperty } from '@/lib/backgroundCorlor';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import RenderParent from '../renderParent';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading3(props:Props) {
    try{
        const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);
    const data = mdBlock.parent.header;
    const { handleClick } = usePageLink()
    
    if(!data)return;
    const colorProperty = getColorProperty(data.color);
    
    return (
        <div id={mdBlock.blockId} className='mb-2 mt-4'>
            {mdBlock.children.length===0 && <h3 className='font-bold text-xl' style={colorProperty}>
                {data.parent.map((text,i)=>{
                    const style = assignCss(text)
                    return (<span style={style} key={i} onClick={()=>handleClick(text.href,text.scroll,text.is_same_bp)}>{text.plain_text}</span>)
                })}
            </h3>}
            {mdBlock.children.length !==0 && <div className='flex'>
                <button
                    className="text-left text-xl space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition justify-end"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <h3 className='font-bold text-xl' style={colorProperty}>
                    {data.parent.map((text,i)=>{
                        return <RenderParent key={i} text={text} i={i} />
                    })}  
                </h3>
            </div>}
            {(isOpen || !data.is_toggleable) && <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />}
        </div>
    )
    }catch(e){
        throw new Error(`error in heading3 error: ${e}`)
    }
}
