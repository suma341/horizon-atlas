import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { MdBlock } from '@/types/MdBlock';
import { useRouter } from 'next/router';

type Props = {
  mdBlock: MdBlock;
};

export default function ChildPage(props: Props) {
  try{
    const { mdBlock } = props;
    const pageId = mdBlock.blockId;
    const router = useRouter()
    const { category }= router.query as {category : string | undefined};
    const data = mdBlock.parent.child_page
    if(!data)return;
    const title = data.parent.split("## ")[1]
    const query = category ? `?category=${category}` : ""

    const newPath = `/posts/curriculums/${pageId}${query}`; 

  return (
      <Link href={newPath} id={mdBlock.blockId}>
        <div className=' my-0.5 py-1 px-0.5 hover:bg-neutral-100 cursor-pointer text-neutral-500 flex'>
          {data.iconType === "" && <Image src={"/horizon-atlas/file_icon.svg"} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
          {data.iconType !=="emoji" && data.iconType !=="custom_emoji" && data.iconType !== "" &&<Image src={data.iconUrl} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
          {data.iconType ==="emoji" &&<p className='relative w-5 h-5 m-0 mr-1 align-middle ml-0.5'>{data.iconUrl}</p>}
          {data.iconType ==="custom_emoji" && <img src={data.iconUrl} alt={(title==="" || title===undefined) ? data.parent : title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
          <span className='underline'>{(title==="" || title===undefined) ? data.parent : title}</span>
        </div>
      </Link>
  );
  }catch(e){
    throw new Error(`error in childPage error: ${e}`)
  }
}
