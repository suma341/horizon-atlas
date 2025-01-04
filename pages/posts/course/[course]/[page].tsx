import type { GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import { courseIsBasic, getAllCourses, getNumberOfPages, getPostsByCourseAndPage } from "@/lib/services/notionApiService";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Navbar from "@/components/Navbar/navbar";

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

type Props={
    posts:PostMetaData[];
    numberOfPages:number;
    currentPage:string;
    currentCourse:string;
    pageNavs:pageNav[];
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async (context) => {
    const currentPage:string = typeof context.params?.page == 'string' ? context.params.page : "1";
    const currentCourse:string = typeof context.params?.course == 'string' ? context.params.course: "";
    const numberOfPages:number = await getNumberOfPages(undefined,currentCourse);
    const isBasic = await courseIsBasic(currentCourse);
    const currentNav:pageNav = {title:currentCourse,id:`/posts/course/${currentCourse}/1`,child:false};
    const pageNavs = isBasic ? [HOME_NAV,BASIC_NAV,currentNav] :[HOME_NAV,currentNav];
    // console.log(numberOfPages);

    const posts:PostMetaData[] = await getPostsByCourseAndPage(currentCourse, parseInt(currentPage, 10));
    return {
        props: {
          posts,
          numberOfPages,
          currentPage,
          currentCourse,
          pageNavs,
        },
        revalidate: 50, // 50秒間隔でISRを実行
    };
};

const blogTagPageList = ({ posts,numberOfPages,currentPage, currentCourse,pageNavs}: Props)=> {
    return (
        <div className="container h-full w-full mx-auto font-mono">
            <Navbar pageNavs={pageNavs} />
            <main className="container w-full mt-16 mb-3">
                <h1 className="text-5xl font-medium text-center mb-16">{currentCourse}</h1>
                <section className="sm:grid grid-cols-2 gap-3 mx-auto">
                    {posts.map((post:PostMetaData, i:number)=>(
                    <div key={i}>
                        <SinglePost
                        postData={post}
                        isPagenationPage={true}
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