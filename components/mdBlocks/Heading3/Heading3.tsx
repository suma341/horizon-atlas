"use client";
import { assignCss } from '@/lib/assignCssProperties';
import { MdBlock } from 'notion-to-md/build/types'
import React, { useState } from 'react'
import MdBlockComponent from '../mdBlock';
import { HeadingData } from '@/types/headingData';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { useRouter } from 'next/router';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Heading3(props:Props) {
    const {mdBlock,depth} = props;
    const [isOpen, setIsOpen] = useState(false);
    const data:HeadingData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(data.color);

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
        <div id={mdBlock.blockId}>
            {mdBlock.children.length===0 && <h3 className='my-2 mt-4 font-bold text-xl' style={colorProperty}>
                {data.parent.map((text,i)=>{
                    const style = assignCss(text)
                    return (<span style={style} key={i} onClick={()=>handleClick(text.href,text.scroll)}>{text.plain_text}</span>)
                })}
            </h3>}
            {mdBlock.children.length !==0 && <div className='flex'>
                <button
                    className="text-left text-xl space-x-1 p-1 rounded-lg hover:bg-neutral-200 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "▼" : "▶︎"}
                </button>
                <h3 className='my-2 mt-4 font-bold text-xl' style={colorProperty}>
                    {data.parent.map((text,i)=>{
                        const style = assignCss(text)
                        return (<span style={style} key={i} onClick={()=>handleClick(text.href,text.scroll)}>{text.plain_text}</span>)
                    })}  
                </h3>
            </div>}
            {isOpen && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
            {!data.is_toggleable && mdBlock.children.map((child,i)=>(
                <MdBlockComponent key={i} mdBlock={child} depth={depth + 1} />
            ))}
        </div>
    )
}
