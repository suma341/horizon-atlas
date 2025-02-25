import Link from 'next/link';
import React from 'react'
import HamburgerButton from './hamburgerButton./hamburgerButton';
import UserIcon from './UserInfo/userIcon';
import SearchIcon from './searchIcon/searchIcon';
import { RoleData } from '@/types/role';
import Image from 'next/image';

type Props={
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
    roleData:RoleData;
}

export default function Header({setOpenbar,roleData}:Props){
    
  return (
    <header className='w-full bg-white'>
        <div className=" text-white px-5 mb-0 flex justify-between items-center">
            <Link href="/posts">
                <Image src={'/horizon-atlas/logo_.png'} alt={''} width={32} height={16} className='w-32 h-auto absolute top-[-30%] left-0' />
            </Link>
            <ul className="hidden md:flex items-center pt-2 text-sm duration-100">
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
