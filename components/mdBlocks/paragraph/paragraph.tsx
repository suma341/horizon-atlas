import { searchMDKeyword } from '@/lib/mdBlockHelper';
import { MdTypeAndText } from '@/types/parent';
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
                    return <span key={index} style={text.style}>{text.text}</span>;
                })}
            </p>
        </div>
    )
}