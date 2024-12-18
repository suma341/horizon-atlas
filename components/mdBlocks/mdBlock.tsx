import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import Paragraph from './paragraph/paragraph';

type Props ={
    mdBlock:MdBlock
}

export default function MdBlockComponent(props:Props) {
    const {mdBlock} = props;
    if(mdBlock.type==='paragraph'){
      return (
        <Paragraph mdBlock={mdBlock} />
      )
    }
    
    return (
        <>
          <div></div>
        </>
    )
}

