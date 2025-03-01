// import { tagStyle } from '@/styles/tag/tagStyle';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Props = {
    allTags: string[];
};

function Tags({ allTags }: Props) {
    const [visible, setVisible] = useState<boolean>(false);
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
      if(window!==undefined){
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
      }
    }, []);

    return (
        <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-lg">
            <div className="font-semibold text-gray-800 mb-4 text-lg">タグ検索</div>
            <div className="flex flex-wrap gap-2">
                {(visible ? allTags : allTags.slice(0, Math.trunc(windowWidth / 100))).map((tag, i) => (
                    <Link key={i} href={`/posts/tag/${tag}`}>
                        <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full cursor-pointer hover:bg-gray-200 transition-all">
                            {tag}
                        </span>
                    </Link>
                ))}
            </div>
            {allTags.length > Math.trunc(windowWidth / 100) && (
                <div className="mt-3 flex justify-end">
                    <button
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-all"
                        onClick={() => setVisible(!visible)}
                    >
                        {visible ? "view less" : "view more..."}
                    </button>
                </div>
            )}
        </section>
    );
}

export default Tags;
