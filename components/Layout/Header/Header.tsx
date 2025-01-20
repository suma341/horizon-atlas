import UserIcon from '@/components/Layout/Header/UserIcon/userIcon';
import Link from 'next/link';
import React from 'react'
import SearchField from './searchField/searchField';

type Props={
    searchKeyWord?:string;
}

export default function Header({searchKeyWord}:Props){
    
  return (
    <header className='w-full mb-1 bg-white'>
        <div className=" text-white px-5 mb-0 flex justify-between items-center">
            <Link href="/posts" className="text-2xl mb-0 font-medium text-neutral-400 rounded-md">
                HorizonAtlas
            </Link>
            <ul className="flex items-center text-sm pt-2">
                <li className="hidden sm:block mr-4">
                    <SearchField searchKeyWord={searchKeyWord || ''} />
                </li>
                <li>
                    <UserIcon />
                </li>
            </ul>
        </div>
        <div className='block sm:hidden mt-0 px-5 w-full'>
            <SearchField searchKeyWord={searchKeyWord || ''} />
        </div>
    </header>
  )
}
