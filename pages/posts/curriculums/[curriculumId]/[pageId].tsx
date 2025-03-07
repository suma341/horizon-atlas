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
import SideBlock from '@/components/SideBlock/SideBlock';

type postPath = {
  params: { curriculumId:string,pageId:string }
}

type Props = {
  metadata:PostMetaData;
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
  pageId:string;
  childrenData?:{title:string;childPages:pageNav[]};
  title:string;
};

export const getStaticPaths = async () => {
  const allCurriculumid:string[] = await CurriculumService.getAllCurriculumId();
  const rootPages = allCurriculumid.map((id)=>{
    return {
        curriculumId:id,
        pageId:id
    }
  })
  const allChildId = await PageDataService.getChildPageIds();
  const allPageId = [...rootPages,...allChildId]

  const paths: postPath[] = allPageId.map((data) => {
    return { params: { 
      curriculumId:data.curriculumId,
      pageId:data.pageId }
     };
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
  const pageId = params?.pageId as string;
  const curriculumId = params?.curriculumId as string;

  const mdBlocks:MdBlock[] = await PageDataService.getPageDataByPageId(pageId);
  const singlePost:PostMetaData = await CurriculumService.getCurriculumById(curriculumId);

  const post:post = {
    metadata:singlePost,
    mdBlocks
  } 

  const courseNav: pageNav = { title: post.metadata.category, id: `/posts/course/${post.metadata.category}` };
  const postNav: pageNav = { title: post.metadata.title, id: `/posts/curriculums/${curriculumId}/${curriculumId}` };
  const pageNavs: pageNav[] = post.metadata.is_basic_curriculum
    ? [HOME_NAV, BASIC_NAV, courseNav, postNav]
    : post.metadata.category === ""
    ? [HOME_NAV, postNav]
    : [HOME_NAV, courseNav, postNav];

    if(curriculumId!==pageId){
      const childrenData = await PageDataService.getChildrenData(pageId);
      const childPageNavs = await PageDataService.getPageNavs(pageId);
      const title = await PageDataService.getPageTitle(pageId);
      return {
        props:{
          metadata: post.metadata,
          mdBlocks: mdBlocks,
          pageNavs:[...pageNavs,...childPageNavs],
          childrenData,
          pageId,
          title
        }
      }
    }

  return {
    props: {
      metadata: post.metadata,
      mdBlocks: mdBlocks,
      pageNavs,
      pageId,
      title:post.metadata.title
    },
  };
};

const Post =({ metadata, mdBlocks,pageNavs,childrenData,pageId,title}: Props) => {
  const { setCurriculumId } = useCurriculumIdStore();
  useEffect(()=>{
    setCurriculumId(metadata.curriculumId);
  },[])

  return (
    <Layout pageNavs={pageNavs} sideNavProps={childrenData}>
      <div className='p-4 pt-24 pb-8'>
        <section className={childrenData ? 'p-5 bg-white pb-10 md:w-3/4' : "p-5 bg-white pb-10"}>
          <div className='flex'>
          {pageId === metadata.curriculumId && <Image src={`/horizon-atlas/notion_data/eachPage/${metadata.curriculumId}/icon.png`} alt={''} width={20} height={20} className='relative w-auto h-8 m-0 mr-2 top-0.5' />}
            <h2 className='w-full text-2xl font-medium'>{title}</h2>
          </div>
          <div className='border-b mt-2'></div>
          {pageId === metadata.curriculumId && <><br />
            {metadata.tags.map((tag:string,i:number)=>(
              <p className='text-white bg-sky-500 rounded-xl font-medium mt-2 px-2 inline-block mr-2' key={i}>
                {tag}
              </p>
            ))}
          </>}
          <div className='mt-10 font-medium'>
            <div>
              {mdBlocks.map((mdBlock, i)=>(
                <MdBlockComponent mdBlock={mdBlock} depth={0} key={i} />
              ))}
            </div>
          </div>
        </section>
        {childrenData && <div className='hidden md:block md:w-1/4 mt-5'>
          <SideBlock title={childrenData.title} childPages={childrenData.childPages} />
        </div>}
      </div>
      <script async src="//cdn.iframe.ly/embed.js"></script>
    </Layout>
  )
}

export default Post