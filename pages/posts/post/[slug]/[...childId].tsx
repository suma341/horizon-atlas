import Navbar from '@/components/Navbar/navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import { getAllPosts, getChildPage, getSinglePost } from '@/lib/services/notionApiService';
import { pageNav } from '@/types/pageNav';
import { PostMetaData } from '@/types/postMetaData';
import { GetStaticProps } from 'next';
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';

type Props = {
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
  parentTitle:string;
  childNavs:pageNav[];
  slug:string;
};

type pagePath = {
  params: { slug:string, childId:string[] }
}

export const getStaticPaths = async () => {
  const allPosts: PostMetaData[] = await getAllPosts();
  const paths: pagePath[] = (
    await Promise.all(
      allPosts.map(async (post) => {
        const postData = await getSinglePost(post.slug);
        const childPages = postData.mdBlocks.filter((block)=>block.type==='child_page')
        return childPages.map((child) => ({
          params: {
            slug: post.slug,
            childId: [child.blockId],
          },
        }));
      })
    )
  ).flat();

  return {
    paths,
    fallback: 'blocking', // ISRを有効化
  };
};
export const getStaticProps: GetStaticProps = async (context) => {
    const currentSlug = context.params?.slug as string;
    const childparam = (context.params?.childId as string[]) || [];
    const post = await getSinglePost(currentSlug);

    let currentchild = post.mdBlocks;
    const pageNavs:pageNav[] = post.metadata.is_basic_curriculum ?
      [HOME_NAV,BASIC_NAV,{title:post.metadata.category,id:`/posts/course/${post.metadata.category}/1`,child:false},{title:post.metadata.title,id:post.metadata.slug,child:true}]
      : [HOME_NAV,{title:post.metadata.category,id:`/posts/course/${post.metadata.category}/1`,child:false},{title:post.metadata.title,id:post.metadata.slug,child:true}];
    for (let i = 0; i < childparam.length; i++) {
        const childpages = currentchild.filter((block)=>block.type==='child_page');
        const child = childpages.filter((block)=>block.blockId===childparam[i]);
        if(child[0]!==undefined){
            pageNavs.push({title:child[0].parent.replace("## ",""), id:child[0].blockId,child:true});
            currentchild = child[0].children;
        }
    }
    const childPages = getChildPage(post.mdBlocks);
    const childNavs:pageNav[] = childPages.map((page)=>{
      return {
        title:page.parent.split('## ')[1],
        id:page.blockId,
        child:true,
      }
    })

    return {
        props: {
            mdBlocks:currentchild,
            pageNavs,
            parentTitle:post.metadata.title,
            childNavs,
            slug:currentSlug
        },
    };
};

const PostChildPage = ( props : Props) => {
    const {mdBlocks, pageNavs,parentTitle,childNavs,slug} = props;
    return (
      <>
        <Navbar pageNavs={pageNavs} />
        <div className="flex">
            {childNavs.length!==0 && <Sidebar title={parentTitle} slug={slug} childPages={childNavs} />}
            <section className="container pr-5 mx-auto my-20 ml-10">
                <h2 className="my-2 font-bold text-3xl">
                    {pageNavs[pageNavs.length - 1].title}
                </h2>
                <div>
                    {mdBlocks.map((mdBlock, i) => (
                        <MdBlockComponent mdBlock={mdBlock} depth={0} key={i} />
                    ))}
                </div>
            </section>
        </div>
    </>
    );
};
export default PostChildPage;