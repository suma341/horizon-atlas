"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import Paragraph from '../paragraph/paragraph';
import MdBlockComponent from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
    slug:string;
}

export default function BulletedListItem(props:Props) {
    const {mdBlock,depth,slug} =props;
    const text = mdBlock.parent.split(" ")

    return (
        <div id={mdBlock.blockId}>
            <p className='my-2 flex'>
                <span className='font-bold mr-1 text-xl'>・</span>
                <Paragraph slug={slug}  quote={true} parent={text[1]} depth={depth + 1} mdBlock={mdBlock} />
            </p>
            {mdBlock.children.map((child,i)=>(
                <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                    <MdBlockComponent slug={slug} mdBlock={child} depth={depth +1} />
                </div>
            ))}
        </div>
    )
}
