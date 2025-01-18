import UserIcon from '@/components/Layout/Header/UserIcon/userIcon';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image';
import Navbar from './Navbar/navbar';
import { pageNav } from '@/types/pageNav';

type Props={
    pageNavs:pageNav[];
    setOpenSide: Dispatch<SetStateAction<boolean>>;
}

export default function Header({pageNavs,setOpenSide}:Props){
  return (
    <header className='fixed z-50 w-full top-0'>
        <div className=" bg-white text-white px-5 flex justify-between items-center">
            <Link href="/posts" className="text-2xl font-medium text-neutral-400 rounded-md">
                HorizonAtlas
            </Link>
            <ul className="flex items-center text-sm py-2">
                <li className="mr-4">
                    <button className="p-2 bg-slate-50 hover:bg-gray-100 rounded-full shadow-md hover:translate-y-1 hover:shadow-none duration-200">
                        <Link href="/search">
                            <Image src="/magnifying_glass.png" alt='magnifying_glass' height={20} width={20} className='w-5 h-auto' />
                        </Link>
                    </button>
                </li>
                <li>
                    <UserIcon />
                </li>
            </ul>
        </div>
        <Navbar pageNavs={pageNavs} setOpenSide={setOpenSide} />
    </header>
  )
}
