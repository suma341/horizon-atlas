import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import Image from "next/image"
import { MdOutlineArrowOutward } from "react-icons/md";
import { IconInfo } from '@/types/iconInfo';
import useIconStore from '@/stores/iconStore';

type Props = {
  mdBlock: MdBlock;
};

export default function Link_to_page(props: Props) {
  const { mdBlock } = props;
  const [url,setUrl] = useState("");
  const [title,setTitle] = useState("");
  const [icon,setIcon] = useState<IconInfo | undefined>()
  const { icons } = useIconStore();
  
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
          const url = urlMatch[0].slice(1,-1)
          setUrl(url)
          const pageId = url.split("/")[4]
          console.log(icons)
          const icon_ = icons.find((item)=>item.pageId===pageId)
          setIcon(icon_)
        }
      }
    setPage();
  },[mdBlock.blockId,icons])

  return (
    <Link href={url} target='_brank' rel="noopener noreferrer" 
     className='my-2 flex hover:bg-neutral-100 hover:text-neutral-600 p-0.5' id={mdBlock.blockId}>
      <div className='relative m-0 ml-0.5 mr-1.5 bottom-0.5'>
        {!icon &&<Image src={"/horizon-atlas/file_icon.svg"} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {icon && icon.iconType !=="emoji" &&<Image src={icon.iconUrl} alt={title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {icon && icon.iconType ==="emoji" &&<p className='relative w-5 h-5 m-0 mr-1 align-middle ml-0.5 text-lg'>{icon.iconUrl}</p>}
        <MdOutlineArrowOutward size={18} className='absolute w-4 h-auto text-neutral-700 right-[-2.3px] bottom-[-3px] stroke-1 stroke-white' style={{clipPath:"inset(1px 1px 1px 1px)"}} />
      </div>
      <span className="text-neutral-500 underline">
        {title}
      </span>
    </Link>
  );
}
