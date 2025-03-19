import { assignCssProperties } from '@/lib/assignCssProperties';
import { MdTypeAndText } from '@/types/textAndType';
import React from 'react'

type Props={
    mdTypeAndTextList: MdTypeAndText[];
}

const handleClick=(url:string)=>{
    if(window!==undefined){
        window.open(url, "_blank");
    }
}

function TextBlock({mdTypeAndTextList}:Props) {
  return (
    <p className='my-2 py-0.5'>
        {mdTypeAndTextList.map((text, index) => {
            const style = assignCssProperties(text);
            if(text.link.length === 0){
                if(text.text===""){
                    return <span key={index} className='opacity-0'>a</span>
                }
                return (<span key={index} style={style}>{text.text}</span>)
            }else{
                if(text.link[0]===''){
                    return (<span key={index} style={style} className='text-neutral-500 underline'>
                        {text.text}
                    </span>)
                }else{
                    return (<span onClick={()=>handleClick(text.link[0])} key={index} style={style} className='text-neutral-500 underline cursor-pointer hover:text-neutral-800'>
                        {text.text}
                    </span>)
                }
            }
        })}  
    </p>
  )
}

export default TextBlock