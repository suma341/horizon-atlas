import Layout from "@/components/Layout/Layout";
import SingleCourse from "@/components/Post/SingleCourse";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import { getPostsByRole } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import type { GetStaticProps,} from "next";
import { CurriculumService } from "@/lib/services/CurriculumService";
import { useEffect, useState } from "react";
import { CategoryService } from "@/lib/services/CategoryService";
import { Category } from "@/types/category";
import useUserProfileStore from "@/stores/userProfile";
import Loader from "@/components/loader/loader";
import DynamicHead from "@/components/head/dynamicHead";

type Props={
    courseAndPosts: {
        category: Category;
        curriculums: PostMetaData[];
    }[];
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async () => {
    const basicCategories = await CategoryService.getBasicCategory()
    const categoryAndCurriculums = await Promise.all(basicCategories.map(async(c)=>{
        const curriculums = await CurriculumService.getCurriculumByCategory(c.title)
        return {
            category:c,
            curriculums
        }
    }))

    return {
        props: {
            courseAndPosts:categoryAndCurriculums
        } as Props
    };
};

export default function BasicCoursePageList({courseAndPosts}: Props){
    const [dataByRole,setDataByRole] = useState(courseAndPosts);
    const { userProfile } = useUserProfileStore()
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile ? (userProfile.given_name ?? "体験入部") : "ゲスト"
                const dataByRole:{
                    category: Category;
                    curriculums: PostMetaData[];
                }[] = [];
                for(const i of courseAndPosts){
                    const postsByRole = await getPostsByRole(usersRole,i.curriculums);
                    dataByRole.push({category:i.category,curriculums:postsByRole});
                }
                setDataByRole(dataByRole);
            }finally{
                setLoading(false)
            }
        }
        setData();
    },[courseAndPosts,userProfile])

    return (
        <>
            <DynamicHead
                title="基礎班カリキュラム"
                firstText="基礎班向けにプログラミングを１から学べます"
                image="https://raw.githubusercontent.com/Ryukoku-Horizon/notion2atlas/main/public/ogp/basic.png"
                link="https://ryukoku-horizon.github.io/horizon-atlas/posts/basic"
            />
            <Layout pageNavs={[HOME_NAV, BASIC_NAV]}>
                <div className="min-h-screen md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-white via-gray-100 to-purple-50 animate-gradient transition-all">
                    <main className="w-full md:max-w-5xl mx-auto text-center mt-24 md:mt-12">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text tracking-wide mb-16">
                            基礎班カリキュラム
                        </h1>
                        <section className="grid grid-cols-1 gap-8 px-6">
                            {!loading && dataByRole.filter((d)=>d.curriculums.length).sort((a,b)=>a.category.order - b.category.order).map((courseAndPosts, i) => {
                                return (
                                    <SingleCourse
                                    category={courseAndPosts.category}
                                    key={i}
                                    />
                                );
                            })}
                            {loading && <Loader size={20} />}
                        </section>
                    </main>
                </div>
            </Layout>
        </>

    );
}
