"use client";
import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import { useEffect, useState } from "react";

type Props = {
    title: string;
    slug: string;
    childPages: pageNav[];
};

const SideBlock = ({ title, childPages, slug }: Props) => {
    const [scrollY, setScrollY] = useState(0); // スクロール量を管理

    const getPageHeight = () => {
        if (typeof window === "undefined") return 0; // サーバーサイドで実行されないようにする
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleScroll = () => {
            const newScrollY = window.scrollY;
            setScrollY(newScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // 初回実行（リロード時などの考慮）

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []); // 依存配列を空にして、マウント時のみ実行

    return (
        <section className="w-52 mr-2 fixed right-0" style={{top:scrollY > getPageHeight() - 1000 ? `${(getPageHeight() - 1000) - scrollY + 128}px` : "128px"}}>
            <div
                className="border fixed overflow-y-scroll scrollbar-thin py-4 rounded-md w-52 bg-white"
                style={{ opacity: "100", height: "400px" }}
            >
                <p className="truncate text-sm px-1">{title}</p>
                <div className="pl-4">
                    {childPages.map((page, i) => (
                        <div key={i} className="p-0.5 mt-1 cursor-pointer w-52 hover:bg-neutral-100">
                            <Link href={`/posts/post/${slug}/${page.id}`} className="text-sm text-neutral-500 underline truncate">
                                <p >
                                    {page.title}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SideBlock;
