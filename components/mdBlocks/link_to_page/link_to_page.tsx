import Link from 'next/link';
import Image from "next/image"
import { MdOutlineArrowOutward } from "react-icons/md";
import { LinkToPageBlock } from '@/types/mdBlocks';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';

type Props = {
  mdBlock: MdBlock;
};

export default function Link_to_page(props: Props) {
  try{
    const { mdBlock } = props;
  const pageToLinkBlock = typeAssertio<LinkToPageBlock>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
    const isSameDomain = (()=>{
        if(pageToLinkBlock.link.startsWith("/posts/curriculums")){
          return true
        }else if(!pageToLinkBlock.link.startsWith("http") && !pageToLinkBlock.link.startsWith("https")){
          return false
        }
        return new URL(pageToLinkBlock.link).hostname===new URL("https://ryukoku-horizon.github.io/horizon-atlas").hostname;
    })()

  return (
    <Link href={pageToLinkBlock.link} target={isSameDomain ? undefined : '_brank'} rel={isSameDomain ? undefined : "noopener noreferrer"}
     className='my-2 flex hover:bg-neutral-100 hover:text-neutral-600 p-0.5' id={mdBlock.blockId}>
      <div className='relative m-0 ml-0.5 mr-1.5 bottom-0.5'>
        {(!pageToLinkBlock.iconUrl || pageToLinkBlock.iconUrl==="") &&<Image src={"/horizon-atlas/file_icon.svg"} alt={pageToLinkBlock.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {pageToLinkBlock.iconType !=="emoji" && pageToLinkBlock.iconType !=="custom_emoji" && <Image src={pageToLinkBlock.iconUrl} alt={pageToLinkBlock.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {pageToLinkBlock.iconType ==="custom_emoji" && <img src={pageToLinkBlock.iconUrl} alt={pageToLinkBlock.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1' />}
        {pageToLinkBlock.iconType ==="emoji" &&<p className='relative w-5 h-5 m-0 mr-1 align-middle ml-0.5 text-lg'>{pageToLinkBlock.iconUrl}</p>}
        <div className='absolute right-[-2.3px] bottom-[-3px]'>
          <MdOutlineArrowOutward size={18} className='w-4 h-auto text-neutral-700 stroke-1 stroke-white' style={{clipPath:"inset(1px 1px 1px 1px)"}} />
        </div>
      </div>
      <span className="text-neutral-500 underline">
        {pageToLinkBlock.title}
      </span>
    </Link>
  );
  }catch(e){
    throw new Error(`error in link_to_page error: ${e}`)
  }
}
