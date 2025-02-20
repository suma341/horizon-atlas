import { findHeadingBlock } from '@/lib/findHeadingBlock';
import { searchPageById } from '@/lib/searchPageById';
import Link from 'next/link';
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
            const res = await fetch(`/horizon-atlas/notion_data/eachPage/${slug}/page.json`);
            const blocks:MdBlock[] = await res.json();
            const findList = findHeadingBlock(blocks);
            setHeadingList(findList);
            setLoading(false);
        }
        getHeadingList();
    },[])

    if(loading){
        <div>...loading</div>
    }

  return (
    <div id={mdBlock.blockId} className='w-full'>
        {headingList.map((heading,i)=>{
            return (
                <div key={i} className='mt-0.5 w-full py-1 rounded-md cursor-pointer hover:bg-neutral-100'>
                    <Link href={`#${heading.blockId}`}>
                        {heading.type===1 && <p className='ml-0.5 text-neutral-500 underline'>
                            {heading.parent.slice(2)}</p>}
                        {heading.type===2 && <p className='ml-5 mt-1 text-neutral-500 underline'>
                            {heading.parent.slice(3)}</p>}
                        {heading.type===3 && <p className='ml-8 text-neutral-500 underline'>
                            {heading.parent.slice(4)}</p>}
                    </Link>
                </div>)
        })}
    </div>
  )
}

export default Table_of_contents