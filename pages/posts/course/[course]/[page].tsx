import type { GetStaticProps, InferGetStaticPropsType } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import { getAllCourses, getNumberOfPages, getPostsByCourseAndPage } from "@/lib/services/notionApiService";

type pagePath = {
    params: { course:string, page:string }
  }

export const getStaticPaths = async() =>{
    const allCourses = await getAllCourses();
    const removedEmptyCourses = allCourses.filter((course)=>course!=='');

     const paramsList: pagePath[] = (
        await Promise.all(
            removedEmptyCourses.map(async (course: string) => {
                const numberOfPagesByTag = await getNumberOfPages(undefined,course);
                return Array.from({ length: numberOfPagesByTag }, (_, i) => ({
                    params: { course: course, page: (i + 1).toString() },
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
    const currentCourse:string = typeof context.params?.course == 'string' ? context.params.course: "";
    const numberOfPages:number = await getNumberOfPages(undefined,currentCourse);
    // console.log(numberOfPages);

    const posts:PostMetaData[] = await getPostsByCourseAndPage(currentCourse, parseInt(currentPage, 10));
    return {
        props: {
          posts,
          numberOfPages,
          currentPage,
          currentCourse,
        },
        revalidate: 50, // 50秒間隔でISRを実行
    };
};

const blogTagPageList = ({ posts,numberOfPages,currentPage, currentCourse}: InferGetStaticPropsType<typeof getStaticProps>)=> {
    return (
        <div className="container h-full w-full mx-auto font-mono">
        <main className="container w-full mt-16 mb-3">
            <h1 className="text-5xl font-medium text-center mb-16">{currentCourse}</h1>
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
        <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} course={currentCourse} />
        </div>
        
    );
}

export default blogTagPageList;