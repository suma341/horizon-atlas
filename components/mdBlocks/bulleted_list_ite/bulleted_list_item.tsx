"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import Paragraph from '../paragraph/paragraph';
import MdBlockComponent from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function BulletedListItem(props:Props) {
    const {mdBlock,depth} =props;
    const splitedText = mdBlock.parent.split(" ")
    const text = splitedText.slice(1).join("");

    return (
        <div id={mdBlock.blockId}>
            <p className='my-2 flex'>
                <span className='font-bold mr-1 text-xl'>・</span>
                <Paragraph  quote={true} parent={text} depth={depth + 1} mdBlock={mdBlock} />
            </p>
            {mdBlock.children.map((child,i)=>(
                <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                    <MdBlockComponent mdBlock={child} depth={depth +1} />
                </div>
            ))}
        </div>
    )
}
