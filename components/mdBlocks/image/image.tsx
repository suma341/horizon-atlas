"use client";
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';

type Props = {
    mdBlock: MdBlock;
    depth: number;
    slug: string;
};

export default function ImageBlock(props: Props) {
    const { mdBlock, slug } = props;
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false); // モーダルの開閉状態

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

        (async () => {
            await checkImageExists("png");
            if (!imageSrc) {
                await checkImageExists("jpg");
            }
        })();
    }, [mdBlock.blockId]);

    if (!imageSrc) return null;

    return (
        <>
            <div id={mdBlock.blockId}>
                <img
                    height={200}
                    width={200}
                    src={imageSrc}
                    alt={'image_block'}
                    style={{
                        width: 'auto',
                        height: '100%',
                        display: 'block',
                        maxHeight: '200px',
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsOpen(true)} 
                />
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                    onClick={() => setIsOpen(false)} 
                >
                    <div
                        className="relative bg-white p-2 rounded-lg"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div
                            className="overflow-auto"
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                touchAction: 'none', 
                            }}
                        >
                            <img
                                src={imageSrc}
                                alt="image_block_large"
                                style={{
                                    width: '80vw',
                                    height: 'auto',
                                }}
                            />
                            
                        </div>
                        <button
                            className="flex absolute top-3 right-5 text-white text-2xl bg-slate-50 rounded-full px-0.5 border border-black"
                            onClick={() => setIsOpen(false)}
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
