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
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  allTags:string[];
  posts:PostMetaData[];
}

export const getStaticProps: GetStaticProps = async () => {

  const allPosts:PostMetaData[] = await CurriculumService.getAllCurriculum();

  const allTags:string[] = await getAllTags(allPosts);
  return {
    props:{
      allTags,
      posts:allPosts,
    },
  };
};

export default function SearchPage({allTags, posts}:Props) {
  const [matchPosts, setMatchPosts] = useState<PostMetaData[]>(posts);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPage, setNumberOfPage] = useState(calculatePageNumber(posts));
  const {user} = useAuth0();
  const router = useRouter();
  const query = router.query.search!==undefined ? router.query.search as string : undefined;
  useEffect(()=>{
    async function setData(){
      const usersRole = user?.given_name ?? "体験入部"
      const postsByRole = await getPostsByRole(usersRole,posts);
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
  },[query,posts,user])
  const postsPerPage = NUMBER_OF_POSTS_PER_PAGE;
  
  return (
    <Layout pageNavs={[HOME_NAV,SEARCH_NAV]}>
      <div className="pt-20">
        <main className="w-full mt-16 px-8">
          <div>
            <SearchField searchKeyWord={query} />
            <div className="h-5"></div>
            <Tags allTags={allTags} />
            <div className="mt-5" />
            {matchPosts.length!==0 && matchPosts.slice(postsPerPage * (currentPage - 1), postsPerPage * currentPage).map((post,i)=>
              <SinglePost postData={post} isPagenationPage={false} key={i} />
            )}
            {matchPosts.length===0 && <div className="text-xl">カリキュラムが見つかりませんでした</div>}
          </div>
        </main>
        <Pagenation numberOfPage={numberOfPage} currentPage={currentPage} setPage={setCurrentPage} />
      </div>
    </Layout>
  );
}
