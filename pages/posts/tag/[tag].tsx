import type { GetStaticProps } from "next";
import {  getAllTags, getPostsByTag } from "@/lib/services/notionApiService";
import { HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Layout from "@/components/Layout/Layout";
import Loader from "@/components/loader/loader";
import StaticHead from "@/components/head/staticHead";
import { PageInfo } from "@/types/page";
import PageInfoSvc from "@/lib/services/PageInfoSvc";
import { TagMain } from "@/components/pageComponents/tagMain";
import { useAuth } from "@/hooks/useAuth";
import { VersionGW } from "@/lib/Gateways/VersionGW";

type pagePath = {
    params: { tag:string }
  }

export const getStaticPaths = async() =>{

    const allPosts:PageInfo[] = await PageInfoSvc.getBaseCurriculum()
    const allTags = await getAllTags(allPosts)

     const paramsList: pagePath[] = (
        await Promise.all(
            allTags.filter((t)=>t!=="解答").map(async (tag) => {
                return { params: { tag } }
            })
        )
    ).flat();
    return {
        paths:paramsList,
        fallback: false,
    }
  }

type Props ={
    posts:PageInfo[];
    currentTag:string;
    allTags:string[];
    v:string
}

export const getStaticProps: GetStaticProps = async (context) => {
    const allPosts:PageInfo[] = await PageInfoSvc.getBaseCurriculum()
    const currentTag:string = typeof context.params?.tag == 'string' ? context.params.tag : "";
    const allTags = (await getAllTags(allPosts)).filter((t)=>t!=="解答")
    
    const posts:PageInfo[] = await getPostsByTag(currentTag, allPosts.filter((p)=>p.type!=="answer"));
    const v = await VersionGW.get()

    return {
        props: {
          posts,
          allTags,
          currentTag,
          v
        },
    };
};

const TagPageList = ({ posts, currentTag,allTags,v}: Props)=> {
    const tagSearchNav:pageNav = {title:`タグ検索：${currentTag}`,link:`/posts/tag/${currentTag}`};
    const {loading,userProfile,dotCount} = useAuth()
    const dot = ".".repeat(dotCount)

    return (
        <>
            <StaticHead />
            <Layout pageNavs={[HOME_NAV,tagSearchNav]} version={v}>
                {!loading && <TagMain
                    userProfile={userProfile}
                    posts={posts}
                    allTags={allTags}
                    currentTag={currentTag}
                />}
                {loading && <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
                    <Loader size={80} />
                    <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
                </div>}
            </Layout>
        </>
    );
}

export default TagPageList;