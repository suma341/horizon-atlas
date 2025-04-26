"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';
import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { ParagraphData } from '@/types/paragraph';
import { assignCss } from '@/lib/assignCssProperties';
import { useRouter } from 'next/router';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Paragraph(props:Props){
    const {mdBlock,depth} = props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

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
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text)=>{
                    const style = assignCss(text)
                    return text.plain_text.split("\n").map((line,index)=>{
                        return (<>
                            <span key={index} style={style} onClick={()=>handleClick(text.href,text.scroll)}>{line}</span>
                            {text.plain_text.split("\n")[1] && <br />}
                        </>)
                    })})}
                {textData.parent.length===0 && <span className='opacity-0' >a</span>}
            </p>
            {mdBlock.children.map((child,i)=>{
                return (<div key={i} className='ml-2'>
                    <MdBlockComponent mdBlock={child} depth={depth + 1} />
                </div>)
            })}
        </div>
    )
}