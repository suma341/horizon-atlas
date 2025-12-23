import React, { useState } from 'react'
import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import RenderParent from '../renderParent';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading2(props:Props) {
    try{
        const {mdBlock,depth} = props;
        const [isOpen, setIsOpen] = useState(false);
        const data = mdBlock.parent.header;
        const { handleClick } = usePageLink()
        
        if(!data)return;
        const colorProperty = getColorProperty(data.color);
    
    
    return (
        <div id={mdBlock.blockId} className='mb-2 mt-6'>
             {!data.is_toggleable && <h2 className='font-bold text-2xl' style={colorProperty}>
                {data.parent.map((text,i)=>{
                    const style = assignCss(text)
                    return (<span style={style} key={i} onClick={()=>handleClick(text.href,text.scroll,text.is_same_bp)}>{text.plain_text}</span>)
                })}
            </h2>}
            {data.is_toggleable && <div className='flex'>
                <button
                    className="text-left text-xl space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition justify-end"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <h2 className='font-bold text-2xl' style={colorProperty}>
                    {data.parent.map((text,i)=>{
                        return <RenderParent key={i} text={text} i={i} />
                    })}
                </h2>
            </div>}
            {isOpen && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
            {!data.is_toggleable && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
    }catch(e){
        throw new Error(`error in heading2 error: ${e}`)
    }
}
