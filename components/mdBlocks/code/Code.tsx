import React, { useState } from 'react';
import { LuCopy } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { assignCss } from '@/lib/assignCssProperties';
import { CodeBlock } from '@/types/code';
import { usePageLink } from '@/hooks/usePagePush';
import { MdBlock } from '@/types/MdBlock';
import { typeAssertio } from '@/lib/typeAssertion';
import * as CB from './codeBlock';

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

export default function Code(props: Props) {
    try{
        const { mdBlock } = props;
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { handleClick } = usePageLink()

    const codeOb = typeAssertio<CodeBlock>(mdBlock.parent as Record<string, string | number | boolean>, mdBlock.type)
    const codeContent = Array.isArray(codeOb) ? codeOb.parent.map((t)=>{
        return t.plain_text
    }).join("").replace(/\n$/, '').replace(/\t/g, '  ') : ""

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
            
            <CB.default parents={codeOb.parent} language={codeOb.language} />
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
    }catch(e){
        throw new Error(`error in code error: ${e}`)
    }
}