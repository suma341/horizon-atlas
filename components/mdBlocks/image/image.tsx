"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type Props = {
    mdBlock: MdBlock;
    depth: number;
    slug:string;
};

export default function ImageBlock(props: Props) {
    const { mdBlock,slug } = props;
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const checkImageExists = async (extension: string) => {
            const url = `/horizon-atlas/notion_data/eachPage/${slug}/image/${mdBlock.blockId}.${extension}`;
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    setImageSrc(url);
                }
            } catch (error) {
                console.error(`画像の取得に失敗: ${url}`, error);
            }
        };

        // PNG を試し、失敗したら JPG を試す
        (async () => {
            await checkImageExists("png");
            if (!imageSrc) {
                await checkImageExists("jpg");
            }
        })();
    }, [mdBlock.blockId]);

    if (!imageSrc) return null; // 画像が見つからない場合は何も表示しない

    return (
        <div id={mdBlock.blockId}>
            <Image
                height={400}
                width={400}
                src={imageSrc}
                alt={'image_block'}
                style={{
                    width: 'auto',
                    height: '100%',
                    display: 'block',
                    maxHeight: '400px',
                }}
            />
        </div>
    );
}
