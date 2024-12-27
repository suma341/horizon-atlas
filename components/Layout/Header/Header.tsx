import UserIcon from '@/components/Layout/Header/UserIcon/userIcon'
import Link from 'next/link'
import { FaMagnifyingGlass } from "react-icons/fa6";
import React from 'react'

export default function Header(){
  return (
    <header className='lg:px-2 px-5 bg-neutral-300 text-white'>
        <div className='container flex items-center justify-between'>
            <Link href="/" className='ml-5 text-2xl font-medium text-white p-1 rounded-md'>
                TechShelf
            </Link>
            <div>
                <ul className='flex items-center text-sm py-4'>
                    <li className='mr-4'>
                        <button className="p-2 bg-slate-50 hover:bg-gray-100 rounded-full shadow-xl hover:translate-y-1 hover:shadow-none duration-200">
                            <Link href="/search">
                            <FaMagnifyingGlass size={22} className="text-neutral-700 hover:text-gray-900" />
                            </Link>
                        </button>
                    </li>
                    <li>
                        <UserIcon />
                    </li>
                </ul>
            </div>
        </div>
    </header>
  )
}
