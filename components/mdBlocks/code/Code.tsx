import { MdBlock } from 'notion-to-md/build/types';
import React, { useState } from 'react';
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/default-highlight';

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

export default function Code(props: Props) {
    const { mdBlock } = props;
    const codeBlocks: string[] = mdBlock.parent.split('\n');
    let codeContent = '';
    for (let i = 1; i < codeBlocks.length - 1; i++) {
        codeContent += (i === 1 ? '' : '\n') + codeBlocks[i];
    }
    const language: string = codeBlocks[0].slice(3);

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // コピー状態を2秒後にリセット
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div className='mb-2 mt-4 relative w-11/12'>
            <div className='mb-0' style={{background: "rgb(245, 245, 245)"}}>
                <p className='text-neutral-400 px-2 text-base py-1'>{language}</p>
                <button
                    onClick={handleCopy}
                    className={'absolute top-0.5 right-2 px-2 py-1 text-sm rounded bg-gray-100 text-gray-500 '}
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            
            <SyntaxHighlighter style={atomOneLight} language={language}>
                {String(codeContent).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    );
}
