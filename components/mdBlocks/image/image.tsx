"use client";
import useCurriculumIdStore from '@/stores/curriculumIdStore';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';
import { FaExpandAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

type Props = {
    mdBlock: MdBlock;
    depth: number;
};

export default function ImageBlock(props: Props) {
    const { mdBlock } = props;
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false); 
    const [isHovered, setIsHovered] = useState(false);
    const { curriculumId } = useCurriculumIdStore();

    useEffect(() => {
        const checkImageExists = async (extension: string) => {
            const url = `/horizon-atlas/notion_data/eachPage/${curriculumId}/image/${mdBlock.blockId}.${extension}`;
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
                if(!imageSrc){
                    await checkImageExists("gif");
                }
            }
        })();
    }, [mdBlock.blockId]);

    if (!imageSrc) return null;

    return (
        <>
            <div id={mdBlock.blockId} className="relative"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}>
                <img
                    height={200}
                    width={200}
                    src={imageSrc}
                    alt={'image_block'}
                    style={{
                        width: 'auto',
                        height: '100%',
                        display: 'block',
                        maxHeight: '350px',
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsOpen(true)} 
                />
                
                {/* 拡大ボタン */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="absolute top-1 right-1 bg-neutral-800 bg-opacity-60 text-white hover:bg-opacity-100 p-1 rounded-md shadow-md border border-gray-300"
                    style={{ backdropFilter: 'blur(5px)',opacity:isHovered ? "100%" : "0%" }}
                >
                    <FaExpandAlt size={17} />
                </button>
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
                                    height: 'auto'
                                }}
                            />
                            
                        </div>
                    </div>
                    <button
                        className="flex absolute top-5 right-7 text-white rounded-md px-0.5"
                        onClick={() => setIsOpen(false)}
                    >
                        <RxCross2 size={25} />
                    </button>
                </div>
            )}
        </>
    );
}
