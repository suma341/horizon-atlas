import type { GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import { calculatePageNumber, getAllTags, getPostsByRole, getPostsByTag } from "@/lib/services/notionApiService";
import { HOME_NAV } from "@/constants/pageNavs";
import { pageNav } from "@/types/pageNav";
import Layout from "@/components/Layout/Layout";
import Tags from "@/components/tag/Tags";
import { useEffect, useState } from "react";
import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage";
import { CurriculumService } from "@/lib/services/CurriculumService";
import useUserProfileStore from "@/stores/userProfile";

type pagePath = {
    params: { tag:string }
  }

export const getStaticPaths = async() =>{

    const allTags = await CurriculumService.getAllTags();

     const paramsList: pagePath[] = (
        await Promise.all(
            allTags.map(async (tag: string) => {
                return { params: { tag: tag } }
            })
        )
    ).flat();
    return {
        paths:paramsList,
        fallback: "blocking",
    }
  }

type Props ={
    posts:PostMetaData[];
    currentTag:string;
    allTags:string[];
}

export const getStaticProps: GetStaticProps = async (context) => {
    const allPosts:PostMetaData[] = await CurriculumService.getAllCurriculum();
    const currentTag:string = typeof context.params?.tag == 'string' ? context.params.tag : "";
    const allTags = await getAllTags(allPosts);
    
    const posts:PostMetaData[] = await getPostsByTag(currentTag, allPosts);
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
    const [matchPosts, setMatchPosts] = useState<PostMetaData[]>(posts);
    const numberOfPages = calculatePageNumber(posts);
    const postsPerPage = NUMBER_OF_POSTS_PER_PAGE;
    const { userProfile } = useUserProfileStore()

    useEffect(()=>{
        async function setData(){
          const usersRole = userProfile?.given_name ?? "体験入部"
          const postsByRole = await getPostsByRole(usersRole,posts);
          setMatchPosts(postsByRole);
        }
        setData();
      },[posts,userProfile,currentTag])

    return (
        <Layout pageNavs={[HOME_NAV,tagSearchNav]}>
            <div className="h-full w-full mx-auto font-mono">
                <main className="mt-20 mx-5 md:mx-16 mb-3 pt-4">
                    <Tags allTags={allTags} />
                    <section className="pt-5">
                        {matchPosts.slice(postsPerPage * (currentPage - 1), postsPerPage * currentPage).map((post)=>{
                            return (
                                <div key={post.curriculumId}>
                                    <SinglePost
                                        postData={post}
                                    />
                                </div>
                        )})}
                    </section>
                </main>
                <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} setPage={setCurrentPage} />
            </div>
        </Layout>
    );
}

export default TagPageList;