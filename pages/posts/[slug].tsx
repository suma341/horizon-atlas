import { GetStaticProps } from 'next';
import { getAllPosts, getSinglePost } from '@/lib/notionAPI';
import React from 'react'
import { PostMetaData } from '@/types/postMetaData';
import { PostPageData } from '@/types/postPageData';
import ReactMarkDown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';

type postPath = {
  params: { slug:string }
}

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
  const slug = params?.slug as string; // `params?.slug` が確実に string 型であることを明示
  const post = await getSinglePost(slug);
  return {
    props: {
      post
    },
    revalidate: 60 * 5, // 5分間隔でISRを実行
  };
};

const Post =({ post }: PostPageData) => {
  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('コードをコピーしました！');
    } catch (err) {
      alert('コピーに失敗しました。');
    }
  };
  return (
    <section className='container lg;px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20'>
        <h2 className='w-full text-2xl font-medium'>{post.metadata.title}</h2>
        <div className='border-b-2 mt-2'></div>
        <span className='text-gray-500'>posted date at {post.metadata.date}</span>
        <br />
        {post.metadata.tags.map((tag:string)=>(
          <p className='text-white bg-sky-500 rounded-xl font-medium mt-2 px-2 inline-block mr-2'>{tag}</p>
        ))}
        <div className='mt-10 font-medium'>
        <ReactMarkDown
          components={{
            code({ node, inlist, className, children, ...props }) {
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
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}>{post.markdown.parent}</ReactMarkDown>  
          <Link href='/'>
            <span className='pd-20 block mt-3'>ホームに戻る</span>
          </Link>
        </div>
    </section>
  )
}

export default Post