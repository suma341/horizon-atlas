"use client";
import { Parent } from '@/types/Parent';
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';

type Props = {
  mdBlock: MdBlock;
  depth: number;
};

interface ogData{
  meta:{
    description:string;
    title:string;
  };
  links:{
    thumbnail?:{
        href: string;
        type: string,
        rel: string[];
      }[];
    icon?: {
      href: string;
      type: string;
      rel: string[];
    }[];
  }
}

type BookmarkData ={
  parent:Parent[];
  url:string;
  downloadUrl:string;
}

export default function Bookmark(props: Props) {
  const { mdBlock } = props;
  const [ogData, setOgData] = useState<ogData>();
  const data:BookmarkData = JSON.parse(mdBlock.parent);

  useEffect(() => {
    const fetchOgpData = async () => {
      if(data.downloadUrl !== ""){
        const res = await fetch(data.downloadUrl);
        if(!res || !res.ok){
          return;
        }else{
          const ogData:ogData = await res.json();
          setOgData(ogData);
        }
        }
    }
    fetchOgpData();
  },[mdBlock.blockId,data.downloadUrl]);
  
  return (
    <div className="my-2 rounded-sm border-2 border-neutral-200 hover:bg-neutral-100" id={mdBlock.blockId}>
      <Link href={data.url} target='_brank' rel="noopener noreferrer">
          <div className="flex">
              <div className='m-3'>
                  <p className='text-neutral-800 line-clamp-1'>{(data.downloadUrl && ogData && ogData.meta) ? ogData.meta.title : new URL(data.url).hostname}</p>
                  {data.downloadUrl && ogData && ogData.meta && ogData.meta.description && <p className='text-neutral-500 text-sm line-clamp-2'>{ogData.meta.description}</p>}
                  <div className='flex mb-0 mt-2'>
                      {data.downloadUrl && ogData && ogData.links && ogData.links.icon &&
                        <img src={ogData.links.icon[0].href} className='w-auto max-h-4 rounded-full m-0 mr-2' alt={'pageIcon'} />}
                      <span className='text-neutral-600 text-xs line-clamp-1'>
                        {data.url}
                      </span>
                  </div>
              </div>
              {data.downloadUrl && ogData && ogData.links && ogData.links.thumbnail && (
              <div className='p-0 m-0' style={{ lineHeight: 0 }}>
                  <img src={ogData.links.thumbnail[0].href} className='w-96 h-28 rounded-sm lg:w-72' alt={'pageImage'} />
              </div>
              )}
          </div>
      </Link>
    </div>
  );
}
