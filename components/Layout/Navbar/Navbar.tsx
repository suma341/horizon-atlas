import Link from 'next/link'
import { MagnifyingGlass } from 'phosphor-react'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='container mx-auto lg:px-2 px-5 lg:w-2/5'>
        <div className='container flex items-center justify-between mx-auto'>
            <Link href="/" className='text-2xl font-medium'>
                TechShelf
            </Link>
            <div>
                <ul className='flex items-center text-sm py-4'>
                    <li>
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
                            <MagnifyingGlass size={24} weight="bold" className="text-gray-700">
                                <Link href='/'></Link>
                            </MagnifyingGlass>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  )
}

export default Navbar