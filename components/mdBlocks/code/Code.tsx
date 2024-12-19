import { MdBlock } from 'notion-to-md/build/types';
import React from 'react'
import { dracula,CopyBlock } from 'react-code-blocks';

type Props={
    mdBlock:MdBlock
    depth:number
}

function Code(props:Props) {
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
    if(codeBlocks[0]!=='```'){
        const language:string = codeBlocks[0].slice(3); 
        return (
            <div className='my-3 w-10/12'>
                <CopyBlock
                    text={codeContent}
                    language={language}
                    theme={dracula}
                />
            </div>
        );
    }
    return (
        <div className='my-3 w-10/12'>
            <CopyBlock
             text={codeContent}
             language='text'
             theme={dracula}
            />
        </div>
    )
}

export default Code