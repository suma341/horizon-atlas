"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';
import MdBlockComponent from '../mdBlock';
import { getColorProperty } from '@/lib/backgroundCorlor';
import { ParagraphData } from '@/types/paragraph';
import { assignCss } from '@/lib/assignCssProperties';
import { usePageLink } from '@/hooks/usePagePush';

type Props={
    mdBlock:MdBlock;
    depth:number;
}

export default function Paragraph(props:Props){
    const {mdBlock,depth} = props;
    const textData:ParagraphData = JSON.parse(mdBlock.parent)
    const colorProperty = getColorProperty(textData.color);

    const { handleClick } = usePageLink()

    return (
        <div className='mb-0.5 mt-1' id={mdBlock.blockId}>
            <p style={colorProperty}>
                {textData.parent.map((text, i) => {
                    const style = assignCss(text);
                    const lines:string[] = [""]
                    let f = 0;
                    for(const char of text.plain_text){
                        if(char==="\n"){
                            f++;
                            lines[f] = char;
                            f++;
                        }else{  
                            lines[f] = lines[f] + char;
                        }
                    }
                    const filteredlines = lines.filter((item)=>item!=="");
                    return filteredlines.map((line, index) => {
                        if(line==="\n"){
                            return <React.Fragment key={`${mdBlock.blockId}-${i}-${index}`}><br /></React.Fragment>
                        }
                        return (
                        <React.Fragment key={`${mdBlock.blockId}-${i}-${index}`}>
                            <span style={style} onClick={() => handleClick(text.href, text.scroll)}>
                                {line}
                            </span>
                        </React.Fragment>
                    )});
                })}
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

// function renderTextWithBreaks(text: string, style: React.CSSProperties, onClick?: () => void) {
//     const elements: React.ReactNode[] = [];
//     let lastIndex = 0;
//     const matches = [...text.matchAll(/\n/g)];
  
//     matches.forEach((match, i) => {
//       const index = match.index!;
//       elements.push(
//         <span key={`line-${i}`} style={style} onClick={onClick}>
//           {text.slice(lastIndex, index)}
//         </span>
//       );
//       elements.push(<br key={`br-${i}`} />);
//       lastIndex = index + 1;
//     });
  
//     // 残りのテキストを追加
//     if (lastIndex < text.length) {
//       elements.push(
//         <span key={`line-final`} style={style} onClick={onClick}>
//           {text.slice(lastIndex)}
//         </span>
//       );
//     }
  
//     return elements;
//   }
  