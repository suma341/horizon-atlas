"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React, { useState } from 'react'
import MdBlockComponent from '../mdBlock';
import Paragraph from '../paragraph/paragraph';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function ToggleBlock(props:Props) {
    const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='my-1 border-neutral-800 pl-1.5 bg-neutral-100' id={mdBlock.blockId}>
            <div className='flex'>
                <button
                    className="text-left space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <Paragraph mdBlock={mdBlock} quote={true} parent={mdBlock.parent} depth={depth + 1} />
            </div>
            {isOpen && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}

