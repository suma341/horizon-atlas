"use client";
import React, { ChangeEvent, useState } from 'react'
import MdBlockComponent from '../mdBlock';
import { MdBlock } from '@/types/MdBlock';
import { TodoData } from '@/types/todo';
import { typeAssertio } from '@/lib/typeAssertion';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { usePageLink } from '@/hooks/usePagePush';
import RenderParent from '../renderParent';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function To_do(props:Props) {
    try{
        const {mdBlock,depth} = props;
        const textData = typeAssertio<TodoData>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
        const [checked, setChecked] = useState(textData.checked);

        const colorProperty = getColorProperty(textData.color);
        
        const { handleClick } = usePageLink()

        const handleCheck =(e:ChangeEvent<HTMLInputElement>)=>{
            setChecked(e.target.checked)
        }

    return (
        <div className='my-1 border-neutral-800 pl-1.5' id={mdBlock.blockId} style={colorProperty}>
            <div className='flex gap-2'>
                <input type="checkbox" checked={checked} onChange={handleCheck} />
                 <p style={{textDecorationLine:checked ? "line-through" : "none",color:checked ? "gray" : undefined}}>
                    {textData.parent.map((text,i)=>{
                        return <RenderParent key={i} text={text} i={i} handleClick={()=>handleClick(text.href,text.scroll)} />
                    })}
                    {textData.parent.length===0 && <span className='opacity-0' >a</span>}
                </p>
            </div>
            {mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
    }catch(e){
        throw new Error(`error in to_do: ${e}`)
    }
}