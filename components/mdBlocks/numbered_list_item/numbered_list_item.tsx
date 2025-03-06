"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import Paragraph from '../paragraph/paragraph';
import MdBlockComponent from '../mdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function NumberedListItem(props:Props) {
    const {mdBlock,depth} =props;
    const splitedText = mdBlock.parent.split(' ');
    const text = splitedText.slice(1).join("");

    return (
        <div className='my-1.5' id={mdBlock.blockId}>
            <p className='flex'>
                <span className='mr-2'>{splitedText[0]}</span>
                {<Paragraph quote={true} mdBlock={mdBlock} parent={text} depth={depth +1} />}
            </p>
            {mdBlock.children.map((child,i)=>(
                <div key={i} style={{marginLeft:(depth + 1) * 16}}>
                    <MdBlockComponent mdBlock={child} depth={depth +1} />
                </div>
            ))}
        </div>
    )
}
