import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

type Props = {
    searchKeyWord?: string;
};

function SearchField({ searchKeyWord }: Props) {
    const [keyWord, setKeyWord] = useState<string>(searchKeyWord || "");
    const [isComposing, setIsComposing] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const router = useRouter();

    const handleSearch = () => {
        if (!keyWord.trim()) {
            setErrorMessage("入力してください");
            return;
        }
        setErrorMessage("");
        router.push({ pathname: "/search", query: { search: keyWord } });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isComposing && event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section>
            <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-lg px-4 py-2 focus-within:border-blue-500 focus-within:shadow-xl transition-all">
                <input
                    value={keyWord}
                    onChange={(e) => {
                        setKeyWord(e.target.value);
                        setErrorMessage(""); // 入力があればエラーメッセージをクリア
                    }}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    type="text"
                    className="w-full bg-transparent text-gray-700 focus:outline-none placeholder-gray-400"
                    placeholder="キーワードで検索"
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                >
                    <IoIosSearch size={22} />
                </button>
            </div>
            {errorMessage && (
                <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            )}
        </section>
    );
}

export default SearchField;
