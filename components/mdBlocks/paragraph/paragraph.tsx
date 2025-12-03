import React from 'react';
import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { ParagraphData } from '@/types/paragraph';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';
import { renderTextWithBreaks } from '../renderTextWithBreaks';
import Image from 'next/image';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Paragraph(props:Props){
    try{
        const {mdBlock,depth} = props;
    const textData = typeAssertio<ParagraphData>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()

    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text,i) => {
                    if(text.mention && text.mention.type==="link_mention" && text.mention.content){
                        return (<span className='underline text-slate-700 hover:bg-neutral-100 inline-flex cursor-pointer pb-0.5 pt-0.5 t-1' key={`${i}`} onClick={()=>handleClick(text.href,text.scroll)}>
                            {text.mention.content.icon_url && <img src={text.mention.content.icon_url} className='w-5 h-5 m-0 t-0.5 mr-1' />}
                            <span className='text-slate-500 mr-1'>{text.mention.content.link_provider}</span>{text.mention.content.title}
                        </span>)
                    }
                    if(text.mention && text.mention.type==="prossedPage" && text.mention.content){
                        return (<span className='text-slate-700 hover:bg-neutral-100 inline-flex cursor-pointer pb-0.5 pt-0.5 t-1' key={`${i}`} onClick={()=>handleClick(text.href,text.scroll)}>
                            {(!text.mention.content.iconUrl || text.mention.content.iconUrl==="") &&<Image src={"/horizon-atlas/file_icon.svg"} alt={text.mention.content.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1 t-1' />}
                            {text.mention.content.iconType !=="emoji" && text.mention.content.iconType !=="custom_emoji" && <Image src={text.mention.content.iconUrl} alt={text.mention.content.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1 t-1' />}
                            {text.mention.content.iconType ==="custom_emoji" && <img src={text.mention.content.iconUrl} alt={text.mention.content.title} width={20} height={20} className='relative w-5 h-5 m-0 mr-1 t-1' />}
                            {text.mention.content.iconType ==="emoji" &&<span className='relative w-5 h-5 m-0 mr-1 align-middle ml-0.5 text-lg no-underline'>{text.mention.content.iconUrl}</span>}
                            <MdOutlineArrowOutward size={18} className='absolute w-4 h-auto text-neutral-700 right-[-2.3px] bottom-[-3px] stroke-1 stroke-white' style={{clipPath:"inset(1px 1px 1px 1px)"}} />
                            <span className='underline'>{text.mention.content.title}</span>
                        </span>)
                    }
                    const style = assignCss(text);
                    return renderTextWithBreaks(text.plain_text,style,()=>handleClick(text.href,text.scroll))
                })}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>{
                return (<div key={i} className='ml-2'>
                    <MdBlockComponent mdBlock={child} depth={depth + 1} />
                </div>)
            })}
        </div>
    )
    }catch(e){
        throw new Error(`error in Paragraph error: ${e}`)
    }
}