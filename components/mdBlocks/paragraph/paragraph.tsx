import { searchMDKeyword } from '@/lib/mdBlockHelper';
import { MdTypeAndText } from '@/types/parent';
import Link from 'next/link';
import React from 'react'

type Props={
    parent:string
    depth:number
}

export default function Paragraph(props:Props){
    const {parent} = props;
    const mdTypeAndTextList:MdTypeAndText[] = searchMDKeyword(parent);

    return (
        <div>
            <p>
                {mdTypeAndTextList.map((text, index) => {
                    return text.link === undefined ? ( 
                    <span key={index} style={text.style}>
                        {text.text}
                    </span>) : (
                    <span key={index} style={text.style}>
                        <Link href={text.link}>{text.text}</Link>
                    </span>)
                })}
            </p>
        </div>
    )
}