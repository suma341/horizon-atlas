"use client";
import { assignCssProperties } from '@/lib/assignCssProperties';
import { parseMarkdown } from '@/lib/parseMD';
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock;
}

export default function TableBlock(props:Props) {
    const {mdBlock} = props;
    const dividedRows = mdBlock.parent.split("|\n|");
    const rows = dividedRows.map((row)=> row.slice(1,-1));

  return (
    <div className='overflow-x-auto whitespace-nowrap my-2' id={mdBlock.blockId}>
        <table className='table-auto border-collapse border border-neutral-300'>
            {rows.map((row,i)=>{
                const columns = row.split(" | ");
                return (
                    <tr key={i}>
                        {columns.map((column, j)=>{
                            if(i===0){
                                const md = parseMarkdown({text:column,type:[],link:[]})
                                return (<th key={j} className='border border-gray-300 px-4 py-2'>
                                    {md.map((text,k)=>{
                                        const style = assignCssProperties(text)
                                        return (
                                        <>
                                        {text.text==="\n" && <br />}
                                            <span key={k} style={style}>
                                                {text.text}
                                            </span>
                                        </>
                                    )})}
                                </th>)
                            }else if(i===1){
                                return null;
                            }else{
                                const md = parseMarkdown({text:column,type:[],link:[]});
                                return (<td key={j} className='border border-gray-300 px-4 py-2'>
                                    {md.map((text,k)=>{
                                        const style = assignCssProperties(text)
                                        return (
                                        <>
                                        {text.text==="\n" && <br />}
                                            <span key={k} style={style}>
                                                {text.text}
                                            </span>
                                        </>
                                    )})}
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
