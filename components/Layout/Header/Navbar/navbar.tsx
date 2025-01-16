import { pageNav } from '@/types/pageNav'
import Link from 'next/link'
import React from 'react'
import DetailNav from './detailNav/DetailNav';

type Props ={
    pageNavs:pageNav[];
}

function Navbar(props:Props) {
    const {pageNavs} = props;

    return (
        <>
            <nav className='ml-4 bg-neutral-50 relative'>
                {pageNavs.length>3 && <div className='flex'>
                    <div className='flex'>
                        <Link href={pageNavs[0].id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{pageNavs[0].title}</Link>
                        <p className='mr-2 cursor-default text-neutral-500'>/</p>
                        <DetailNav pageNav={pageNavs.slice(1,-2)} />
                        <p className='mr-2 cursor-default text-neutral-500'>/</p>
                        <Link href={pageNavs[pageNavs.length - 2].id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{pageNavs[pageNavs.length - 2].title}</Link>
                        <p className='mr-2 cursor-default text-neutral-500'>/</p>
                        <Link href={pageNavs[pageNavs.length - 1].id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{pageNavs[pageNavs.length - 1].title}</Link>
                    </div>
                </div>}
                {pageNavs.length<=3 && <div className='flex'>
                    {pageNavs.map((nav, i)=>(
                        <div className='flex' key={i}>
                            <Link href={nav.id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{nav.title}</Link>
                            {i + 1<pageNavs.length && <p className='mr-2 cursor-default text-neutral-500'>/</p>}
                        </div>
                        )
                    )}
                </div>}
            </nav>
        </>
    )
}

export default Navbar;