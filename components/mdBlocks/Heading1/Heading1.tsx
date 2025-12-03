import { assignCss } from '@/lib/assignCssProperties';
import React, { useState } from 'react'
import MdBlockComponent from '../mdBlock';
import { HeadingData } from '@/types/headingData';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading1(props:Props) {
    try{
        const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);
    const data = typeAssertio<HeadingData>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
    const colorProperty = getColorProperty(data.color);

    const { handleClick } = usePageLink()

    return (
        <div id={mdBlock.blockId} className='mb-2 mt-8'>
            {!data.is_toggleable && <h1 className='font-bold text-3xl' style={colorProperty}>
                {data.parent.map((text,i)=>{
                    const style = assignCss(text)
                    return (<span style={style} key={i} onClick={()=>handleClick(text.href,text.scroll)}>{text.plain_text}</span>)
                })}
            </h1>}
            {data.is_toggleable && <div className='flex'>
                <button
                    className="text-left text-xl space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition justify-end"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <h1 className='font-bold text-3xl' style={colorProperty}>
                    {data.parent.map((text,i)=>{
                        const style = assignCss(text)
                        return (<span style={style} key={i} onClick={()=>handleClick(text.href,text.scroll)}>{text.plain_text}</span>)
                    })}
                </h1>
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
        throw new Error(`error in heading1 error: ${e}`)
    }
}
