import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    postData:{
        title:string,
        tag:string[], 
        id:string,
        iconType:string,
        iconUrl:string
    },
    info?:boolean;
    category?:string
}

const SinglePost = (props:Props) => {
    const {title, tag, id,iconType,iconUrl} = props.postData;
    const categoryQuery = props.category ? `?category=${props.category}` : ""

    return (
        <Link href={`/posts/curriculums/${id}${categoryQuery}`}>
            <section className='mb-4 rounded-md p-2 shadow-md hover:shadow-none hover:translate-y-1 hover:bg-neutral-50 transition-all duration-200 border'>
                <div className='flex w-auto h-9 my-0.5'>
                    {iconType==="" && <Image src={"https://ryukoku-horizon.github.io/horizon-atlas/file_icon.svg"} alt={title} width={30} height={30} className='relative w-8 h-8 m-0 mr-1 bottom-1' />}
                    {iconType !=="emoji" && iconType!=="" &&<Image src={iconUrl} alt={title} width={30} height={30} className='relative w-8 h-8 m-0 mr-1 bottom-1' />}
                    {iconType ==="emoji" &&<p className='relative w-8 h-8 m-0 mr-1 bottom-1 text-3xl align-middle'>{iconUrl}</p>}
                    <h2 className='text-xl font-medium mb-2 line-clamp-1'>
                        {title}
                    </h2>
                </div>
                <div className="flex flex-wrap gap-2 mt-0.5">
                    {tag.map((t, i) => (
                        <span
                            key={i}
                            className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </section>
        </Link>
    )
}

export default SinglePost