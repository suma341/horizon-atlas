import { searchMDKeyword } from '@/lib/mdBlockHelper';
import { MdTypeAndText } from '@/types/mdTypeAndText';
import { MdBlock } from 'notion-to-md/build/types'
import React from 'react'

type Props={
    mdBlock:MdBlock
}

export default function Paragraph(props:Props){
    const {mdBlock} = props;
    const mdTypeAndTextList:MdTypeAndText[] = searchMDKeyword(mdBlock.parent);
    console.log(mdBlock);

    return (
        <div>
            <p>{mdTypeAndTextList.map((text)=>{
                if(text.type === "normal"){
                    return (<span>{text.text}</span>);
                }else if(text.type === "bold"){
                    return (<span className='font-bold'>{text.text}</span>)
                }else if(text.type==="italic"){
                    return (<span className='italic'>{text.text}</span>)
                }else if(text.type==="code"){
                    return (<span className='bg-neutral-300 text-rose-500'>{text.text}</span>)
                }else if(text.type==="underline"){
                    return (<span className='underline'>{text.text}</span>)
                }else if(text.type==="link"){
                    return (<span className='text-neutral-500 underline'>{text.text}</span>)
                }
            })}</p>
        </div>
    )
}
