import React from 'react'
import Link from 'next/link';
import { Logo } from '../logo/logo';


function Header() {

    return (
        <header className="bg-neutral-50 text-white py-4 min-h-14">
            <div className="container mx-auto flex justify-between items-center px-4">
            <div>
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <nav className="hidden md:flex space-x-6">
            </nav>
            </div>
        </header>
    )
}

export default Header