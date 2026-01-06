import { useEffect, useState } from "react";
import Loader from "../loader/loader";
import SingleCourse from "../Post/SingleCourse";
import { Category } from "@/types/category";
import { PageInfo } from "@/types/page";
import { getPostsByRole } from "@/lib/services/notionApiService";
import { Profile } from "@/types/profile";

type Props={
    courseAndPosts: {
        category: Category;
        curriculums: PageInfo[];
    }[]
    userProfile:Profile | null
}

export const BasicMain=({courseAndPosts,userProfile}:Props)=>{
    const [dataByRole,setDataByRole] = useState(courseAndPosts);
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile ? (userProfile.given_name ?? "体験入部") : "ゲスト"
                const dataByRole:{
                    category: Category;
                    curriculums: PageInfo[];
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
    )
}