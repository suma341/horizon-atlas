import type { GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import Pagenation from "@/components/pagenation/Pagenation";
import { calculatePageNumber, getAllTags, getPostsByRole, getPostsByTag } from "@/lib/services/notionApiService";
import { HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Layout from "@/components/Layout/Layout";
import Tags from "@/components/tag/Tags";
import { useEffect, useState } from "react";
import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage";
import useUserProfileStore from "@/stores/userProfile";
import Loader from "@/components/loader/loader";
import StaticHead from "@/components/head/staticHead";
import { PageInfo } from "@/types/page";
import PageInfoSvc from "@/lib/services/PageInfoSvc";

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
}

export const getStaticProps: GetStaticProps = async (context) => {
    const allPosts:PageInfo[] = await PageInfoSvc.getBaseCurriculum()
    const currentTag:string = typeof context.params?.tag == 'string' ? context.params.tag : "";
    const allTags = (await getAllTags(allPosts)).filter((t)=>t!=="解答")
    
    const posts:PageInfo[] = await getPostsByTag(currentTag, allPosts.filter((p)=>p.type!=="answer"));
    return {
        props: {
          posts,
          allTags,
          currentTag,
        },
    };
};

const TagPageList = ({ posts, currentTag,allTags}: Props)=> {
    const tagSearchNav:pageNav = {title:`タグ検索：${currentTag}`,link:`/posts/tag/${currentTag}`};
    const [currentPage, setCurrentPage] = useState(1);
    const [matchPosts, setMatchPosts] = useState<PageInfo[]>(posts);
    const numberOfPages = calculatePageNumber(posts);
    const postsPerPage = NUMBER_OF_POSTS_PER_PAGE;
    const { userProfile } = useUserProfileStore();
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        async function setData(){
            try{
                setLoading(true)
                const usersRole = userProfile ? (userProfile.given_name ?? "体験入部") : "ゲスト"
                const postsByRole = await getPostsByRole(usersRole,posts);
                setMatchPosts(postsByRole);
            }finally{
                setLoading(false)
            }
        }
        setData();
      },[posts,userProfile,currentTag])

    return (
        <>
            <StaticHead />
            <Layout pageNavs={[HOME_NAV,tagSearchNav]}>
                <div className="h-full w-full mx-auto font-mono">
                    <main className="mt-20 mx-5 md:mx-16 mb-3 pt-4">
                        <Tags allTags={allTags} />
                        {!loading && <section className="pt-5">
                            {matchPosts.slice(postsPerPage * (currentPage - 1), postsPerPage * currentPage).map((post)=>{
                                return (
                                    <div key={post.curriculumId}>
                                        <SinglePost
                                            postData={{...post,id:post.curriculumId}}
                                        />
                                    </div>
                            )})}
                        </section>}
                        {loading && <Loader size={20} />}
                    </main>
                    <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} setPage={setCurrentPage} />
                </div>
            </Layout>
        </>
    );
}

export default TagPageList;