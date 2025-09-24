import Layout from "@/components/Layout/Layout";
import SinglePost from "@/components/Post/SinglePost";
import Tags from "@/components/tag/Tags";
import { HOME_NAV, SEARCH_NAV } from "@/constants/pageNavs";
import { createSearchQuery, searchByKeyWord } from "@/lib/searchKeyWord";
import { calculatePageNumber, getAllTags, getPostsByRole } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import {  useEffect, useState } from "react";
import SearchField from "@/components/SearchField/SearchField";
import Pagenation from "@/components/pagenation/Pagenation";
import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage";
import { CurriculumService } from "@/lib/services/CurriculumService";
import useUserProfileStore from "@/stores/userProfile";
import StaticHead from "@/components/head/staticHead";
import PageInfoSvc from "@/lib/services/PageInfoSvc";
import { PageInfo } from "@/types/page";

type Props = {
  allTags:string[];
  pages:(PageInfo & PostMetaData)[]
}

export const getStaticProps: GetStaticProps = async () => {

  const allPosts:PostMetaData[] = await CurriculumService.getAllCurriculum();
  const allTags:string[] = await getAllTags(allPosts);

  const allPages = await PageInfoSvc.getAll()
  const pageAndMetadata = allPages.map((p)=>{
    const metadata = allPosts.find(c=>c.curriculumId===p.curriculumId)!
    return {
      ...p,
      ...metadata,
      title:p.title,
      iconType:p.iconType,
      iconUrl:p.iconUrl
    }
  })

  return {
    props:{
      allTags,
      // posts:allPosts,
      pages:pageAndMetadata
    } as Props,
  };
};

export default function SearchPage({allTags, pages}:Props) {
  const [matchPosts, setMatchPosts] = useState<(PostMetaData | (PageInfo & PostMetaData))[]>(pages);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPage, setNumberOfPage] = useState(calculatePageNumber(pages));
  const { userProfile } = useUserProfileStore()
  const router = useRouter();
  const query = router.query.search!==undefined ? router.query.search as string : undefined;

  useEffect(()=>{
    async function setData(){
      const usersRole = userProfile?.given_name ?? "体験入部"
      const postsByRole = await getPostsByRole(usersRole,pages);
      setMatchPosts(postsByRole);
      if(query!==undefined){
        const searchKeyWords = createSearchQuery(query);
        const result = searchByKeyWord(searchKeyWords,postsByRole)
        setMatchPosts(result)
        const numberOfPage = calculatePageNumber(result);
        setNumberOfPage(numberOfPage);
      }
    }
    setData();
  },[query,pages,userProfile])
  
  const postsPerPage = NUMBER_OF_POSTS_PER_PAGE;
  
  return (
    <>
      <StaticHead />
      <Layout pageNavs={[HOME_NAV,SEARCH_NAV]}>
        <div className="pt-20">
          <main className="w-full mt-16 px-8">
            <div>
              <SearchField searchKeyWord={query} />
              <div className="h-5"></div>
              <Tags allTags={allTags} />
              <div className="mt-5" />
              {matchPosts.length!==0 && matchPosts.slice(postsPerPage * (currentPage - 1), postsPerPage * currentPage).map((post)=>{
                return (<SinglePost postData={{...post,id:"id" in post ? post.id : post.curriculumId}} key={post.curriculumId} />)
              })}
              {matchPosts.length===0 && <div className="text-xl flex items-center justify-center">
                カリキュラムが見つかりませんでした
              </div>}
            </div>
          </main>
          <Pagenation numberOfPage={numberOfPage} currentPage={currentPage} setPage={setCurrentPage} />
        </div>
      </Layout>
    </>
  );
}
