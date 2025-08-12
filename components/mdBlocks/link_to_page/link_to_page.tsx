import Link from 'next/link';
import { MdBlock } from 'notion-to-md/build/types';
import Image from "next/image"
import { MdOutlineArrowOutward } from "react-icons/md";
import { LinkToPageBlock } from '@/types/mdBlocks';

type Props = {
  mdBlock: MdBlock;
};

export default function Link_to_page(props: Props) {
  const { mdBlock } = props;
  const pageToLinkBlock:LinkToPageBlock = JSON.parse(mdBlock.parent);

  return (
    <Link href={pageToLinkBlock.link} target='_brank' rel="noopener noreferrer" 
     className='my-2 flex hover:bg-neutral-100 hover:text-neutral-600 p-0.5' id={mdBlock.blockId}>
      <div className='relative m-0 ml-0.5 mr-1.5 bottom-0.5'>
        {(!pageToLinkBlock.iconUrl || pageToLinkBlock.iconUrl==="") &&<Image src={"/horizon-atlas/file_icon.svg"} alt={pageToLinkBlock.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {pageToLinkBlock.iconType !=="emoji" && pageToLinkBlock.iconType !=="custom_emoji" && <Image src={pageToLinkBlock.iconUrl} alt={pageToLinkBlock.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {pageToLinkBlock.iconType ==="custom_emoji" && <img src={pageToLinkBlock.iconUrl} alt={pageToLinkBlock.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {pageToLinkBlock.iconType ==="emoji" &&<p className='relative w-5 h-5 m-0 mr-1 align-middle ml-0.5 text-lg'>{pageToLinkBlock.iconUrl}</p>}
        <MdOutlineArrowOutward size={18} className='absolute w-4 h-auto text-neutral-700 right-[-2.3px] bottom-[-3px] stroke-1 stroke-white' style={{clipPath:"inset(1px 1px 1px 1px)"}} />
      </div>
      <span className="text-neutral-500 underline">
        {pageToLinkBlock.title}
      </span>
    </Link>
  );
}
