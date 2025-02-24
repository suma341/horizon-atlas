import type { GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import { calculatePageNumber, courseIsBasic, getAllCourses, getAllTags, getPostsByCourse } from "@/lib/services/notionApiService";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Layout from "@/components/Layout/Layout";
import { RoleData } from "@/types/role";
import { fetchRoleInfo } from "@/lib/fetchRoleInfo";
import { useState } from "react";
import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage";
import { getAllCurriculum } from "@/lib/services/CurriculumService";

type pagePath = {
    params: { course:string }
  }

export const getStaticPaths = async() =>{
    const allPosts:PostMetaData[] = await getAllCurriculum();
    const allCourses = await getAllCourses(allPosts);
    const removedEmptyCourses = allCourses.filter((course)=>course!=='');

     const paramsList: pagePath[] = (
        await Promise.all(
            removedEmptyCourses.map(async (course: string) => {
                return  { params: { course: course } }
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
    currentCourse:string;
    pageNavs:pageNav[];
    allTags:string[];
    roleData:RoleData;
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async (context) => {
    const allPosts:PostMetaData[] = await getAllCurriculum();
    const currentCourse:string = typeof context.params?.course == 'string' ? context.params.course: "";
    // const allPosts = await getAllPosts();
    const allTags = await getAllTags(allPosts);
    const isBasic = await courseIsBasic(currentCourse,allPosts);
    const currentNav:pageNav = {title:currentCourse,id:`/posts/course/${currentCourse}`};
    const pageNavs = isBasic ? [HOME_NAV,BASIC_NAV,currentNav] :[HOME_NAV,currentNav];
    // console.log(numberOfPages);

    const posts:PostMetaData[] = await getPostsByCourse(currentCourse, allPosts);
    const roleData = await fetchRoleInfo();
    return {
        props: {
          posts,
          currentCourse,
          pageNavs,
          allTags,
          roleData
        },
    };
};

const CoursePage = ({ posts, currentCourse,pageNavs,allTags,roleData}: Props)=> {
    const [currentPage, setCurrentPage] = useState(1);
    const numberOfPages = calculatePageNumber(posts);
    const postsPerPage = NUMBER_OF_POSTS_PER_PAGE;

    return (
        <Layout headerProps={{pageNavs,allTags:allTags}} roleData={roleData}> 
            <div className="h-full w-full mx-auto font-mono pt-20">
                <main className="w-full mt-16 mb-3">
                    <h1 className="text-5xl font-medium text-center mb-16">{currentCourse}</h1>
                    <section className="mx-auto">
                        {posts.slice(postsPerPage * (currentPage - 1), postsPerPage * currentPage).map((post:PostMetaData, i:number)=>(
                        <div key={i}>
                            <SinglePost
                            postData={post}
                            isPagenationPage={true}
                            />
                        </div>
                        ))}
                    </section>
                </main>
                <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} setPage={setCurrentPage} />
            </div>
        </Layout>
    );
}

export default CoursePage;