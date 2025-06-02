import Layout from "@/components/Layout/Layout";
import SingleCourse from "@/components/Post/SingleCourse";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import {  getBasicCourses, getPostsByCourse, getPostsByRole } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import type { GetStaticProps,} from "next";
import { CurriculumService } from "@/lib/services/CurriculumService";
import { useEffect, useState } from "react";
import { CategoryService } from "@/lib/services/CategoryService";
import { Category } from "@/types/category";
import useUserProfileStore from "@/stores/userProfile";
import Loader from "@/components/loader/loader";

type Props={
    courseAndPosts: {
        course: string;
        posts: PostMetaData[];
    }[];
    categoryData:Category[]
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async () => {
    const basicPosts = await CurriculumService.getBasicCurriculum();
    const basicCourse = await getBasicCourses(basicPosts);
    const courseAndPosts = await Promise.all(basicCourse.map(async(course)=>{
        const posts = await getPostsByCourse(course,basicPosts);
        return {
            course,
            posts
        }
    }))
    const allCategory = await CategoryService.getAllCategory()
    const targetCategory = allCategory.filter((item)=>{
        return basicCourse.some((item2)=>item2===item.title)
    })

    return {
        props: {
            courseAndPosts,
            categoryData:targetCategory
        },
    };
};

export default function BasicCoursePageList({courseAndPosts,categoryData}: Props){
    const [dataByRole,setDataByRole] = useState(courseAndPosts);
    const { userProfile } = useUserProfileStore()
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile?.given_name ?? "体験入部"
                const dataByRole:{
                    course: string;
                    posts: PostMetaData[];
                }[] = [];
                for(const i of courseAndPosts){
                    const postsByRole = await getPostsByRole(usersRole,i.posts);
                    dataByRole.push({course:i.course,posts:postsByRole});
                }
                setDataByRole(dataByRole);
            }finally{
                setLoading(false)
            }
        }
        setData();
    },[courseAndPosts,userProfile])

    return (
        <Layout pageNavs={[HOME_NAV, BASIC_NAV]}>
            <div className="min-h-screen md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-white via-gray-100 to-purple-50 animate-gradient transition-all">
                <main className="w-full md:max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text tracking-wide mb-16">
                        基礎班カリキュラム
                    </h1>
                    <section className="grid grid-cols-1 gap-8 px-6">
                        {!loading && dataByRole.map((courseAndPosts, i) => {
                            if(courseAndPosts.posts.length!==0){
                                const target = categoryData.find(
                                    (item1) => item1.title === courseAndPosts.course
                                );
                                return (
                                    <SingleCourse
                                    course={courseAndPosts.course}
                                    icon={{ url: target?.iconUrl, type: target?.iconType }}
                                    key={i}
                                    />
                                );
                            }
                        })}
                        {loading && <Loader size={20} />}
                    </section>
                </main>
            </div>
            </Layout>


    );
}
