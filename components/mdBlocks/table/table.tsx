import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function TableBlock(props:Props) {
    const {mdBlock} = props;
    const dividedRows = mdBlock.parent.split("\n");
    console.log(dividedRows);
    const rows = dividedRows.map((row)=> row.slice(2,-2));
    console.log(rows);
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
                                    {column}
                                </th>)
                            }else if(i===1 && column==='------------'){
                                return undefined;
                            }else{
                                return (<td key={j} className='border border-gray-500 px-4 py-2'>
                                    {column}
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
