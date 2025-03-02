import React from 'react'
import HamburgerButton from './hamburgerButton./hamburgerButton';
import UserIcon from './UserInfo/userIcon';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosSearch } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { MdOutlineEmail } from "react-icons/md";

type Props={
    setOpenbar:React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({setOpenbar}:Props){
    
  return (
    <header className='w-full bg-white'>
        <div className=" text-white px-5 mb-0 flex justify-between items-center">
            <div>
                <Image src={'/horizon-atlas/logo_.png'} alt={''} width={32} height={16} className='w-[7.5rem] h-auto absolute top-[-29%] left-0.5' />
            </div>
            <ul className="hidden md:flex items-center pt-2 text-sm duration-100">
                <li className="mr-4">
                    <Link href={'/search'}>
                        <div className="text-neutral-400 hover:text-purple-500">
                            <IoIosSearch size={22} />
                            <p>検索</p>
                        </div>
                    </Link>
                </li>
                <li className="mr-4">
                    <Link href={'/user/progress'}>
                        <div className="text-neutral-400 hover:text-purple-500">
                            <FaArrowTrendUp size={22} />
                            <p>進捗度</p>
                        </div>
                    </Link>
                </li>
                <li className="mr-4">
                    <Link href={'/user/progress'}>
                        <div className="text-neutral-400 hover:text-purple-500">
                            <MdOutlineEmail size={22} />
                            <p>改善要請</p>
                        </div>
                    </Link>
                </li>
                <li>
                    <UserIcon />
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
