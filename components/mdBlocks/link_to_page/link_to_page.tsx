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
      const TitleRegex = /\[([^\]]+)\]/g;
      const UrlRegex = /\(([^)]+)\)/g;
      const titleMatch = mdBlock.parent.match(TitleRegex);
        if(titleMatch){
            setTitle(titleMatch[0].slice(1,-1))
        }
      const urlMatch = mdBlock.parent.match(UrlRegex);
        if(urlMatch){
          setUrl(urlMatch[0].slice(1,-1))
        }
    }
    setPage();
  },[mdBlock.blockId])

  return (
    <div className='my-2' id={mdBlock.blockId}>
      <Link href={url} target='_brank' rel="noopener noreferrer" 
      className="text-neutral-500 underline hover:text-neutral-600">
        {title}
      </Link>
    </div>
  );
}
