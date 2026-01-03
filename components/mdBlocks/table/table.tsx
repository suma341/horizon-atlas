import React from 'react'
import Table_row from '../table_row/table_row';
import { MdBlock } from '@/types/MdBlock';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function TableBlock(props:Props) {
    const {mdBlock} = props;
    const hasColumnHeader = mdBlock.parent.table?.has_column_header
    const hasRowHeader = mdBlock.parent.table?.has_row_header
    const header: "col" | "row" | "" = hasColumnHeader ? "col" : (hasRowHeader ? "row" : "")

  return (
    <div className='overflow-x-auto whitespace-nowrap my-2' id={mdBlock.blockId}>
        <table className='border border-neutral-300'>
            <tbody>
                {mdBlock.children.map((table_row,i)=>{
                    if(table_row.type==="table_row")
                    return (
                        <Table_row mdBlock={table_row} key={table_row.blockId} header={header} rowIndex={i} />
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}
