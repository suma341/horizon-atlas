import { createSearchQuery, searchByKeyWord } from '@/lib/searchKeyWord';
import { PostMetaData } from '@/types/postMetaData';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';

type Props={
    allPosts:PostMetaData[];
    setMatchPosts: Dispatch<SetStateAction<PostMetaData[]>>;
}

export default function SearchForm({allPosts,setMatchPosts}:Props) {
    const [keyWord, setKeyWord] = useState<string>('');
    const [isComposing, setIsComposing] = useState<boolean>(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isComposing) {
            return;
          }

        if (event.key === 'Enter') {
          const result = searchByKeyWord(createSearchQuery(keyWord), allPosts);
          setMatchPosts(result);
        }
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(event.target.value);
    };

    return (
        <section className="p-3 shadow-2xl mb-12">
            <div className="flex bg-white rounded-md">
            <Image src="/magnifying_glass.png" alt='magnifying_glass' height={20} width={20} className='w-auto h-6' />
                <input
                    value={keyWord}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    type="text"
                    className="rounded mx-4 w-full bg-neutral-100 p-1 focus:outline-none focus:bg-slate-100 duration-300"
                    placeholder="キーワードで検索"/>
            </div>
        </section>
    )
}