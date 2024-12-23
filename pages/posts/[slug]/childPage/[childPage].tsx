import { GetStaticProps } from 'next';
import { getAllPosts, getChildPage, getSinglePost } from '@/lib/notionAPI';
import React from 'react'
import { PostMetaData } from '@/types/postMetaData';
import BackButton from '@/components/BackButton/BackButton';
import { MdBlock } from 'notion-to-md/build/types';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';

type Props = {
  slug:string,
  page:string,
  mdBlocks:MdBlock
};

type pagePath = {
  params: { slug:string, childPage:string }
}

export const getStaticPaths = async () => {
  const allPosts: PostMetaData[] = await getAllPosts();

  const paths: pagePath[] = (
    await Promise.all(
      allPosts.map(async (post) => {
        const postData = await getSinglePost(post.slug);
        const childPages = postData.mdBlocks.filter((block)=>block.type==='child_page');
        return childPages.map((child) => ({
          params: {
            slug: post.slug,
            childPage: child.parent,
          },
        }));
      })
    )
  ).flat();

  console.log("paths",paths);

  return {
    paths,
    fallback: 'blocking', // ISRを有効化
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const currentSlug = context.params?.slug as string;
  const childparam = context.params?.childPage as string;
  const post = await getSinglePost(currentSlug);

  const childPages = post.mdBlocks.filter((block)=>block.type==='child_page');
  const targetPage = childPages.filter((page)=>page.parent===`## ${childparam}`);

  // if(childparam.length!==0){
  //   for(let i=0;i<childparam.length;i++){
  //     const mdBlocks = currentchild;
  //     const childPages = mdBlocks.filter((block)=>block.type==='child_page');
      // const normalizeString = (str: string) =>
      //   str.replace(/[\s\r\n\t]+/g, " ").trim().normalize("NFC");
      // const isEqual = (str1: string, str2: string) =>
      //   normalizeString(str1) === normalizeString(str2);
      // const child = childPages.filter((childPage)=>isEqual(childPage.parent,`## ${childparam[i]}`));

  //     const child =  childPages.filter((childPage)=>childPage.parent===`## ${childparam[i]}`);

  //     currentchild = child;
  //   }
  // }

  return {
    props: {
      page: childparam,
      slug: currentSlug,
      mdBlocks:targetPage[0]
    },
    revalidate: 50, // ISR
  };
};

const PostChildPage = ({ slug,page,mdBlocks }: Props) => {
  console.log("slug",slug);
  console.log("page",page);
  console.log("mdBlocks",mdBlocks);

  return (
    <section className="container lg:px-10 px-20 mx-auto mt-20">
        <div>
          {mdBlocks.children.map((mdBlock, i)=>(
            <MdBlockComponent mdBlock={mdBlock} depth={0} key={i} />
          ))}
        </div>
        <BackButton />
    </section>
  );
};

export default PostChildPage;