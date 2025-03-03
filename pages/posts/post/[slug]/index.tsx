import { GetStaticProps } from 'next';
import React from 'react'
import { PostMetaData } from '@/types/postMetaData';
import { MdBlock } from 'notion-to-md/build/types';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { pageNav } from '@/types/pageNav';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import { CurriculumService } from '@/lib/services/CurriculumService';
import { PageDataService } from '@/lib/services/PageDataService';

type postPath = {
  params: { slug:string }
}

type Props = {
  metadata:PostMetaData;
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
};

const curriculumService = new CurriculumService();

export const getStaticPaths = async () => {
  const allSlug:{slug:string}[] = await curriculumService.getAllSlug();

  const paths: postPath[] = allSlug.map(({ slug }) => {
    return { params: { slug: slug } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

type post ={
  metadata:PostMetaData,
  mdBlocks:MdBlock[]
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const pageDataService = new PageDataService();

  const mdBlocks:MdBlock[] = await pageDataService.getPageDataByPageId(slug);
  const singlePost:PostMetaData = await curriculumService.getCurriculumBySlug(slug);

  const post:post = {
    metadata:singlePost,
    mdBlocks
  } 

  const courseNav: pageNav = { title: post.metadata.category, id: `/posts/course/${post.metadata.category}` };
  const postNav: pageNav = { title: post.metadata.title, id: `/posts/post/${slug}` };
  const pageNavs: pageNav[] = post.metadata.is_basic_curriculum
    ? [HOME_NAV, BASIC_NAV, courseNav, postNav]
    : post.metadata.category === ""
    ? [HOME_NAV, postNav]
    : [HOME_NAV, courseNav, postNav];
  return {
    props: {
      metadata: post.metadata,
      mdBlocks: mdBlocks,
      pageNavs,
    },
  };
};


const Post =({ metadata, mdBlocks,pageNavs}: Props) => {
  return (
    <Layout headerProps={{pageNavs}}>
      <div className='p-4 pt-24 pb-8'>
      <section className='p-5 bg-white pb-10'>
        <div className='flex'>
        {metadata.icon!=="" && <Image src={`/horizon-atlas/notion_data/eachPage/${metadata.slug}/icon.png`} alt={''} width={20} height={20} className='relative w-auto h-8 m-0 mr-2 top-0.5' />}
          <h2 className='w-full text-2xl font-medium'>{metadata.title}</h2>
        </div>
          <div className='border-b mt-2'></div>
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
                <MdBlockComponent mdBlock={mdBlock} slug={metadata.slug} depth={0} key={i} />
              ))}
            </div>
          </div>
      </section>
      </div>
      <script async src="//cdn.iframe.ly/embed.js"></script>
    </Layout>
  )
}

export default Post