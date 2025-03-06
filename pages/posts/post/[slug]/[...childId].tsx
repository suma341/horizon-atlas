import Layout from '@/components/Layout/Layout';
import SideBlock from '@/components/SideBlock/SideBlock';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import { pageNav } from '@/types/pageNav';
import { PostMetaData } from '@/types/postMetaData';
import { GetStaticProps } from 'next';
import { MdBlock } from 'notion-to-md/build/types';
import { CurriculumService } from '@/lib/services/CurriculumService';
import { PageDataService } from '@/lib/services/PageDataService';
import useCurriculumIdStore from '@/stores/curriculumIdStore';
import { useEffect } from 'react';

type Props = {
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
  parentTitle:string;
  childNavs:pageNav[];
  curriculumId:string;
};

type pagePath = {
  params: { slug:string, childId:string[] }
}

export const getStaticPaths = async () => {
  const allId:string[] = await CurriculumService.getAllCurriculumId();
  const childPages = await PageDataService.getPageDataByType('child_page');

  const paths:pagePath[]=(
      allId.map((post)=>{
        const children = childPages.filter((item)=>item.curriculumId===post);
        return children.map((child)=>{
          return {
            params:{
              slug:post,
              childId:[child.blockId]
            }
          }
        })
      }).flat()
  )

  return {
    paths,
    fallback: 'blocking', // ISRを有効化
  };
};
export const getStaticProps: GetStaticProps = async (context) => {
  const currentSlug = context.params?.slug as string;
  const childparam = (context.params?.childId as string[]) || [];
  const mdBlocks:MdBlock[] = await PageDataService.getPageDataByPageId(childparam[0]);
  const singlePost:PostMetaData = await CurriculumService.getCurriculumById(currentSlug);
  const post ={
    mdBlocks,
    metadata:singlePost
  }
  const childPagesBySlug = await PageDataService.getPageDataByTypeAndCurriculumId('child_page',currentSlug);

  const links:string[] = [`/posts/post/${post.metadata.curriculumId}`];
  const pageNavs:pageNav[] = post.metadata.is_basic_curriculum ?
    [HOME_NAV,BASIC_NAV,{title:post.metadata.category,id:`/posts/course/${post.metadata.category}`},{title:post.metadata.title,id:`/posts/post/${post.metadata.curriculumId}`}]
    : [HOME_NAV,{title:post.metadata.category,id:`/posts/course/${post.metadata.category}`},{title:post.metadata.title,id:`/posts/post/${post.metadata.curriculumId}`}];
  for (let i = 0; i < childparam.length; i++) {
    const child = childPagesBySlug.filter((item)=>item.blockId===childparam[i]);
    if(child[0]!==undefined){
      links.push(child[0].blockId);
      let link = "";
      for(let k=0;k<links.length;k++){
        link = link + links[k];
      }
      pageNavs.push({title:child[0].data.replace("## ",""), id:link});
    }
  }
  const childNavs:pageNav[] = childPagesBySlug.sort((a,b)=>a.order - b.order).map((page)=>{
    return {
      title:page.data.split('## ')[1],
      id:page.blockId,
      child:true,
    }
  })
  return {
      props: {
          mdBlocks:mdBlocks,
          pageNavs,
          parentTitle:singlePost.title,
          childNavs,
          curriculumId:currentSlug,
      },
  };
};

const PostChildPage = ( props : Props) => {
    const {mdBlocks, pageNavs,parentTitle,childNavs,curriculumId} = props;
    const { setCurriculumId } = useCurriculumIdStore();

    useEffect(()=>{
      setCurriculumId(curriculumId);
    },[])

    return (
      <Layout headerProps={{pageNavs:pageNavs}} sideNavProps={{title:parentTitle,slug:curriculumId,childPages:childNavs}}>
        <div className='mt-24'>
          <section className="p-5 pb-10 md:w-3/4 bg-white">
            <h2 className="w-full text-2xl font-medium">
                {pageNavs[pageNavs.length - 1].title}
            </h2>
            <div className='border-b-2 mt-2'></div>
            {mdBlocks.map((mdBlock, i) => (
                <MdBlockComponent mdBlock={mdBlock} depth={0} key={i} />
            ))}
          </section>
          <div className='hidden md:block md:w-1/4 mt-5'>
            <SideBlock title={parentTitle} slug={curriculumId} childPages={childNavs} />
          </div>
        </div>
    </Layout>
    );
};
export default PostChildPage;