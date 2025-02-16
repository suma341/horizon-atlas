"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React, { useState } from 'react'
import MdBlockComponent from '../mdBlock';
import Paragraph from '../paragraph/paragraph';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function ToggleBlock(props:Props) {
    const {mdBlock,depth} = props;
    const text = mdBlock.parent.split(" ")[1];
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='my-1 border-l-2 border-neutral-800 pl-3 bg-neutral-200'>
            <div className='flex'>
                <button
                    className="text-left space-x-2 p-2 rounded-lg hover:bg-neutral-300 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▶︎" : "▼"}
                </button>
                <Paragraph parent={text} depth={depth + 1} />
            </div>
            {isOpen && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}

