import Navbar from '@/components/Navbar/navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import { getAllPosts, getChildPage, getSinglePost } from '@/lib/services/notionApiService';
import { pageNav } from '@/types/pageNav';
import { PostMetaData } from '@/types/postMetaData';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { MdBlock } from 'notion-to-md/build/types';
import React, { useEffect, useState } from 'react';

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
    const links:string[] = [`/posts/post/${post.metadata.slug}`];
    const pageNavs:pageNav[] = post.metadata.is_basic_curriculum ?
      [HOME_NAV,BASIC_NAV,{title:post.metadata.category,id:`/posts/course/${post.metadata.category}/1`,child:false},{title:post.metadata.title,id:`/posts/post/${post.metadata.slug}`,child:false}]
      : [HOME_NAV,{title:post.metadata.category,id:`/posts/course/${post.metadata.category}/1`,child:false},{title:post.metadata.title,id:`/posts/post/${post.metadata.slug}`,child:false}];
    for (let i = 0; i < childparam.length; i++) {
      const childpages = currentchild.filter((block)=>block.type==='child_page');
      const child = childpages.filter((block)=>block.blockId===childparam[i]);
      if(child[0]!==undefined){
        links.push(child[0].blockId);
        let link = "";
        for(let k=0;k<links.length;k++){
          link = link + links[k];
        }
        pageNavs.push({title:child[0].parent.replace("## ",""), id:link,child:false});
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
    const [mdBlock, setMdBlock] = useState<MdBlock[]>(mdBlocks);
    const [loading,setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
      const getMdBlocks = async () => {
        const res = await fetch(`/api/post/getMdBlocks?slug=${slug}`);
        setLoading(true);
        if(res.ok){
            const {mdBlocks}:{mdBlocks:MdBlock[]} = await res.json();
            const childparam = router.asPath.split("/").filter(item => item.trim() !== "").slice(3);
            let currentchild:MdBlock[] = mdBlocks;
            for (let i = 0; i < childparam.length; i++) {
                const childpages = currentchild.filter((block)=>block.type==='child_page');
                const child = childpages.filter((block)=>block.blockId===childparam[i]);
                if(child[0]!==undefined){
                    currentchild = child[0].children;
                }
            }
            setMdBlock(currentchild);
            console.log("page update");
        }
        setLoading(false);
      };
      getMdBlocks();
    }, []);

    return (
      <>
        <Navbar pageNavs={pageNavs} />
        <div className="flex mx-2">
            {childNavs.length!==0 && <Sidebar title={parentTitle} slug={slug} childPages={childNavs} />}
            <section className="container px-5 my-20">
                <h2 className="my-2 font-bold text-3xl">
                    {pageNavs[pageNavs.length - 1].title}
                </h2>
                <div>
                    {loading && <div>Loading...</div>}
                    {mdBlock.map((mdBlock, i) => (
                        <MdBlockComponent mdBlock={mdBlock} depth={0} key={i} />
                    ))}
                </div>
            </section>
        </div>
    </>
    );
};
export default PostChildPage;