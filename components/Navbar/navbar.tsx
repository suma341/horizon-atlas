import { getPageLinks } from '@/lib/createPostPageLink';
import { pageNav } from '@/types/pageNav'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props ={
    pageNavs:pageNav[]
}

function navbar(props:Props) {
    const {pageNavs} = props;
    const pageLinks = getPageLinks(pageNavs);

    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 550) {
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
            {!show && (<nav className='ml-4 opacity-70 bg-neutral-100 z-50'>
                <div className='flex'>
                    {pageNavs.map((nav, i)=>(
                        <>
                            <Link href={pageLinks[i]} className='mr-2  hover:bg-neutral-400'>{nav.title}</Link>
                            {i + 1<pageNavs.length && <p className='mr-2 '>/</p>}
                        </>
                        )
                    )}
                </div>
            </nav>)}
            {show && (<nav className='ml-4 fixed bg-neutral-100 opacity-70 top-0 z-50'>
                <div className='flex'>
                    {pageNavs.map((nav, i)=>(
                        <>
                            <Link href={pageLinks[i]} className='mr-2 hover:bg-neutral-400'>{nav.title}</Link>
                            {i + 1<pageNavs.length && <p className='mr-2 '>/</p>}
                        </>
                        )
                    )}
                </div>
            </nav>)}
        </>
    )
}

export default navbar