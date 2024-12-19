import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function ImageBlock(props:Props) {
    const {mdBlock} = props;
    const match = mdBlock.parent.match(/\!\[([^\]]+)\]\(([^\)]+\))/);
      if(match){
        const url = match[2][-1]==')' ? match[2].slice(0,-1) : match[2];
        return (
            <div className='w-10/12 h-auto'>
                <img src={url.slice(0,-1)} alt={''} style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block', 
                    }} />
            </div>
        )
      }
}
