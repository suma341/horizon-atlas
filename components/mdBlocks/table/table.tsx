"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import Paragraph from '../paragraph/paragraph'

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function TableBlock(props:Props) {
    const {mdBlock,depth} = props;
    const dividedRows = mdBlock.parent.split("\n");
    const rows = dividedRows.map((row)=> row.slice(2,-2));
  return (
    <div className='overflow-x-auto whitespace-nowrap my-2'>
        <table className='table-auto border-collapse border border-neutral-500'>
            {rows.map((row,i)=>{
                const columns = row.split(" | ");
                return (
                    <tr key={i}>
                        {columns.map((column, j)=>{
                            if(i===0){
                                return (<th key={j} className='border border-gray-500 px-4 py-2'>
                                    <Paragraph quote={true} mdBlock={mdBlock} parent={column} depth={depth + 1} />
                                </th>)
                            }else if(i===1){
                                return null;
                            }else{
                                return (<td key={j} className='border border-gray-500 px-4 py-2'>
                                    <Paragraph mdBlock={mdBlock} quote={true} parent={column} depth={depth + 1} />
                                </td>)
                            }
                        })}
                    </tr>
                )
            })}
        </table>
    </div>
  )
}
