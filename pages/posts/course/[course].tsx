import type { GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import {  courseIsBasic, getPostsByRole } from "@/lib/services/notionApiService";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Layout from "@/components/Layout/Layout";
import { useEffect, useState } from "react";
import { CurriculumService } from "@/lib/services/CurriculumService";
import { CategoryService } from "@/lib/services/CategoryService";
import { Category } from "@/types/category";
import Image from "next/image";
import useUserProfileStore from "@/stores/userProfile";
import Loader from "@/components/loader/loader";
import DynamicHead from "@/components/head/dynamicHead";

type pagePath = {
    params: { course:string }
  }

export const getStaticPaths = async() =>{
    const allCategories = await CurriculumService.getAllCategories();
    const removedEmptyCourses = allCategories.filter((category)=>category!=='');

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
    categoryData:Category | undefined;
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async (context) => {
    const currentCourse:string = typeof context.params?.course == 'string' ? context.params.course: "";
    const posts = await CurriculumService.getCurriculumByCategory(currentCourse);
    const isBasic = await courseIsBasic(currentCourse,posts);
    const currentNav:pageNav = {title:currentCourse,link:`/posts/course/${currentCourse}`};
    const pageNavs = isBasic ? [HOME_NAV,BASIC_NAV,currentNav] :[HOME_NAV,currentNav];

    const allCategory = await CategoryService.getAllCategory()
    const targetCategory = allCategory.find((item)=>{
        return item.title === currentCourse
    })


    return {
        props: {
          posts,
          currentCourse,
          pageNavs,
          categoryData:targetCategory
        },
    };
};

const CoursePage = ({ posts, currentCourse,pageNavs,categoryData }: Props)=> {
    const [postsByRole, setPostsByRole] = useState(posts);
    const { userProfile } = useUserProfileStore();
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile?.given_name ?? "体験入部"
                const postsByRole = await getPostsByRole(usersRole,posts);
                setPostsByRole(postsByRole);
            }finally{
                setLoading(false)
            }
        }
        setData()
    },[posts,userProfile])

    return (
        <>
            <DynamicHead
                title={`${pageNavs[1]===BASIC_NAV ? "基礎班カリキュラム/" : ""}${currentCourse}`}
                firstText={categoryData?.description ?? ""}
                image={`https://ryukoku-horizon.github.io/horizon-atlas/ogp/category/${categoryData?.categoryId}.png`}
                link={`https://ryukoku-horizon.github.io/horizon-atlas/${pageNavs[pageNavs.length - 1].link}`}
            />
            <Layout pageNavs={pageNavs}> 
                <div className='pt-20 min-h-screen md:flex md:flex-col md:items-center '>
                    {categoryData && categoryData.cover !=="" && <Image src={categoryData.cover} alt={''} width={120} height={120} className='h-56 top-0' style={{width:"100vw"}} />}
                    <section className='bg-white pb-10 md:max-w-4xl px-2 md:min-w-[670px]' style={(!categoryData || categoryData.cover !=="") ? {} : {paddingTop:"4rem"}}>
                        {(!categoryData || categoryData.iconType ==="") && <Image src={"https://ryukoku-horizon.github.io/horizon-atlas/file_icon.svg"} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={categoryData && categoryData.cover !=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}} />}
                        {categoryData && categoryData.iconType !== "emoji" && categoryData.iconType!=="" && <Image src={categoryData.iconUrl} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={categoryData && categoryData.cover!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}} />}
                        {categoryData && categoryData.iconType === "emoji" && <p className='relative w-14 h-14 text-7xl' style={categoryData.cover!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}}>{categoryData.iconUrl}</p>}
                        <h2 className='w-full text-3xl font-bold'>{currentCourse}</h2>
                        <div className="mt-8">
                            <p>{categoryData?.description}</p>
                        </div>
                        {!loading && <div className="mt-8">
                            {postsByRole.map((post)=>{
                                return (
                                    <div key={post.curriculumId}>
                                        <SinglePost
                                        postData={post}
                                        />
                                    </div>
                                )
                            })}
                        </div>}
                        {loading && <Loader size={20} />}
                    </section>
                </div>
            </Layout>
        </>
    );
}

export default CoursePage;