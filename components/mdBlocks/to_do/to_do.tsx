"use client";
import React, { ChangeEvent, useState } from 'react'
import { MdBlock } from '@/types/MdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import RenderParent from '../renderParent';
import { RenderChildren } from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function To_do(props:Props) {
    try{
        const {mdBlock,depth} = props;
        const textData = mdBlock.parent.todo
        const [checked, setChecked] = useState(textData?.checked); 

        const handleCheck =(e:ChangeEvent<HTMLInputElement>)=>{
            setChecked(e.target.checked)
        }

        if(!textData)return;

        const colorProperty = getColorProperty(textData.color);

        return (
            <div className='my-1 border-neutral-800 pl-1.5' id={mdBlock.blockId} style={colorProperty}>
                <div className='flex gap-2'>
                    <input type="checkbox" checked={checked} onChange={handleCheck} />
                    <p style={{textDecorationLine:checked ? "line-through" : "none",color:checked ? "gray" : undefined}}>
                        {textData.parent.map((text,i)=>{
                            return <RenderParent key={i} text={text} i={i} />
                        })}
                        {textData.parent.length===0 && <span className='opacity-0' >a</span>}
                    </p>
                </div>
                <RenderChildren mdBlocks={mdBlock.children} depth={depth + 1} />
            </div>
        )
        }catch(e){
            throw new Error(`error in to_do: ${e}`)
        }
}