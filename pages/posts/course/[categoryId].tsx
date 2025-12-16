import type { GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import { getPostsByRole } from "@/lib/services/notionApiService";
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
    params: { categoryId:string }
}

export const getStaticPaths = async() =>{
    const allCategories = await CategoryService.getAllCategory()

    const paramsList: pagePath[] = (
        await Promise.all(
            allCategories.map(async (category) => {
                return  { params: { categoryId: category.id } }
            })
        )
    );
    return {
        paths:paramsList,
        fallback:'blocking'
    }
  }

type Props={
    posts:PostMetaData[];
    pageNavs:pageNav[];
    category:Category
}

export const getStaticProps: GetStaticProps = async (context) => {
    const currentId = context.params?.categoryId as string
    const category = await CategoryService.getCategoryById(currentId)
    if(!category){
        throw new Error(`カテゴリーデータが見つかりません:${currentId}`)
    }
    const posts = await CurriculumService.getCurriculumByCategory(category.title);

    const currentNav:pageNav = {title:category.title,link:`/posts/course/${currentId}`};
    const pageNavs = category.is_basic_curriculum ? [HOME_NAV,BASIC_NAV,currentNav] :[HOME_NAV,currentNav];

    return {
        props: {
          posts,
          pageNavs,
          category
        } as Props
    };
};

const CoursePage = ({ posts,pageNavs,category }: Props)=> {
    const [postsByRole, setPostsByRole] = useState(posts);
    const { userProfile } = useUserProfileStore();
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile ? (userProfile.given_name ?? "体験入部") : "ゲスト"
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
                title={`${pageNavs[1]===BASIC_NAV ? "基礎班カリキュラム/" : ""}${category.title}`}
                firstText={category.description}
                image={`https://raw.githubusercontent.com/Ryukoku-Horizon/notion2atlas/main/public/ogp/${category.id}.png`}
                link={`https://ryukoku-horizon.github.io/horizon-atlas/${pageNavs[pageNavs.length - 1].link}`}
            />
            <Layout pageNavs={pageNavs}> 
                <div className='pt-20 min-h-screen md:flex md:flex-col md:items-center '>
                    {category.coverUrl !=="" && <Image src={category.coverUrl} alt={''} width={120} height={120} className='h-56 top-0' style={{width:"100vw"}} />}
                    <section className='bg-white pb-10 md:max-w-4xl px-2 md:min-w-[670px]' style={(category.coverUrl !=="") ? {} : {paddingTop:"4rem"}}>
                        {category.iconType ==="" && <Image src={"https://ryukoku-horizon.github.io/horizon-atlas/file_icon.svg"} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={category.coverUrl !=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}} />}
                        {category.iconType !== "emoji" && category.iconType!=="" && <Image src={category.iconUrl} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={category.coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}} />}
                        {category.iconType === "emoji" && <p className='relative w-14 h-14 text-7xl' style={category.coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.5rem"}}>{category.iconUrl}</p>}
                        <h2 className='w-full text-3xl font-bold'>{category.title}</h2>
                        <div className="mt-8">
                            <p>{category.description}</p>
                        </div>
                        {!loading && <div className="mt-8">
                            {postsByRole.map((post)=>{
                                return (
                                    <div key={post.curriculumId}>
                                        <SinglePost
                                        postData={{...post,id:post.curriculumId}}
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