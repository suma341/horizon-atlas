import { GetStaticProps } from 'next';
import React from 'react'
import { PostMetaData } from '@/types/postMetaData';
import { MdBlock } from 'notion-to-md/build/types';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { getAllTags } from '@/lib/services/notionApiService';
import { pageNav } from '@/types/pageNav';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';

type postPath = {
  params: { slug:string }
}

type Props = {
  metadata:PostMetaData;
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
  allTags:string[];
  roleData:RoleData;
};

import fs from "fs";
import path from "path";
import { fetchRoleInfo } from '@/lib/fetchRoleInfo';
import { RoleData } from '@/types/role';

export const getStaticPaths = async () => {
  const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  const allPosts: PostMetaData[] = JSON.parse(jsonData);

  const paths: postPath[] = allPosts.map(({ slug }) => {
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

  // 各ページのJSONを読み込む
  const postPath = path.join(process.cwd(), "public", "notion_data", "eachPage", `${slug}`, "page.json");
  const postData = fs.readFileSync(postPath, "utf8");
  const parsedPostData = JSON.parse(postData);
  const mdBlocks:MdBlock[] = Array.isArray(parsedPostData) ? parsedPostData : parsedPostData.posts || []

  const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  const parsedData = JSON.parse(jsonData);

  const allPosts: PostMetaData[] = Array.isArray(parsedData) ? parsedData : parsedData.posts || [];
  if (!Array.isArray(allPosts)) {
    throw new Error("notionDatabase.jsonのデータが配列ではありません！");
  }
  const singlePost = allPosts.filter(item=>item.slug===slug);
  const post:post = {
    metadata:singlePost[0],
    mdBlocks
  } 

  const allTags = await getAllTags(allPosts);

  const courseNav: pageNav = { title: post.metadata.category, id: `/posts/course/${post.metadata.category}` };
  const postNav: pageNav = { title: post.metadata.title, id: `/posts/post/${slug}` };
  const pageNavs: pageNav[] = post.metadata.is_basic_curriculum
    ? [HOME_NAV, BASIC_NAV, courseNav, postNav]
    : post.metadata.category === ""
    ? [HOME_NAV, postNav]
    : [HOME_NAV, courseNav, postNav];
  const roleData = await fetchRoleInfo();
  return {
    props: {
      metadata: post.metadata,
      mdBlocks: post.mdBlocks,
      pageNavs,
      allTags,
      roleData
    },
  };
};


const Post =({ metadata, mdBlocks,pageNavs,allTags,roleData }: Props) => {
  return (
    <Layout headerProps={{pageNavs,allTags}} roleData={roleData}>
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