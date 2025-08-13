"use client";
import Loader from '@/components/loader/loader';
import { Parent } from '@/types/Parent';
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';

type Props = {
  mdBlock: MdBlock;
  depth: number;
};

type OGP={
  ogTitle:string;
  ogDescription:string;
  favicon?:string;
  ogImage?: {
    url: string,
    type?: string
  }[]
}

type BookmarkData ={
  parent:Parent[];
  url:string;
  downloadUrl:string;
  ogp:undefined
} | {
  parent:Parent[];
  url:string;
  downloadUrl:undefined;
  ogp:{
    description: string | null;
    image: string | null;
    icon: string | null;
    title: string;
  }
}

export default function Bookmark(props: Props) {
  const { mdBlock } = props;
  const [ogData, setOgData] = useState<OGP>();
  const data:BookmarkData = JSON.parse(mdBlock.parent);
  const [load,setLoad] = useState(false)

  useEffect(() => {
    const fetchOgpData = async () => {
      try{
        setLoad(true)
        if(data.ogp) return;
        if(data.downloadUrl && data.downloadUrl !== ""){
          const res = await fetch(data.downloadUrl);
          if(!res || !res.ok){
            return;
          }else{
            const ogData:OGP = await res.json();
            setOgData(ogData);
          }
        }
      }finally{
        setLoad(false)
      }
    }
    fetchOgpData();
  },[mdBlock.blockId,data.downloadUrl]);

  if(data.ogp && !data.downloadUrl){
    return (
      <div className="my-2 rounded-sm border-2 border-neutral-200 hover:bg-neutral-100" id={mdBlock.blockId}>
      <Link href={data.url} target='_brank' rel="noopener noreferrer">
          <div className="flex w-full">
              <div className='m-3 w-full'>
                <p className='text-neutral-800 line-clamp-1'>{data.ogp.title}</p>
                {data.ogp.description && <p className='text-neutral-500 text-sm line-clamp-2'>{data.ogp.description}</p>}
                <div className='flex mb-0 mt-2'>
                  {data.ogp.icon &&
                  <img src={data.ogp.icon} className='w-auto max-h-4 rounded-full m-0 mr-2' alt={'pageIcon'} />}
                  <p className='text-neutral-600 text-xs line-clamp-1'>
                    {data.url}
                  </p>
                </div>
              </div>
              {data.ogp.image && (
                <div className='p-0 m-0' style={{ lineHeight: 0 }}>
                    <img src={data.ogp.image} className='w-96 h-28 rounded-sm lg:w-72' alt={'pageImage'} />
                </div>
              )}
              {!data.ogp.image && <div className='w-16 h-1' />}
          </div>
      </Link>
    </div>
    )
  }
  
  if(data.downloadUrl && !data.ogp){
    return (
      <div className="my-2 rounded-sm border-2 border-neutral-200 hover:bg-neutral-100" id={mdBlock.blockId}>
        <Link href={data.url} target='_brank' rel="noopener noreferrer">
            {!load && <div className="flex w-full">
                <div className='m-3 w-full'>
                  <p className='text-neutral-800 line-clamp-1'>{(data.downloadUrl && ogData && ogData.ogTitle) ? ogData.ogTitle : new URL(data.url).hostname}</p>
                  {data.downloadUrl && ogData && ogData.ogDescription && <p className='text-neutral-500 text-sm line-clamp-2'>{ogData.ogDescription}</p>}
                  <div className='flex mb-0 mt-2'>
                    {data.downloadUrl && ogData && ogData.favicon &&
                    <img src={ogData.favicon} className='w-auto max-h-4 rounded-full m-0 mr-2' alt={'pageIcon'} />}
                    <p className='text-neutral-600 text-xs line-clamp-1'>
                      {data.url}
                    </p>
                  </div>
                </div>
                {data.downloadUrl && ogData && ogData.ogImage && ogData.ogImage[0]?.url && (
                  <div className='p-0 m-0' style={{ lineHeight: 0 }}>
                      <img src={ogData.ogImage[0]?.url} className='w-96 h-28 rounded-sm lg:w-72' alt={'pageImage'} />
                  </div>
                )}
                {!(ogData?.ogImage && ogData?.ogImage[0]?.url) && <div className='w-16 h-1' />}
            </div>}
            {load && <Loader size={40} />}
        </Link>
      </div>
    );
    }
}
