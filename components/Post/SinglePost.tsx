import React from 'react'
import { PostMetaData } from "@/types/postMetaData";
import Link from 'next/link';

const SinglePost = (props:PostMetaData) => {
    const {title, description, date, tags, slug, isPagenationPage} = props;
  return (
    <Link href={`/posts/${slug}`}>
        {isPagenationPage ? (
            <section className='border-solid border-x-slate-500 bg-slate-50 mb-8 mx-1 rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300'>
                <div className='lg:flex lg:flex-wrap items-center'>
                    <h2 className='text-2xl font-medium mb-2 mr-1'>
                        {title}
                    </h2>
                    <div className='mr-2'>{date}</div>
                </div>
                <div className='flex flex-wrap'>
                    {tags.map((tag, i:number)=>(
                        <span className=' bg-gray-500 text-white rounded-xl px-2 pb-1/2 mr-2 mb-1 font-thin' key={i}>
                            {tag}
                        </span>
                    ))}
                </div>
                <p className=''>{description}</p>
            </section>
        ) : (
            <section className='border-solid border-spacing-x-7 border-x-slate-500 bg-slate-50 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300'>
                <div className='flex items-center gap-3'>
                    <h2 className=' text-2xl font-medium mb-2 mr-1'>
                        {title}
                    </h2>
                    <div className=''>{date}</div>
                </div>
                {tags.map((tag, i:number)=>(
                    <span className='text-white bg-gray-500 rounded-xl px-2 pb-1 mr-2 font-thin' key={i}>
                        {tag}
                    </span>
                ))}
                <p className=' line-clamp-3'>{description}</p>
            </section>
        )}
    </Link>
  )
}

export default SinglePost