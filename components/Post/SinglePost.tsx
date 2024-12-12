import { create } from 'domain';
import React from 'react'
import { PostMetaData } from "@/types/postMetaData";
import Link from 'next/link';

const SinglePost = (props:PostMetaData) => {
    const {title, description, date, tags, slug, isPagenationPage} = props;
  return (
    <Link href={`/posts/${slug}`}>
        {isPagenationPage ? (
            <section className=' bg-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300'>
                <div className='lg:flex items-center'>
                    <h2 className='text-gray-100 text-2xl font-medium mb-2'>
                        {title}
                    </h2>
                    <div className='text-gray-100 mr-2'>{date}</div>
                </div>
                {tags.map((tag)=>(
                        <span className='text-white bg-gray-500 rounded-xl px-2 pb-1 mr-2 font-thin'>
                            {tag}
                        </span>
                    ))}
                <p className='text-gray-100'>{description}</p>
            </section>
        ) : (
            <section className='lg:w-1/2 bg-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300'>
                <div className='flex items-center gap-3'>
                    <h2 className='text-gray-100 text-2xl font-medium mb-2'>
                        {title}
                    </h2>
                    <div className='text-gray-100'>{date}</div>
                </div>
                {tags.map((tag)=>(
                    <span className='text-white bg-gray-500 rounded-xl px-2 pb-1 mr-2 font-thin'>
                        {tag}
                    </span>
                ))}
                <p className='text-gray-100 line-clamp-3'>{description}</p>
            </section>
        )}
    </Link>
  )
}

export default SinglePost