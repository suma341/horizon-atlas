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
    const text = mdBlock.parent.split(" ")[1];

    return (
        <div className='bg-white p-2 px-3 my-2 border-2 border-neutral-400'>
            <Paragraph parent={text} depth={depth +1} />
            {mdBlock.children.map((child, i)=>(
                <MdBlockComponent mdBlock={child} key={i} depth={depth +1} />
            ))}
        </div>
    )
}
