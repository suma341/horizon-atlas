"use client";
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';

type Props = {
  mdBlock: MdBlock;
  depth: number;
};
  
type ogsData ={
  ogTitle?: string;
  ogDescription?: string;
  ogSiteName?:string;
  ogLocale?: string;
  favicon?: string;
  ogUrl?: string;
  ImageUrl?:string;
}

export default function Bookmark(props: Props) {
  const { mdBlock } = props;
  const [ogpData, setOgpData] = useState<ogsData>();
  const match = mdBlock.parent.match(/\((.*?)\)/g);

  useEffect(() => {
    const fetchOgpData = async () => {
        const res = await fetch(`/horizon-atlas/notion_data/ogsData/${mdBlock.blockId}.json`);
        const data:ogsData = await res.json();
        setOgpData(data);
        }
    fetchOgpData();
  }, []);

  return (
    <div className="my-2 rounded-sm border-2 border-neutral-200 hover:bg-neutral-100">
        {ogpData !==undefined && (
            <Link href={ogpData.ogUrl || ""}>
                <div className="flex">
                    <div className='m-3'>
                        <p className='text-neutral-800 line-clamp-1'>{ogpData.ogTitle}</p>
                        <p className='text-neutral-500 text-sm line-clamp-2'>{ogpData.ogDescription}</p>
                        <div className='flex mb-0 mt-2'>
                            {ogpData.favicon!==undefined && 
                              <img src={ogpData.favicon} className='w-auto max-h-4 rounded-full m-0 mr-2' alt={'pageIcon'} />}
                            <span className='text-neutral-600 text-xs line-clamp-1'>
                              {ogpData.ogUrl}
                            </span>
                        </div>
                    </div>
                    {ogpData.ImageUrl !==undefined && ogpData.ImageUrl!==undefined && (
                    <div className='p-0 m-0' style={{ lineHeight: 0 }}>
                        <img src={ogpData.ImageUrl} className='w-96 h-28 rounded-sm lg:w-72' alt={'pageImage'} />
                    </div>
                    )}
                </div>
            </Link>
        )}
        {ogpData===undefined && match && (
          <Link href={match[0].slice(1, -1)}>
          <div className="flex">
              <div className='m-3'>
                  <p className='text-neutral-800 line-clamp-1'>{match[0].slice(1, -1)}</p>
                  <div className='flex mb-0 mt-2'>
                      <span className='text-neutral-600 text-xs line-clamp-1'>
                        {match[0].slice(1, -1)}
                      </span>
                  </div>
              </div>
          </div>
      </Link>
        )}
    </div>
  );
}
