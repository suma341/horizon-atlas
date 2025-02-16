"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';
import Image from 'next/image';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function ImageBlock(props:Props) {
    const {mdBlock} = props;
        return (
            <div>
                <Image height={400} width={400} src={`/notion_data/page_image/${mdBlock.blockId}.png`} alt={'image_block'} style={{
                        width: 'auto',
                        height: '100%',
                        display: 'block', 
                        maxHeight:'400px'
                    }} />
            </div>
        )
      }

