import { MdBlock } from 'notion-to-md/build/types';
import React from 'react'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/default-highlight';

type Props={
    mdBlock:MdBlock
    depth:number
}

export default function Code(props:Props) {
    const {mdBlock} = props;
    const codeBlocks:string[] = mdBlock.parent.split('\n');
    let codeContent = "";
    for(let i=1;i<codeBlocks.length - 1;i++){
        if(i===1){
            codeContent = codeContent + codeBlocks[i];
        }else{
            codeContent = codeContent + '\n' + codeBlocks[i];
        }
    }
    const language:string = codeBlocks[0].slice(3); 
    return (
        <div className='my-3'>
            <SyntaxHighlighter style={dracula} language={language}>
                {String(codeContent).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    );
}
