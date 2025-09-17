"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React, { useState } from 'react';
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/default-highlight';
import { LuCopy } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { assignCss } from '@/lib/assignCssProperties';
import { CodeBlock } from '@/types/code';
import { usePageLink } from '@/hooks/usePagePush';

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

export default function Code(props: Props) {
    const { mdBlock } = props;
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { handleClick } = usePageLink()

    const codeOb:CodeBlock = JSON.parse(mdBlock.parent)
    let codeContent = codeOb.parent.join("").replace(/\n$/, '')
    codeContent = codeContent.replace(/\t/g, '  ');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div 
            id={mdBlock.blockId} 
            className='mb-2 mt-2 relative' 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className='mb-0' style={{backgroundColor:"rgb(250,250,250)"}}>
                <p>
                    <span className='text-neutral-600 text-sm px-3 py-1 rounded' style={{background: "rgb(235, 235, 235)"}}>
                        {codeOb.language}
                    </span>
                </p>
                <button
                    onClick={handleCopy}
                    className={`h-5 absolute top-1 right-2 px-2 text-sm rounded transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    {copied ? <span className='text-purple-500 flex'>copied ! <FaCheck size={24} /></span> : <LuCopy size={24} className='text-neutral-400 hover:text-neutral-500' />}
                </button>
            </div>
            
            <SyntaxHighlighter style={atomOneLight} language={codeOb.language}>
                {codeContent}
            </SyntaxHighlighter>
            <p className='text-sm m-0 text-neutral-600' style={{width: "fit-content", textAlign: "left"}}>
                {codeOb.caption.map((text)=>{
                    const style = assignCss(text)
                    return text.plain_text.split("\n").map((line,index)=>{
                        return (<>
                            <span key={index} style={style} onClick={()=>handleClick(text.href,text.scroll)}>{line}</span>
                            {text.plain_text.split("\n")[1] && <br />}
                        </>)
                    })})}
                {codeOb.caption.length===0 && <span className='opacity-0' >a</span>}
            </p>
        </div>
    );

    // const codeBlocks: string[] = mdBlock.parent.split('\n');

    // let codeContent = '';
    // for (let i = 1; i < codeBlocks.length - 1; i++) {
    //     codeContent += (i === 1 ? '' : '\n') + codeBlocks[i];
    // }
    // codeContent = codeContent.replace(/\t/g, '  ');
    // const language: string = codeBlocks[0].slice(3);

    // const handleCopy = async () => {
    //     try {
    //         await navigator.clipboard.writeText(codeContent);
    //         setCopied(true);
    //         setTimeout(() => setCopied(false), 2000);
    //     } catch (error) {
    //         console.error('Failed to copy:', error);
    //     }
    // };

    // const inputData:MdTypeAndText = {
    //     text: codeContent,
    //     type: [],
    //     link:[]
    // }
    // const md = parseMarkdown(inputData,true)

    // return (
    //     <div 
    //         id={mdBlock.blockId} 
    //         className='mb-2 mt-2 relative' 
    //         onMouseEnter={() => setIsHovered(true)} 
    //         onMouseLeave={() => setIsHovered(false)}
    //     >
    //         <div className='mb-0' style={{backgroundColor:"rgb(250,250,250)"}}>
    //             <p>
    //                 <span className='text-neutral-600 text-sm px-3 py-1 rounded' style={{background: "rgb(235, 235, 235)"}}>
    //                     {language}
    //                 </span>
    //             </p>
    //             <button
    //                 onClick={handleCopy}
    //                 className={`h-5 absolute top-1 right-2 px-2 text-sm rounded transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
    //             >
    //                 {copied ? <span className='text-purple-500 flex'>copied ! <FaCheck size={24} /></span> : <LuCopy size={24} className='text-neutral-400 hover:text-neutral-500' />}
    //             </button>
    //         </div>
    //         {language==="markdown" && <div className='p-2' style={{backgroundColor:"rgb(250,250,250)"}}>
    //             {md.map((text,i)=>{
    //                 const style = assignCssProperties(text);
    //                 return (<p key={i} style={style}>{text.text}</p>)
    //             })}
    //         </div>}
            
    //         {language !=="markdown" && <SyntaxHighlighter style={atomOneLight} language={language}>
    //             {codeContent.replace(/\n$/, '')}
    //         </SyntaxHighlighter>}
    //     </div>
    // );
}
