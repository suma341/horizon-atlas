import Head from "next/head";
import { getAllTags, getNumberOfPages,  getPostsByTagAndPage } from "@/lib/notionAPI";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import Tags from "@/components/tag/Tags";

type pagePath = {
    params: { tag:string, page:string }
  }

export const getStaticPaths = async() =>{
    const allTags = await getAllTags();

     const paramsList: pagePath[] = (
        await Promise.all(
            allTags.map(async (tag: string) => {
                const numberOfPagesByTag = await getNumberOfPages(tag);
                return Array.from({ length: numberOfPagesByTag }, (_, i) => ({
                    params: { tag: tag, page: (i + 1).toString() },
                }));
            })
        )
    ).flat();
    return {
        paths:paramsList,
        fallback:'blocking'
    }
  }

// getStaticProps関数
export const getStaticProps: GetStaticProps = async (context) => {
    const currentPage:string = typeof context.params?.page == 'string' ? context.params.page : "1";
    const currentTag:string = typeof context.params?.tag == 'string' ? context.params.tag : "";
    const numberOfPages:number = await getNumberOfPages(currentTag);
    const allTags = await getAllTags();
    // console.log(numberOfPages);

    const posts:PostMetaData[] = await getPostsByTagAndPage(currentTag, parseInt(currentPage, 10));
    return {
        props: {
          posts,
          numberOfPages,
          currentPage,
          currentTag,
          allTags
        },
        revalidate: 60 * 5, // 5分間隔でISRを実行
    };
};

const blogTagPageList = ({ posts,numberOfPages,currentPage, currentTag, allTags }: InferGetStaticPropsType<typeof getStaticProps>)=> {
    return (
        <div className="container h-full w-full mx-auto font-mono">
        <Head>
            <title>Notion blog</title>
        </Head>
        <main className="container w-full mt-16">
            <h1 className="text-5xl font-medium text-center mb-16">NotionBlog</h1>
            <section className="sm:grid grid-cols-2 gap-3 mx-auto">
                {posts.map((post:PostMetaData, i:number)=>(
                <div key={i}>
                    <SinglePost
                    id={post.id}
                    title={post.title} 
                    description={post.description}
                    date={post.date}
                    tags={post.tags}
                    slug={post.slug}
                    isPagenationPage={true}
                    />
                </div>
                ))}
            </section>
        </main>
        <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} tag={currentTag} />
        <Tags allTags={allTags} />
        </div>
        
    );
}

export default blogTagPageList;