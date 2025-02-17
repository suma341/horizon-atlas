import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

type Props = {
    searchKeyWord: string;
};

function SearchField({ searchKeyWord }: Props) {
    const [keyWord, setKeyWord] = useState<string>(searchKeyWord);
    const [isComposing, setIsComposing] = useState<boolean>(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isComposing) return;
        if (event.key === 'Enter') {
            window.location.href = `/horizon-atlas/search?search=${keyWord}`;
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(event.target.value);
    };

    const handleButton = () => {
        window.location.href = `/horizon-atlas/search?search=${keyWord}`;
    };

    return (
        <section className="flex items-center bg-white border border-gray-300 rounded-full shadow-md px-4 py-2 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-lg">
            <input
                value={keyWord}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                type="text"
                className="w-full bg-transparent text-gray-700 focus:outline-none placeholder-gray-400"
                placeholder="キーワードで検索"
            />
            <button onClick={handleButton} className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300">
                <IoIosSearch size={22} />
            </button>
        </section>
    );
}

export default SearchField;
