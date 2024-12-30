import { MdBlock } from 'notion-to-md/build/types';
import React, { useState } from 'react';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
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
        <div className='mb-2 mt-4 relative'>
            <button
                onClick={handleCopy}
                className={`absolute top-2 right-2 px-2 py-1 text-sm rounded ${
                    copied ? 'bg-neutral-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <SyntaxHighlighter style={dracula} language={language}>
                {String(codeContent).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    );
}
