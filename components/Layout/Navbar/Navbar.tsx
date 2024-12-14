import UserIcon from '@/components/Layout/Navbar/UserIcon/userIcon'
import Link from 'next/link'
import { FaMagnifyingGlass } from "react-icons/fa6";
import React from 'react'

const Navbar = () => {
  return (
    <nav className='container mx-auto lg:px-2 px-5'>
        <div className='container flex items-center justify-between mx-auto'>
            <Link href="/" className='text-2xl font-medium bg-white p-1 rounded-md'>
                TechShelf
            </Link>
            <div>
                <ul className='flex items-center text-sm py-4'>
                    <li className='mr-3'> 
                        <button className="p-2 bg-slate-50 hover:bg-gray-100 rounded-full shadow-xl hover:translate-y-1 hover:shadow-none duration-200">
                            <Link href="/search">
                            <FaMagnifyingGlass size={22} className="text-gray-600 hover:text-gray-800" />
                            </Link>
                        </button>
                    </li>
                    <li>
                        <UserIcon />
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  )
}

export default Navbar