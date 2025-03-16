"use client";
import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useCurriculumIdStore from '@/stores/curriculumIdStore';
import useIconStore from '@/stores/iconStore';
import { IconInfo } from '@/types/iconInfo';

type Props = {
  mdBlock: MdBlock;
};

export default function ChildPage(props: Props) {
  const { mdBlock } = props;
  const title = mdBlock.parent.split('## ')[1]; 
  const pageId = mdBlock.blockId;
  const { curriculumId } = useCurriculumIdStore();
  const {icons} = useIconStore();
  const [icon,setIcon] = useState<IconInfo | undefined>()
  useEffect(()=>{
    const icon_ = icons.find((item)=>item.pageId===mdBlock.blockId)
    setIcon(icon_)
  },[icons,mdBlock.blockId])

  const newPath = `/posts/curriculums/${curriculumId}/${pageId}`; 

  return (
      <Link href={newPath} id={mdBlock.blockId}>
        <div className=' my-0.5 py-1 px-0.5 hover:bg-neutral-100 cursor-pointer text-neutral-500 flex'>
          {(!icon || icon.iconType === "") && <Image src={"/horizon-atlas/file_icon.svg"} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
          {icon && icon.iconType !=="emoji" && icon.iconType !== "" &&<Image src={icon.iconUrl} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
          {icon && icon.iconType ==="emoji" &&<p className='relative w-5 h-5 m-0 mr-1 align-middle ml-0.5'>{icon.iconUrl}</p>}
          <span className='underline'>{title}</span>
        </div>
      </Link>
  );
}
