"use client";
import { assignCss } from '@/lib/assignCssProperties';
import { Parent } from '@/types/Parent';
import { useRouter } from 'next/router';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import { FaExpandAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

type ImageData ={
    parent:Parent[];
    url:string;
}

function useImageSize(imageUrl: string) {
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  
    useEffect(() => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setSize({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
    }, [imageUrl]);
  
    return size;
  }

export default function ImageBlock(props: Props) {
    const { mdBlock } = props;
    const [isOpen, setIsOpen] = useState(false); 
    const [isHovered, setIsHovered] = useState(false);
    const data:ImageData = JSON.parse(mdBlock.parent)

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

    const size = useImageSize(data.url)

    return (
        <>
            <div id={mdBlock.blockId} className="relative flex-col items-center flex container"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}>
                {(size && size.height > size.width) && <img
                    src={data.url}
                    alt={'image_block'}
                    style={{
                        width: 'auto',
                        height: 'auto',
                        display: 'block',
                        maxHeight: "750px",
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsOpen(true)} 
                />}
                {(!size || (size && size.width > size.height)) && <img
                src={data.url}
                alt={'image_block'}
                style={ {
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                    maxHeight:"450px",
                    cursor: 'pointer',
                }}
                onClick={() => setIsOpen(true)} 
                />}
                
                <button
                    onClick={() => setIsOpen(true)}
                    className="absolute top-1 right-1 bg-neutral-800 bg-opacity-60 text-white hover:bg-opacity-100 p-1 rounded-md shadow-md border border-gray-300"
                    style={{ backdropFilter: 'blur(5px)',opacity:isHovered ? "100%" : "0%" }}
                >
                    <FaExpandAlt size={17} />
                </button>
                <p className='text-sm m-0 text-neutral-600' style={{width: "fit-content", textAlign: "left"}}>
                    {data.parent.map((text)=>{
                        const style = assignCss(text)
                        return text.plain_text.split("\n").map((line,index)=>{
                            return (<>
                                <span key={index} style={style} onClick={()=>handleClick(text.href,text.scroll)}>{line}</span>
                                {text.plain_text.split("\n")[1] && <br />}
                            </>)
                        })})}
                    {data.parent.length===0 && <span className='opacity-0' >a</span>}
                </p>
            </div>


            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                    onClick={() => setIsOpen(false)} 
                >
                    <div
                        className="relative bg-white p-2 rounded-lg"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div
                            className="overflow-auto"
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                touchAction: 'none', 
                            }}
                        >
                            {(!size || (size && size.width > size.height)) && <img
                                src={data.url}
                                alt="image_block_large"
                                style={{
                                    width: '80vw',
                                    height: 'auto'
                                }}
                            />}
                            {(size && size.height > size.width) && <img
                                src={data.url}
                                alt="image_block_large"
                                style={{
                                    width: "auto",
                                    height: "90vh"
                                }}
                            />}
                            
                        </div>
                    </div>
                    <button
                        className="flex absolute top-5 right-7 text-white rounded-md px-0.5"
                        onClick={() => setIsOpen(false)}
                    >
                        <RxCross2 size={25} />
                    </button>
                </div>
            )}
        </>
    );
}
