"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import MdBlockComponent from '../mdBlock';
import Paragraph from '../paragraph/paragraph';

type Props={
    mdBlock:MdBlock
    depth:number;
}

export default function Callout(props:Props) {
    const {mdBlock,depth} = props;
    const parent = mdBlock.parent.split("> ")[1];
    if(mdBlock.children.length > 0 && parent.includes(mdBlock.children[0].parent)){
        return (
            <div className='bg-white p-2 px-3 mb-3 mt-4 border border-neutral-300 rounded' id={mdBlock.blockId}>
                <Paragraph  mdBlock={mdBlock} quote={true} parent={parent.replaceAll("#","")} depth={depth} />
                {mdBlock.children.slice(1).map((child, i)=>(
                    <div className='ml-4' key={i}>
                        <MdBlockComponent mdBlock={child} depth={depth +1} />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='bg-white p-2 px-3 mb-3 mt-4 border border-neutral-300 rounded' id={mdBlock.blockId}>
            <Paragraph mdBlock={mdBlock} quote={true} parent={parent} depth={depth} />
            {mdBlock.children.map((child, i)=>(
                <MdBlockComponent mdBlock={child} key={i} depth={depth +1} />
            ))}
        </div>
    )
}
