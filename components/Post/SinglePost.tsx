import React from 'react';
import { PostMetaData } from "@/types/postMetaData";
import Link from 'next/link';

const SinglePost = (props:PostMetaData) => {
    const {title, tags, slug, isPagenationPage} = props;
  return (
    <Link href={`/posts/${slug}`}>
        {isPagenationPage ? (
            <section className='bg-slate-50 mb-4 mx-auto rounded-md p-3 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300'>
                <div className=''>
                    <h2 className='text-xl font-medium mb-2 mr-1'>
                        {title}
                    </h2>
                </div>
                <div className='flex flex-wrap'>
                    {tags.map((tag, i:number)=>(
                        <span className='bg-gray-500 text-white rounded-md px-1 pb-1/2 mr-2 mb-1 font-thin' key={i}>
                            {tag}
                        </span>
                    ))}
                </div>
            </section>
        ) : (
            <section className='bg-slate-50 mb-4 mx-auto rounded-md p-3 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300'>
                <div className=''>
                    <h2 className='text-xl font-medium mb-2 mr-1'>
                        {title}
                    </h2>
                </div>
                {tags.map((tag, i:number)=>(
                    <span className='text-white bg-gray-500 rounded-md px-1 pb-1 mr-2 font-thin' key={i}>
                        {tag}
                    </span>
                ))}
            </section>
        )}
    </Link>
  )
}

export default SinglePost