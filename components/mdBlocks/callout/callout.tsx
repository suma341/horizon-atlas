"use client";
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'
import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import Image from 'next/image';
import { CalloutData } from '@/types/callout';
import { assignCss } from '@/lib/assignCssProperties';
import { useRouter } from 'next/router';

type Props={
    mdBlock:MdBlock
    depth:number;
}

export default function Callout(props:Props) {
    const {mdBlock,depth} = props;
    const data:CalloutData = JSON.parse(mdBlock.parent)
    const icon = data.icon
    const backgroundColor = getColorProperty(data.color)

    const router = useRouter()

    const scrollToSection = (targetId: string) => {
        const element = document.getElementById(targetId);
        if (element) {
            const yOffset = -100; 
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
        element?.classList.add("highlight")
        setTimeout(()=>{
            element?.classList.remove("highlight");
        },1600)
    };

    const handleClick =(href:string | null, scroll:string | undefined)=>{
        if(href && href!==""){
            if(router.asPath===href){
                if(scroll){
                    scrollToSection(scroll)
                }
            }else{
                if(scroll){
                    router.push(`${href}#${scroll}`)
                }else{
                    router.push(href)
                }
            }
        }
    }

    return (
        <div className='p-2 px-3 mb-3 mt-4 rounded relative' id={mdBlock.blockId} style={data.color==="default_background" ? {...backgroundColor,border:"solid rgb(212 212 212) 1px"} : {...backgroundColor}}>
            <div className='absolute top-2 left-2'>
                {icon && icon.type==="emoji" && <p className='text-xl relative left-1'>{icon.emoji}</p>}
                {icon && icon.type!=="emoji" && icon.external && <Image src={icon.external.url} alt={''} width={20} height={20} className='w-5 h-5 m-0.5 top-0.5' />}
            </div>
            <div className='ml-6'>
                <p>
                    {data.parent.map((text,i)=>{
                        const style = assignCss(text)
                        return (<span style={style} key={i} onClick={()=>handleClick(text.href,text.scroll)}>{text.plain_text}</span>)
                    })}
                </p>
                {mdBlock.children.map((child, i)=>(
                    <div className='ml-2 mt-0.5' key={i}>
                        <MdBlockComponent mdBlock={child} depth={depth +1} />
                    </div>
                ))}
            </div>
        </div>
    )
}
