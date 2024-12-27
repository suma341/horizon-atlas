import { getPageLink } from '@/lib/createPageLink';
import Link from 'next/link';
import React from 'react'

interface Props{
    numberOfPage:number;
    currentPage:string;
    tag:string;
}

const Pagenation =(props:Props)=> {
    const {numberOfPage, currentPage, tag} = props;

    const currentPageNum = parseInt(currentPage);

    const pages:number[]=[];
    for(let i=0;i<numberOfPage;i++){
        pages.push(i + 1);
    }

    return (
        <section className='mb-12 lg:w-1/2 mx-auto rounded-md p-5'>
            <ul className='flex items-center justify-center gap-4'>
                {pages.map((page, i:number)=> currentPageNum == page ? (
                    <li className='bg-neutral-50 rounded-lg w-6 h-8 relative shadow-xl' key={i}>
                        <Link href={`/posts/page/${page}`} className='absolute shadow-2xl top-2/4  left-1/4 -translate-y-2/4'>
                            {page}
                        </Link>
                    </li>
                ):
                (
                    <li className='rounded-lg w-6 h-8 relative shadow-xl' key={i}>
                        <Link href={getPageLink(tag, page)} className='absolute top-2/4  left-1/4 -translate-y-2/4 text-stone-700'>
                            {page}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Pagenation;