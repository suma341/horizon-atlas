import { GetStaticProps } from 'next';
import React, { useEffect } from 'react';
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
import { PageInfoService } from '@/lib/services/PageInfoService';
import { PageInfo } from '@/types/PageInfo';
import useIconStore from '@/stores/iconStore';
import { IconInfo } from '@/types/iconInfo';

type postPath = {
  params: { curriculumId:string,pageId:string }
}

type Props = {
  metadata:PostMetaData;
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
  pageId:string;
  childrenData?:{title:string;childPages:pageNav[]};
  pageInfo:PageInfo;
  childIcons:IconInfo[]
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageId = params?.pageId as string;
  const curriculumId = params?.curriculumId as string;

  const mdBlocks:MdBlock[] = await PageDataService.getPageDataByPageId(pageId);
  const singlePost:PostMetaData = await CurriculumService.getCurriculumById(curriculumId);

  const childIcons:IconInfo[] = [];
  const pageInfo = await PageInfoService.getPageInfoByPageId(pageId);

  const checkBlock=(blocks:MdBlock[],type:string)=>{
    const targetBlock:MdBlock[] = [];
    for(const block of blocks){
      if(block.children.length!==0){
          const childTarget = checkBlock(block.children,type)
          targetBlock.push(...childTarget)
      }
      if(block.type===type){
        targetBlock.push(block)
      }
    }
    return targetBlock;
  }
  const linkToPageBlocks = checkBlock(mdBlocks,"link_to_page")
  const UrlRegex = /\(([^)]+)\)/g;
  for(const block of linkToPageBlocks){
    const urlMatch = block.parent.match(UrlRegex);
    if(urlMatch){
      const url = urlMatch[0].slice(1,-1);
      const pageId_ = url.split("/")[4]
      const icon = await PageInfoService.getIconByPageId(pageId_);
      childIcons.push(icon)
    } 
  }
  const childPageBlocks = checkBlock(mdBlocks,"child_page");
  for(const block of childPageBlocks){
    const icon = await PageInfoService.getIconByPageId(block.blockId);
    childIcons.push(icon)
  }

  const courseNav: pageNav = { title: singlePost.category, id: `/posts/course/${singlePost.category}` };
  const postNav: pageNav = { title: singlePost.title, id: `/posts/curriculums/${curriculumId}/${curriculumId}` };
  const pageNavs: pageNav[] = singlePost.is_basic_curriculum
    ? [HOME_NAV, BASIC_NAV, courseNav, postNav]
    : singlePost.category === ""
    ? [HOME_NAV, postNav]
    : [HOME_NAV, courseNav, postNav];

    if(curriculumId!==pageId){
      const childrenData = await PageDataService.getChildrenData(pageId);
      const childPageNavs = await PageDataService.getPageNavs(pageId);
      return {
        props:{
          metadata:singlePost,
          mdBlocks,
          pageNavs:[...pageNavs,...childPageNavs],
          childrenData,
          pageId,
          pageInfo,
          childIcons
        }
      }
    }
  return {
    props: {
      metadata: singlePost,
      mdBlocks,
      pageNavs,
      pageId,
      pageInfo,
      childIcons
    },
  };
};

const Post =({ metadata, mdBlocks,pageNavs,childrenData,pageId,pageInfo,childIcons}: Props) => {
  const { setCurriculumId } = useCurriculumIdStore();
  const { setIcons } = useIconStore()
  useEffect(()=>{
    setCurriculumId(metadata.curriculumId);
    setIcons(childIcons)
  },[metadata.curriculumId,childIcons,pageId])

  return (
    <Layout pageNavs={pageNavs} sideNavProps={childrenData}>
      <div className='p-4 pt-24 pb-8'>
        <section className={childrenData ? 'p-5 bg-white pb-10 md:w-3/4' : "p-5 bg-white pb-10"}>
          <div className='flex'>
          {pageInfo.iconType==="" && <Image src={"/horizon-atlas/file_icon.svg"} alt={''} width={20} height={20} className='relative w-auto h-8 m-0 mr-2 top-0.5' />}
          {pageInfo.iconType !== "emoji" && pageInfo.iconType!=="" && <Image src={pageInfo.iconUrl} alt={''} width={20} height={20} className='relative w-auto h-8 m-0 mr-2 top-0.5' />}
          {pageInfo.iconType === "emoji" && <p className='relative w-auto h-8 m-0 mr-2 top-0.5 text-3xl'>{pageInfo.iconUrl}</p>}
            <h2 className='w-full text-2xl font-medium'>{pageInfo.title.replace("##","")}</h2>
          </div>
          <div className='border-b mt-2'></div>
          {pageId === metadata.curriculumId && <>
            {metadata.tags.map((tag:string,i:number)=>(
              <p className='text-white bg-sky-500 rounded-xl font-medium mt-2 px-2 inline-block mr-2' key={i}>
                {tag}
              </p>
            ))}
          </>}
          <div className='mt-4 font-medium'>
            <div key={pageId}>
              {mdBlocks.map((mdBlock)=>(
                <MdBlockComponent mdBlock={mdBlock} depth={0} key={mdBlock.blockId} />
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
