"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import Table_row from '../table_row/table_row';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function TableBlock(props:Props) {
    const {mdBlock} = props;

  return (
    <div className='overflow-x-auto whitespace-nowrap my-2' id={mdBlock.blockId}>
        <table className='border border-neutral-300'>
            <tbody>
                {mdBlock.children.map((table_row)=>{
                    if(table_row.type==="table_row")
                    return (
                        <Table_row mdBlock={table_row} key={table_row.blockId} />
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}
