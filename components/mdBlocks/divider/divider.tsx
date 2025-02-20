"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react'

type Props={
  mdBlock:MdBlock
}

export default function Divider({mdBlock}:Props) {
  return (
    <div id={mdBlock.blockId}>
        <div className='border-neutral-300 border-b size-full my-2'></div>
    </div>
  )
}
