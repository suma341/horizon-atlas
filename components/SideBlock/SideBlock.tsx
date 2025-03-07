"use client";
import useCurriculumIdStore from '@/stores/curriculumIdStore';
import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import { useEffect, useState } from "react";

type Props = {
    title: string;
    childPages: pageNav[];
};

const SideBlock = ({ title, childPages }: Props) => {
    const { curriculumId } = useCurriculumIdStore();
    const [scrollY, setScrollY] = useState(window.scrollY); // スクロール量を管理
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    
      useEffect(() => {
        const updateSize = () => {
          setSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
    
        window.addEventListener("resize", updateSize);
    
        return () => {
          window.removeEventListener("resize", updateSize);
        };
      }, []);

    const getPageHeight = () => {
        if (typeof window === "undefined") return 0;
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
        <section className="w-1/4 pl-4 fixed right-0" style={{top:scrollY > getPageHeight() - 720 ? `${(getPageHeight() - 720) - scrollY + 128}px` : "128px"}}>
            <div
                className="border fixed overflow-y-scroll scrollbar-thin py-4 rounded-md bg-white"
                style={{ opacity: "100", height: `${size.height / 1.75}px`, width:`${size.width / 5}px` }}
            >
                <p className="truncate text-sm px-1">{title}</p>
                <div className="pl-3">
                    {childPages.map((page, i) => (
                        <div key={i} className="p-0.5 mt-1 cursor-pointer w-48 hover:bg-neutral-100"
                        style={{width:`${size.width / 5}px`}}>
                            <Link href={`/posts/curriculums/${curriculumId}/${page.id}`} className="text-sm text-neutral-500 underline truncate">
                                <p>
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
