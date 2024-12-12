import Head from "next/head";
import { getAllTags, getPostsForTopPage } from "@/lib/notionAPI";
import type { GetStaticProps} from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Link from "next/link";
import Tags from "@/components/tag/Tags";

type Props = {
  fourPosts:PostMetaData[]
  allTags:string[]
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async () => {
  const fourPosts: PostMetaData[] = await getPostsForTopPage();
  const allTags:string[] = await getAllTags();
  return {
    props: {
      fourPosts,
      allTags
    },
    revalidate: 50, // 50秒間隔でISRを実行
  };
};

// Homeコンポーネント
export default function Home({ fourPosts, allTags }: Props) {
  return (
    <div className="container h-full w-full mx-auto">
      <Head>
        <title>Notion blog</title>
      </Head>
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">NotionBlog</h1>
        {fourPosts.map((post:PostMetaData,i:number)=>(
          <div className="mx4" key={i}>
            <SinglePost
              id={post.id}
              title={post.title} 
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
              isPagenationPage={false}
            />
          </div>
        ))}
      </main>
      <Link href="/posts/page/1" className="mb-6 lg:w-1/2 mx-auto rounded-md px-5 block text-right">
        ...もっと見る
      </Link>
      <Tags allTags={allTags} />
    </div>
  );
}
