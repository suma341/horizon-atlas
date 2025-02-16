"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import MdBlockComponent from '../mdBlock';
import Paragraph from '../paragraph/paragraph';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Callout(props:Props) {
    const {mdBlock,depth} = props;
    const parent = mdBlock.parent.split("> ")[1];

    return (
        <div className='bg-white p-2 px-3 mb-3 mt-4 border border-neutral-300 rounded'>
            <Paragraph parent={parent} depth={depth +1} />
            {mdBlock.children.map((child, i)=>(
                <MdBlockComponent mdBlock={child} key={i} depth={depth +1} />
            ))}
        </div>
    )
}
