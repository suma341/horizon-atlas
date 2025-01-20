import React, { useState } from 'react'
import {IoIosSearch} from 'react-icons/io'
import router from 'next/router'

type Props={
    searchKeyWord:string;
}

function SearchField({searchKeyWord}:Props) {
    const [keyWord, setKeyWord] = useState<string>(searchKeyWord);
    const [isComposing, setIsComposing] = useState<boolean>(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isComposing) {
            return;
          }
        if (event.key === 'Enter') {
          router.push({pathname:"/search", query:{search:keyWord}});
        }
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(event.target.value);
    };

    return (
        <section className="mt-2">
            <div className="flex bg-white rounded-md">
            <IoIosSearch size={25} className='text-neutral-500' />
                <input
                    value={keyWord}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    type="text"
                    className="rounded mx-4 text-neutral-600 bg-neutral-100 px-2 focus:outline-none focus:bg-slate-100 duration-300"
                    placeholder="キーワードで検索"/>
            </div>
        </section>
    )
}

export default SearchField;