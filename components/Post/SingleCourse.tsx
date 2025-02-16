import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostMetaData } from '@/types/postMetaData';
import { getIconsByPosts } from '@/lib/services/notionApiService';
import isImageUrlValid from '@/lib/validationImageUrl';

type Props={
    course:string;
    posts:PostMetaData[];
}

const SingleCourse = (props:Props) => {
    const {course,posts} = props;
    const icons = getIconsByPosts(posts);
    useEffect(()=>{
        const validList:boolean[] = [];
        for(const icon of icons){
            isImageUrlValid(icon).then(
                (valid)=>{
                    validList.push(valid);
                }
            );
        }
        for(const valid of validList){
            if(!valid){
                window.location.reload();
                break;
            }
        }
    },[])
    return (
        <Link href={`/posts/course/${course}/1`}>
            <section className='bg-slate-50 mb-4 mx-auto rounded-md p-3 shadow-2xl hover:shadow-none hover:translate-y-1 hover:bg-neutral-100 transition-all duration-300'>
                <div className=''>
                    {<span className='text-sm text-neutral-500 my-0'>カリキュラム数：{posts.length}</span>}
                    <h2 className='text-2xl font-medium mt-0'>
                        {course}
                    </h2>
                </div>
                <div className=''>
                    {posts.slice(0, 5).map((post,i)=>{
                        return (<div key={i} className='ml-3 text-neutral-500 flex mt-1'>
                            {icons[i]!=='' ? <Image src={`/horizon-atlas/notion_data/icon/${post.slug}.png`} alt={''} height={20} width={20} className='h-6 w-auto m-0 mr-1.5' /> : <p>・</p>}
                            {post.title}
                        </div>)
                    })}
                </div>
            </section>
        </Link>
    )
}

export default SingleCourse;