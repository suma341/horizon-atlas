import Navbar from "@/components/Navbar/navbar";
import SingleCourse from "@/components/Post/SingleCourse";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import {  getEitherCourses, getPostsByCourse } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import type { GetStaticProps,} from "next";

type Props={
    courseAndPosts: {
        course: string;
        posts: PostMetaData[];
    }[]
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async () => {
    const basicCourse = await getEitherCourses(true);
    const courseAndPosts = await Promise.all(basicCourse.map(async(course)=>{
        const posts = await getPostsByCourse(course);
        return {
            course,
            posts
        }
    }))

    return {
        props: {
            courseAndPosts,
        },
        revalidate: 50, // 50秒間隔でISRを実行
    };
};

const blogTagPageList = ({courseAndPosts }: Props)=> {
    return (
        <div className="container h-full w-full mx-auto font-mono">
            <Navbar pageNavs={[HOME_NAV,BASIC_NAV]} />
            <main className="container w-full mt-16 mb-3">
                <h1 className="text-5xl font-medium text-center mb-16">基礎班カリキュラム</h1>
                <section className="gap-3 mx-auto">
                    {courseAndPosts.map((courseAndPosts,i)=>
                        <SingleCourse course={courseAndPosts.course} posts={courseAndPosts.posts} key={i} />
                    )}
                </section>
            </main>
        </div>
        
    );
}

export default blogTagPageList;