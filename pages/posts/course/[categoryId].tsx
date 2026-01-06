import type { GetStaticProps } from "next";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Layout from "@/components/Layout/Layout";
import { CategoryService } from "@/lib/services/CategoryService";
import { Category } from "@/types/category";
import Loader from "@/components/loader/loader";
import DynamicHead from "@/components/head/dynamicHead";
import { PageInfo } from "@/types/page";
import PageInfoSvc from "@/lib/services/PageInfoSvc";
import { useAuth } from "@/hooks/useAuth";
import { CategoryMain } from "@/components/pageComponents/categoryMain";

type pagePath = {
    params: { categoryId:string }
}

export const getStaticPaths = async() =>{
    const allCategories = await CategoryService.getAllCategory()

    const paramsList: pagePath[] = (
        await Promise.all(
            allCategories.filter((c)=>c.id!=="answer").map(async (category) => {
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
    posts:PageInfo[];
    pageNavs:pageNav[];
    category:Category
}

export const getStaticProps: GetStaticProps = async (context) => {
    const currentId = context.params?.categoryId as string
    const category = await CategoryService.getCategoryById(currentId)
    if(!category){
        throw new Error(`カテゴリーデータが見つかりません:${currentId}`)
    }
    const posts = await PageInfoSvc.getCurriculumByCategory(category.title);

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
    const {userProfile,loading,dotCount} = useAuth()
    const dot = ".".repeat(dotCount)

    return (
        <>
            <DynamicHead
                title={`${pageNavs[1]===BASIC_NAV ? "基礎班カリキュラム/" : ""}${category.title}`}
                firstText={category.description}
                image={`${process.env.NEXT_PUBLIC_STORAGE_URL}/ogp/${category.id}.png`}
                link={`https://ryukoku-horizon.github.io/horizon-atlas/${pageNavs[pageNavs.length - 1].link}`}
            />
            <Layout pageNavs={pageNavs}> 
                {!loading && <CategoryMain
                    posts={posts}
                    userProfile={userProfile}
                    category={category}
                />}
                {loading && <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
                    <Loader size={80} />
                    <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
                </div>}
            </Layout>
        </>
    );
}

export default CoursePage;