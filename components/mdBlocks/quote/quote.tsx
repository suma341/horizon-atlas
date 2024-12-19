import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import MdBlockComponent from '../mdBlock';
import Paragraph from '../paragraph/paragraph';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Quote(props:Props) {
    const {mdBlock,depth} = props;
    const text = mdBlock.parent.split(" ")[1];

    return (
        <div className='my-1 border-l-2 border-neutral-800 pl-3'>
            <Paragraph parent={text} depth={depth + 1} />
            {mdBlock.children.map((child)=>(
                <MdBlockComponent mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}

