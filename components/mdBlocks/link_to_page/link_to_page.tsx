"use client";
import { searchPageById } from '@/lib/searchPageById';
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';

type Props = {
  mdBlock: MdBlock;
};

export default function Link_to_page(props: Props) {
  const { mdBlock } = props;
  const [url,setUrl] = useState("");
  const [title,setTitle] = useState("");

  useEffect(()=>{
    async function setPage(){
        const match = mdBlock.parent.match(/\((.*?)\)/g);
        if(match){
            const id = match[0].slice(1, -1);
            const page = await searchPageById(id);
            const _url = page.isChildPage ? `/posts/post/${page.slug}/${page.pageId}` : `/posts/post/${page.slug}`
            setUrl(_url);
            setTitle(page.title);
        }
    }
    setPage();
  },[])

  return (
    <div className='my-2'>
      <Link href={url} className="text-neutral-500 underline hover:text-neutral-600">
        {title}...
      </Link>
    </div>
  );
}
