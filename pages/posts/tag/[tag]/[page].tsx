import type { GetStaticProps, InferGetStaticPropsType } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import { getAllTags, getNumberOfPages, getPostsByTagAndPage } from "@/lib/services/notionApiService";
import Navbar from "@/components/Navbar/navbar";
import { HOME_NAV, SEARCH_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";

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
    // console.log(numberOfPages);

    const posts:PostMetaData[] = await getPostsByTagAndPage(currentTag, parseInt(currentPage, 10));
    return {
        props: {
          posts,
          numberOfPages,
          currentPage,
          currentTag,
        },
        revalidate: 50, // 50秒間隔でISRを実行
    };
};

const blogTagPageList = ({ posts,numberOfPages,currentPage, currentTag}: InferGetStaticPropsType<typeof getStaticProps>)=> {
    const tagSearchNav:pageNav = {title:`タグ検索：${currentTag}`,id:`/posts/tag/${currentTag}/${currentPage}`,child:false};
    return (
        <>
            <Navbar pageNavs={[HOME_NAV,SEARCH_NAV,tagSearchNav]} />
            <div className="container h-full w-full mx-auto font-mono">
            <main className="container w-full mt-16 mb-3">
                <section className="sm:grid grid-cols-2 gap-3 mx-auto">
                    {posts.map((post:PostMetaData, i:number)=>(
                    <div key={i}>
                        <SinglePost
                        id={post.id}
                        title={post.title} 
                        date={post.date}
                        tags={post.tags}
                        slug={post.slug}
                        isPagenationPage={true}
                        course={post.course}
                        is_basic_curriculum={post.is_basic_curriculum}
                        />
                    </div>
                    ))}
                </section>
            </main>
            <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} tag={currentTag} />
            </div>
        </>
    );
}

export default blogTagPageList;