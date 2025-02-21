import Layout from "@/components/Layout/Layout";
import SingleCourse from "@/components/Post/SingleCourse";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import {  getAllTags, getEitherCourses, getPostsByCourse } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import type { GetStaticProps,} from "next";
import fs from "fs";
import path from "path";
import { RoleData } from "@/types/role";
import { fetchRoleInfo } from "@/lib/fetchRoleInfo";

type Props={
    courseAndPosts: {
        course: string;
        posts: PostMetaData[];
    }[];
    allTags:string[];
    roleData:RoleData;
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async () => {
    const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const allPosts: PostMetaData[] = JSON.parse(jsonData);
    // const allPosts = await getAllPosts();
    const allTags = await getAllTags(allPosts);
    const basicCourse = await getEitherCourses(true,allPosts);
    const courseAndPosts = await Promise.all(basicCourse.map(async(course)=>{
        const posts = await getPostsByCourse(course,allPosts);
        return {
            course,
            posts
        }
    }))
    const roleData = await fetchRoleInfo();

    return {
        props: {
            courseAndPosts,
            allTags,
            roleData
        },
    };
};

const blogTagPageList = ({courseAndPosts,allTags,roleData}: Props)=> {
    return (
        <Layout headerProps={{pageNavs:[HOME_NAV,BASIC_NAV],allTags}} roleData={roleData}>
            <div className="h-full w-full mx-auto font-mono pt-20 ">
                <main className="w-full mt-16 mb-3">
                    <h1 className="text-5xl font-medium text-center mb-16">基礎班カリキュラム</h1>
                    <section className="gap-3 mx-auto">
                        {courseAndPosts.map((courseAndPosts,i)=>
                            <SingleCourse course={courseAndPosts.course} posts={courseAndPosts.posts} key={i} />
                        )}
                    </section>
                </main>
            </div>
        </Layout>  
    );
}

export default blogTagPageList;