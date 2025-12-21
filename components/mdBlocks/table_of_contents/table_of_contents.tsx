import { MdBlock } from '@/types/MdBlock';
import React, { useEffect, useState } from 'react'
import { typeAssertio } from '@/lib/typeAssertion';

type Props = {
    mdBlock: MdBlock;
  };

  type HeadingType ={
    type:number;
    parent:string;
    blockId:string;
}

function Table_of_contents({mdBlock}:Props) {
    try{
        const [headingList,setHeadingList]=useState<HeadingType[]>([])
    useEffect(()=>{
        const heading = typeAssertio<HeadingType[]>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
        setHeadingList(heading)
    },[mdBlock])

    const scrollToSection = (targetId: string) => {
        const element = document.getElementById(targetId);
        if (element) {
            const yOffset = -100; 
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
        element?.classList.add("highlight")
        setTimeout(()=>{
            element?.classList.remove("highlight");
        },1600)
    };

  return (
    <div id={mdBlock.blockId} className='w-full'>
        {headingList.map((heading,i)=>{
            return (
                <div key={i} onClick={()=>scrollToSection(heading.blockId)} className='mt-0.5 w-full py-1 rounded-md cursor-pointer hover:bg-neutral-100'>
                    {heading.type===1 && <p className='ml-0.5 text-neutral-500 underline'>
                        {heading.parent}</p>}
                    {heading.type===2 && <p className='ml-5 mt-1 text-neutral-500 underline'>
                        {heading.parent}</p>}
                    {heading.type===3 && <p className='ml-8 text-neutral-500 underline'>
                        {heading.parent}</p>}
                </div>)
        })}
    </div>
  )
    }catch(e){
        throw new Error(`error in table_of_contents: ${e}`)
    }
}

export default Table_of_contents;