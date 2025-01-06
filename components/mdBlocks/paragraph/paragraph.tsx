import { searchMDKeyword } from '@/lib/mdBlockHelper';
import { MdTypeAndText } from '@/types/parent';
import Link from 'next/link';
import React from 'react';

type Props={
    parent:string;
    depth:number;
}

export default function Paragraph(props:Props){
    const {parent} = props;
    const mdTypeAndTextList:MdTypeAndText[] = searchMDKeyword(parent);

    return (
        <div className='mt-1.5 w-11/12'>
            <p>
                {mdTypeAndTextList.map((text, index) => {
                    if(text.link === undefined){
                        return ( 
                            <span key={index} style={text.style}>
                                {text.text}
                            </span>)
                    }else{
                        if(text.link.slice(0,8)==='https://'){
                            return (<span key={index} style={text.style}>
                                <Link href={text.link} className='text-neutral-500 underline cursor-pointer hover:text-neutral-800'>{text.text}</Link>
                            </span>)
                        }else{
                            return (<span key={index} style={text.style}>
                                <span className='text-neutral-500 underline'>{text.text}</span>
                            </span>)
                        }
                    }
                })}
            </p>
        </div>
    )
}