import Layout from "@/components/Layout/Layout";
import SingleCourse from "@/components/Post/SingleCourse";
import BasicCurriculum from "@/components/Post/basicCurriculum";
import { HOME_NAV } from "@/constants/pageNavs";
import {  getAllTags, getEitherCourses, getPostsByCourse } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import { GetStaticProps } from "next";
import path from "path";
import fs from "fs";

type Props = {
  courseAndPosts:{
    course: string;
    posts:PostMetaData[];
  }[];
  allTags:string[];
};

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  const allPosts: PostMetaData[] = JSON.parse(jsonData);
  // const allPosts = await getAllPosts();
  const notBasicCourses = await getEitherCourses(false,allPosts);
  const removeEmptyCourses = notBasicCourses.filter((course)=>course!=="")
  const courseAndPosts = await Promise.all(removeEmptyCourses.map(async(course)=>{
    const posts = await getPostsByCourse(course,allPosts);
    return {
        course,
        posts
    }
  }))
  const allTags = await getAllTags(allPosts);
  return {
      props: {
        courseAndPosts,
        allTags
      },
      // revalidate: 600
  };
};

const PostsPage = ({ courseAndPosts,allTags }: Props)=> {
    return (
      <Layout headerProps={{pageNavs:[HOME_NAV],allTags:allTags}}>  
        <div className="container h-full w-full mx-auto font-mono pt-20">
        <main className="container w-full mt-16 mb-3">
          <h1 className="text-5xl font-medium text-center mb-16"></h1>
          <section className="gap-3 mx-auto">
            <BasicCurriculum />
            {courseAndPosts.map((courseAndPosts,i)=>{
              return <SingleCourse course={courseAndPosts.course} posts={courseAndPosts.posts} key={i} />
            })}
          </section>
        </main>
      </div>
      <div className="mb-40"></div>
      </Layout>
    );
  }

  export default  PostsPage;