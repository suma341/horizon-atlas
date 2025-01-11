import { GetStaticProps } from 'next';
import React from 'react'
import { PostMetaData } from '@/types/postMetaData';
import { MdBlock } from 'notion-to-md/build/types';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { getAllPosts, getSinglePost } from '@/lib/services/notionApiService';
import { pageNav } from '@/types/pageNav';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import Navbar from '@/components/Navbar/navbar';
import Image from 'next/image';

type postPath = {
  params: { slug:string }
}

type Props = {
  metadata:PostMetaData;
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
};

export const getStaticPaths = async() =>{
  const allPosts:PostMetaData[] = await getAllPosts();
  const paths:postPath[] = allPosts.map(({slug})=>{
    return { params: { slug: slug } };
  })
  return {
    paths,
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string; 
  const post = await getSinglePost(slug);
  const courseNav:pageNav = {title:post.metadata.category,id:`/posts/course/${post.metadata.category}/1`,child:false};
  const postNav:pageNav = {title:post.metadata.title,id:`/posts/post/${slug}`,child:false};
  const pageNavs:pageNav[] = post.metadata.is_basic_curriculum ? 
    [HOME_NAV,BASIC_NAV,courseNav,postNav] : post.metadata.category ==='' ? [HOME_NAV,postNav] : [HOME_NAV,courseNav,postNav]
  return {
    props: {
      metadata:post.metadata,
      mdBlocks:post.mdBlocks,
      pageNavs
    },
    revalidate: 600
  };
};

const Post =({ metadata, mdBlocks,pageNavs }: Props) => {
  return (
    <>
    <Navbar pageNavs={pageNavs} />
    <section className='container lg;px-10 px-20 mx-auto mt-20'>
      <div className='flex'>
      {metadata.icon!=="" && <Image src={metadata.icon} alt={''} width={20} height={20} className='relative w-auto h-8 m-0 mr-2 top-0.5' />}
        <h2 className='w-full text-2xl font-medium'>{metadata.title}</h2>
      </div>
        <div className='border-b-2 mt-2'></div>
        <span className='text-gray-500'>created at {metadata.date}</span>
        <br />
        {metadata.tags.map((tag:string,i:number)=>(
          <p className='text-white bg-sky-500 rounded-xl font-medium mt-2 px-2 inline-block mr-2' key={i}>
            {tag}
            </p>
        ))}
        <div className='mt-10 font-medium'>
          <div>
            {mdBlocks.map((mdBlock, i)=>(
              <MdBlockComponent mdBlock={mdBlock} depth={0} key={i} />
            ))}
          </div>
        </div>
    </section>
    </>
  )
}

export default Post