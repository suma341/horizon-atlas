import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react'

type Props = {
    mdBlock: MdBlock;
  };

  type HeadingType ={
    type:number;
    parent:string;
    blockId:string;
}

function Table_of_contents({mdBlock}:Props) {
    const [headingList,setHeadingList]=useState<HeadingType[]>([])
    useEffect(()=>{
        const heading:HeadingType[] = (JSON.parse(mdBlock.parent)).headingList;
        setHeadingList(heading)
    },[mdBlock])

    const scrollToSection = (targetId:string) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

  return (
    <div id={mdBlock.blockId} className='w-full'>
        {headingList.map((heading,i)=>{
            return (
                <div key={i} onClick={()=>scrollToSection(heading.blockId)} className='mt-0.5 w-full py-1 rounded-md cursor-pointer hover:bg-neutral-100'>
                    {heading.type===1 && <p className='ml-0.5 text-neutral-500 underline'>
                        {heading.parent.slice(2)}</p>}
                    {heading.type===2 && <p className='ml-5 mt-1 text-neutral-500 underline'>
                        {heading.parent.slice(3)}</p>}
                    {heading.type===3 && <p className='ml-8 text-neutral-500 underline'>
                        {heading.parent.slice(4)}</p>}
                </div>)
        })}
    </div>
  )
}

export default Table_of_contents;