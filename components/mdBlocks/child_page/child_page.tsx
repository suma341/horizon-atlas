"use client";
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';
import Image from 'next/image';
import useCurriculumIdStore from '@/stores/curriculumIdStore';

type Props = {
  mdBlock: MdBlock;
};

export default function ChildPage(props: Props) {
  const { mdBlock } = props;
  const title = mdBlock.parent.split('## ')[1]; // 子ページのタイトルを取得
  const pageId = mdBlock.blockId;
  const { curriculumId } = useCurriculumIdStore();

  const newPath = `/posts/curriculums/${curriculumId}/${pageId}`; 

  return (
      <Link href={newPath} id={mdBlock.blockId}>
        <div className=' my-0.5 py-1 px-0.5 hover:bg-neutral-100 cursor-pointer text-neutral-500 underline flex'>
        <Image src={'/horizon-atlas/file_icon.svg'} alt={''} height={20} width={20} className='w-5 h-5 m-0 mr-0.5' />{title}
        </div>
      </Link>
  );
}
