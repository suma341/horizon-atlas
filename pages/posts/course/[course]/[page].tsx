import type { GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import { courseIsBasic, getAllCourses, getAllTags, getNumberOfPages, getPostsByCourseAndPage } from "@/lib/services/notionApiService";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Layout from "@/components/Layout/Layout";
import fs from "fs";
import path from "path";

type pagePath = {
    params: { course:string, page:string }
  }

export const getStaticPaths = async() =>{
    const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const allPosts: PostMetaData[] = JSON.parse(jsonData);
    // const allPosts = await getAllPosts();
    const allCourses = await getAllCourses(allPosts);
    const removedEmptyCourses = allCourses.filter((course)=>course!=='');

     const paramsList: pagePath[] = (
        await Promise.all(
            removedEmptyCourses.map(async (course: string) => {
                const numberOfPagesByTag = await getNumberOfPages(allPosts,undefined,course);
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
    allTags:string[];
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async (context) => {
    const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const allPosts: PostMetaData[] = JSON.parse(jsonData);
    const currentPage:string = typeof context.params?.page == 'string' ? context.params.page : "1";
    const currentCourse:string = typeof context.params?.course == 'string' ? context.params.course: "";
    // const allPosts = await getAllPosts();
    const allTags = await getAllTags(allPosts);
    const numberOfPages:number = await getNumberOfPages(allPosts,undefined,currentCourse);
    const isBasic = await courseIsBasic(currentCourse,allPosts);
    const currentNav:pageNav = {title:currentCourse,id:`/posts/course/${currentCourse}/1`};
    const pageNavs = isBasic ? [HOME_NAV,BASIC_NAV,currentNav] :[HOME_NAV,currentNav];
    // console.log(numberOfPages);

    const posts:PostMetaData[] = await getPostsByCourseAndPage(currentCourse, parseInt(currentPage, 10),allPosts);
    return {
        props: {
          posts,
          numberOfPages,
          currentPage,
          currentCourse,
          pageNavs,
          allTags,
        },
    };
};

const CoursePage = ({ posts,numberOfPages,currentPage, currentCourse,pageNavs,allTags}: Props)=> {
    return (
        <Layout headerProps={{pageNavs,allTags:allTags}}> 
            <div className="h-full w-full mx-auto font-mono pt-20">
                <main className="w-full mt-16 mb-3">
                    <h1 className="text-5xl font-medium text-center mb-16">{currentCourse}</h1>
                    <section className="mx-auto">
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
        </Layout>
    );
}

export default CoursePage;