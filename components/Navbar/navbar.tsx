import { pageNav } from '@/types/pageNav'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DetailNav from './detailNav/DetailNav';

type Props ={
    pageNavs:pageNav[]
}

function Navbar(props:Props) {
    const {pageNavs} = props;

    const [show, setShow] = useState(false);
    const [isVisible, setIsVisible] = useState(false); 

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 75) {
            setShow(true);
        } else {
            setShow(false);
        }
        };

        window.addEventListener('scroll', handleScroll);

        // クリーンアップ関数
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, [window.scrollY]);

    return (
        <>
            <nav className='ml-4 bg-neutral-50 z-50' style={show ? {opacity:"0"} : {}}>
                {pageNavs.length>3 && <div className='flex'>
                    <div className='flex'>
                        <Link href={pageNavs[0].id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{pageNavs[0].title}</Link>
                        <p className='mr-2 cursor-default text-neutral-500'>/</p>
                        <DetailNav pageNav={pageNavs.slice(1,-2)} show={show} isVisible={isVisible} setIsVisible={setIsVisible} />
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
            {show && (<nav className='ml-4 fixed bg-neutral-50 top-0 z-50'>
                {pageNavs.length>3 && <div className='flex'>
                    <div className='flex'>
                        <Link href={pageNavs[0].id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{pageNavs[0].title}</Link>
                        <p className='mr-2 cursor-default text-neutral-500'>/</p>
                        <DetailNav pageNav={pageNavs.slice(1,-2)} isVisible={isVisible} setIsVisible={setIsVisible} />
                        <p className='mr-2 cursor-default text-neutral-500'>/</p>
                        <Link href={pageNavs[pageNavs.length - 2].id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{pageNavs[pageNavs.length - 2].title}</Link>
                        <p className='mr-2 cursor-default text-neutral-500'>/</p>
                        <Link href={pageNavs[pageNavs.length - 1].id} className='mr-2 px-1 hover:bg-neutral-200 text-neutral-500'>{pageNavs[pageNavs.length - 1].title}</Link>
                    </div>
                </div>}
                {pageNavs.length <=3 && <div className='flex'>
                    {pageNavs.map((nav, i)=>(
                        <>
                            <Link href={nav.id} className='mr-2 hover:bg-neutral-200 text-neutral-500'>{nav.title}</Link>
                            {i + 1<pageNavs.length && <p className='mr-2 text-neutral-500'>/</p>}
                        </>
                        )
                    )}
                </div>}
            </nav>)}
        </>
    )
}

export default Navbar;