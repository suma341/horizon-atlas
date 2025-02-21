import Link from 'next/link';
import React from 'react'
import HamburgerButton from './hamburgerButton./hamburgerButton';
import UserIcon from './UserInfo/userIcon';
import SearchIcon from './searchIcon/searchIcon';
import { RoleData } from '@/types/role';

type Props={
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
    roleData:RoleData;
}

export default function Header({setOpenbar,roleData}:Props){
    
  return (
    <header className='w-full pb-1 bg-white'>
        <div className=" text-white px-5 mb-0 flex justify-between items-center">
            <Link href="/posts" className="text-2xl font-semibold text-gray-700 hover:text-blue-500 transition-colors">
                HorizonAtlas
            </Link>
            <ul className="hidden md:flex items-center text-sm pt-2 duration-100">
                <li className="mr-4">
                    <SearchIcon />
                </li>
                <li>
                    <UserIcon roleData={roleData} />
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
