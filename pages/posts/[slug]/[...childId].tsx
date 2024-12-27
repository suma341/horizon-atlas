import BackButton from '@/components/BackButton/BackButton';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { getAllPosts, getSinglePost } from '@/lib/dataAccess/notionApiGateway';
import { PostMetaData } from '@/types/postMetaData';
import { GetStaticProps } from 'next';
import { MdBlock } from 'notion-to-md/build/types';
import React from 'react';

type Props = {
  slug:string,
  page:string[],
  mdBlocks:MdBlock[]
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
    for (let i = 0; i < childparam.length; i++) {
        const childpages = currentchild.filter((block)=>block.type==='child_page');
        const child = childpages.filter((block)=>block.blockId===childparam[i]);
        if(child[0]!==undefined){
            currentchild = child[0].children;
        }
        console.log(child[0].children);
    }
    
    return {
        props: {
            page: childparam,
            slug: currentSlug,
            mdBlocks:currentchild
        },
        revalidate: 50, // ISR
    };
};
const PostChildPage = ( props : Props) => {
    const {slug, page, mdBlocks} = props;
    console.log("slug",slug);
    console.log("page",page);
    console.log("mdBlocks",mdBlocks);
  return (
    <section className="container lg:px-10 px-20 mx-auto mt-20">
        <div>
            {mdBlocks.map((mdBlock, i)=>(
                <MdBlockComponent mdBlock={mdBlock} depth={0} key={i} />
            ))}
        </div>
        <BackButton />
    </section>
  );
};
export default PostChildPage;