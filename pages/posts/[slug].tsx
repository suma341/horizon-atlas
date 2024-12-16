import { GetStaticProps } from 'next';
import { getAllPosts, getSinglePost } from '@/lib/notionAPI';
import React from 'react'
import { PostMetaData } from '@/types/postMetaData';
import ReactMarkDown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import BackButton from '@/components/BackButton/BackButton';
import { MdBlock } from 'notion-to-md/build/types';

type postPath = {
  params: { slug:string }
}

type Props = {
  post: {
    metadata:PostMetaData,
    markdown: { parent:string },
    mdBlocks:MdBlock[]
  };
};

export const getStaticPaths = async() =>{
  const allPosts:PostMetaData[] = await getAllPosts();
  const paths:postPath[] = allPosts.map(({slug})=>{
    return { params: { slug: slug } };
  })
  return {
    paths,
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string; 
  const post = await getSinglePost(slug);
  return {
    props: {
      post
    },
    revalidate: 50, // 50秒間隔でISRを実行
  };
};

const Post =({ post }: Props) => {
  console.log(post.mdBlocks);
  const handleCopy = async (code: string) => {
      await navigator.clipboard.writeText(code);
      alert('コードをコピーしました！');
  };
  return (
    <section className='container lg;px-2 px-5 mx-auto mt-20'>
        <h2 className='w-full text-2xl font-medium'>{post.metadata.title}</h2>
        <div className='border-b-2 mt-2'></div>
        <span className='text-gray-500'>posted date at {post.metadata.date}</span>
        <br />
        {post.metadata.tags.map((tag:string,i:number)=>(
          <p className='text-white bg-sky-500 rounded-xl font-medium mt-2 px-2 inline-block mr-2' key={i}>
            {tag}
            </p>
        ))}
        <div className='mt-10 font-medium'>
        <ReactMarkDown
          components={{
            code({ inlist, className, children }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeContent = String(children).replace(/\n$/, '');
              return !inlist && match ? (
                <div className="relative">
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    style={vscDarkPlus}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => handleCopy(codeContent)}
                    className="absolute top-2 right-2 bg-gray-700 text-white text-sm px-2 py-1 rounded">
                    Copy
                  </button>
                </div>
              ) : (
                <code>
                  {children}
                </code>
              )
            }
          }}>{post.markdown.parent}</ReactMarkDown>  
          <BackButton />
        </div>
    </section>
  )
}

export default Post