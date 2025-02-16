import { findHeadingBlock } from '@/lib/findHeadingBlock';
import { searchPageById } from '@/lib/searchPageById';
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
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        async function getHeadingList(){
            setLoading(true);
            const { slug } = await searchPageById(mdBlock.blockId);
            console.log("slug",slug)
            const res = await fetch(`/horizon-atlas/notion_data/eachPage/${slug}.json`);
            const blocks:MdBlock[] = await res.json();
            const findList = findHeadingBlock(blocks);
            console.log("findList",findList);
            setHeadingList(findList);
            setLoading(false);
        }
        getHeadingList();
    },[])

    if(loading){
        <div>...loading</div>
    }

  return (
    <div id={mdBlock.blockId}>
        {headingList.map((heading,i)=>{
            return (
                <div key={i} className='mt-1.5'>
                    {heading.type===1 && <a className='ml-0.5 text-neutral-500 underline cursor-pointer hover:text-neutral-800' href={`#${heading.blockId}`}>
                        {heading.parent.slice(2)}</a>}
                    {heading.type===2 && <a className='ml-5 mt-1 text-neutral-500 underline cursor-pointer hover:text-neutral-800' href={`#${heading.blockId}`}>
                        {heading.parent.slice(3)}</a>}
                    {heading.type===3 && <a className='ml-8 text-neutral-500 underline cursor-pointer hover:text-neutral-800' href={`#${heading.blockId}`}>
                        {heading.parent.slice(4)}</a>}
                </div>)
        })}
    </div>
  )
}

export default Table_of_contents