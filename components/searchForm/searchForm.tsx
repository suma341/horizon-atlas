import { createSearchQuery } from '@/lib/searchKeyWord';
import router from 'next/router';
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function SearchForm() {
    const [keyWord, setKeyWord] = useState<string>('');
    const [isComposing, setIsComposing] = useState<boolean>(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isComposing) {
            return;
          }

        if (event.key === 'Enter') {
          router.push(`/search?q=${createSearchQuery(keyWord)}`);
        }
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(event.target.value);
    };

    return (
        <section className="p-3 shadow-2xl mb-12">
            <div className="flex bg-white p-1 rounded-md">
                <FaSearch
                    className="ml-1 mt-0.5 text-gray-500"
                    size={25}/>
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