import { getPageLinks } from '@/lib/createPostPageLink';
import { pageNav } from '@/types/pageNav'
import Link from 'next/link'
import React from 'react'

type Props ={
    pageNavs:pageNav[]
}

function navbar(props:Props) {
    const {pageNavs} = props;
    const pageLinks = getPageLinks(pageNavs);

    return (
        <nav className='ml-4'>
            <div className='flex'>
                {pageNavs.map((nav, i)=>(
                    <>
                        <Link href={pageLinks[i]} className='mr-2 hover:bg-neutral-200'>{nav.title}</Link>
                        {i + 1<pageNavs.length && <p className='mr-2'>/</p>}
                    </>
                    )
                )}
            </div>
        </nav>
    )
}

export default navbar