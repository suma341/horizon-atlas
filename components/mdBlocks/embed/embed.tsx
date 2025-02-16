import { MdBlock } from 'notion-to-md/build/types';
import React from 'react'

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

function EmbedBlock(props: Props) {
    const {mdBlock} = props;
    const match = mdBlock.parent.match(/\((.*?)\)/g);
    if(match){
        const url = match[0].slice(1, -1);
        return (
            <div className='mx-1.5 my-1.5'>
                <iframe
                    src={url}
                    style={{ width: "100%", height: "300px", border: "none" }}
                    allow="fullscreen"
                />
            </div>
        )
    }
}

export default EmbedBlock;