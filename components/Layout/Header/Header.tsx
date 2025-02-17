import Link from 'next/link';
import React from 'react'
import SearchField from './searchField/searchField';
import HamburgerButton from './hamburgerButton./hamburgerButton';

type Props={
    searchKeyWord?:string;
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({searchKeyWord,setOpenbar}:Props){
    
  return (
    <header className='w-full pb-1 bg-white'>
        <div className=" text-white px-5 mb-0 flex justify-between items-center">
            <Link href="/posts" className="text-2xl font-semibold text-gray-700 hover:text-blue-500 transition-colors">
                HorizonAtlas
            </Link>
            <ul className="hidden md:flex items-center text-sm pt-2 duration-100">
                <li className="mr-4">
                    <SearchField searchKeyWord={searchKeyWord || ''} />
                </li>
            </ul>
            <ul className='flex md:hidden items-center text-sm pt-2'>
                <li>
                    <HamburgerButton setOpenSide={setOpenbar} />
                </li>
            </ul>
        </div>
    </header>
  )
}
