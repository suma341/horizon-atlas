import React from 'react'
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Logo } from '../logo/logo';

function Header() {
    const router = useRouter();

    const scrollToSection = (targetId:string) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
      };

    return (
        <header className="bg-neutral-50 text-white py-4 min-h-14">
            <div className="container mx-auto flex justify-between items-center px-4">
            <Link href={'/'}>
                <Logo />
            </Link>
            {router.pathname==="/" && <nav className="hidden md:flex space-x-6">
                {['about', 'curriculums'].map((section) => (
                <motion.button
                    key={section}
                    onClick={()=>scrollToSection(section)}
                    className="text-gray-800 hover:text-purple-700 text-lg font-medium relative group"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                >
                    {section}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-purple-700 transition-all group-hover:w-full"></span>
                </motion.button>
                ))}
            </nav>}
            </div>
        </header>
    )
}

export default Header