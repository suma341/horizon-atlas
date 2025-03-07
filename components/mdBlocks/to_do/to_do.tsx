"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { parseMarkdown } from '@/lib/parseMD';
import { MdTypeAndText } from '@/types/textAndType';
import { assignCssProperties } from '@/lib/assignCssProperties';
import MdBlockComponent from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function To_do(props:Props) {
    const {mdBlock,depth} = props;
    const [checked, setChecked] = useState(false);
    const [mdTypeAndTextList,setMd]=useState<MdTypeAndText[]>([]);
    useEffect(()=>{
        const inputData:MdTypeAndText = {
            text: mdBlock.parent.slice(6),
            type: [],
            link:[]
        }
        const setData = parseMarkdown(inputData);
        setMd(setData)
    },[mdBlock])
    useEffect(()=>{
        const parent = mdBlock.parent.slice(2);
        const checked =parent[1] === "x"
        setChecked(checked)
    },[mdBlock.parent])

    const handleCheck =(e:ChangeEvent<HTMLInputElement>)=>{
        setChecked(e.target.checked)
    }

    return (
        <div className='my-1 border-neutral-800 pl-1.5' id={mdBlock.blockId}>
            <div className='flex gap-2'>
                <input type="checkbox" checked={checked} onChange={handleCheck} />
                <>
                    {mdTypeAndTextList.map((text,i)=>{
                        const style = assignCssProperties(text);
                        return (<p key={i} style={style} className={checked ? 'line-through text-neutral-500' : ""}>{text.text}</p>)
                    })}
                </>
            </div>
            {mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}