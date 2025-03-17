"use client";
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';
import Image from 'next/image';
import useCurriculumIdStore from '@/stores/curriculumIdStore';

type Props = {
  mdBlock: MdBlock;
};

type data={
  parent:string;
  iconType:string;
  iconUrl:string;
  coverUrl:string;
}


export default function ChildPage(props: Props) {
  const { mdBlock } = props;
  const pageId = mdBlock.blockId;
  const { curriculumId } = useCurriculumIdStore();
  const data:data = JSON.parse(mdBlock.parent)
  const title = data.parent.split("## ")[1]

  const newPath = `/posts/curriculums/${curriculumId}/${pageId}`; 

  return (
      <Link href={newPath} id={mdBlock.blockId}>
        <div className=' my-0.5 py-1 px-0.5 hover:bg-neutral-100 cursor-pointer text-neutral-500 flex'>
          {data.iconType === "" && <Image src={"/horizon-atlas/file_icon.svg"} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
          {data.iconType !=="emoji" && data.iconType !== "" &&<Image src={data.iconUrl} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
          {data.iconType ==="emoji" &&<p className='relative w-5 h-5 m-0 mr-1 align-middle ml-0.5'>{data.iconUrl}</p>}
          <span className='underline'>{title}</span>
        </div>
      </Link>
  );
}
