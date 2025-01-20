import UserIcon from '@/components/Layout/Header/UserIcon/userIcon';
import Link from 'next/link';
import React from 'react'
import SearchField from './searchField/searchField';

type Props={
    searchKeyWord?:string;
}

export default function Header({searchKeyWord}:Props){
    
  return (
    <header className='w-full'>
        <div className=" bg-white text-white px-5 flex justify-between items-center">
            <Link href="/posts" className="text-2xl font-medium text-neutral-400 rounded-md">
                HorizonAtlas
            </Link>
            <ul className="flex items-center text-sm py-2">
                <li className="mr-4">
                    <SearchField searchKeyWord={searchKeyWord || ''} />
                </li>
                <li>
                    <UserIcon />
                </li>
            </ul>
        </div>
    </header>
  )
}
