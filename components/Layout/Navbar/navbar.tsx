import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import React from 'react';
import DetailNav from './detailNav/DetailNav';
import { IoHomeOutline } from 'react-icons/io5';

type Props ={
    pageNavs:pageNav[];
}

function Navbar(props:Props) {
    const {pageNavs} = props;

    return (
        <>
            <nav className='pl-4 bg-white duration-100 pt-1'>
                {pageNavs.length>3 && <div className='flex'>
                    <div className='flex'>
                        <Link href={pageNavs[0].id} className='pr-2 py-0.5 pl-1 hover:bg-neutral-200 text-neutral-500'>
                            <IoHomeOutline size={18} />
                        </Link>
                        <p className='cursor-default text-neutral-500'>/</p>
                        <DetailNav pageNav={pageNavs.slice(1,-2)} />
                        <p className='cursor-default text-neutral-500'>/</p>
                        <Link href={pageNavs[pageNavs.length - 2].id} className='px-2 hover:bg-neutral-200 text-neutral-500 truncate max-w-[clamp(100px, 20vw, 250px)]'>
                            {pageNavs[pageNavs.length - 2].title}
                        </Link>
                        <p className='cursor-default text-neutral-500'>/</p>
                        <Link href={pageNavs[pageNavs.length - 1].id} className='px-2 hover:bg-neutral-200 text-neutral-500 truncate max-w-[clamp(100px, 20vw, 250px)]'>
                            {pageNavs[pageNavs.length - 1].title}
                        </Link>
                    </div>
                </div>}
                {pageNavs.length<=3 && <div className='flex'>
                    {pageNavs.map((nav, i)=>(
                        <div className='flex gap-1.5' key={i}>
                            {i===0 && <Link href={nav.id} className='pr-2 pt-0.5 pl-1 hover:bg-neutral-200 text-neutral-500'>
                                <IoHomeOutline size={18} />
                            </Link>}
                            {i!==0 && <Link href={nav.id} className='px-2 hover:bg-neutral-200 text-neutral-500 truncate max-w-[clamp(100px, 20vw, 250px)]'>
                                {nav.title}
                            </Link>}
                            {i + 1 < pageNavs.length && <p className='cursor-default text-neutral-500'>/</p>}
                        </div>
                        )
                    )}
                </div>}
            </nav>
        </>
    )
}

export default Navbar;