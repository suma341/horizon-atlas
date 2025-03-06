import { GetStaticProps } from 'next';
import React, { useEffect } from 'react'
import { PostMetaData } from '@/types/postMetaData';
import { MdBlock } from 'notion-to-md/build/types';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { pageNav } from '@/types/pageNav';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import { CurriculumService } from '@/lib/services/CurriculumService';
import { PageDataService } from '@/lib/services/PageDataService';
import useCurriculumIdStore from '@/stores/curriculumIdStore';

type postPath = {
  params: { slug:string }
}

type Props = {
  metadata:PostMetaData;
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
};

export const getStaticPaths = async () => {
  const allSlug:string[] = await CurriculumService.getAllCurriculumId();

  const paths: postPath[] = allSlug.map((id) => {
    return { params: { slug: id } };
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

  const mdBlocks:MdBlock[] = await PageDataService.getPageDataByPageId(slug);
  const singlePost:PostMetaData = await CurriculumService.getCurriculumById(slug);

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
  const { setCurriculumId } = useCurriculumIdStore();
  
  useEffect(()=>{
    setCurriculumId(metadata.curriculumId);
  },[])

  return (
    <Layout headerProps={{pageNavs}}>
      <div className='p-4 pt-24 pb-8'>
      <section className='p-5 bg-white pb-10'>
        <div className='flex'>
        <Image src={`/horizon-atlas/notion_data/eachPage/${metadata.curriculumId}/icon.png`} alt={''} width={20} height={20} className='relative w-auto h-8 m-0 mr-2 top-0.5' />
          <h2 className='w-full text-2xl font-medium'>{metadata.title}</h2>
        </div>
          <div className='border-b mt-2'></div>
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
      </div>
      <script async src="//cdn.iframe.ly/embed.js"></script>
    </Layout>
  )
}

export default Post