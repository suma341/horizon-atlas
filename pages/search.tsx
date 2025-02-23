import Layout from "@/components/Layout/Layout";
import SinglePost from "@/components/Post/SinglePost";
import Tags from "@/components/tag/Tags";
import { HOME_NAV, SEARCH_NAV } from "@/constants/pageNavs";
import { createSearchQuery, searchByKeyWord } from "@/lib/searchKeyWord";
import { calculatePageNumber, getAllTags } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import path from "path";
import {  useEffect, useState } from "react";
import fs from "fs";
import SearchField from "@/components/SearchField/SearchField";
import { RoleData } from "@/types/role";
import { fetchRoleInfo } from "@/lib/fetchRoleInfo";
import Pagenation from "@/components/pagenation/Pagenation";
import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage";

type Props = {
  allTags:string[];
  posts:PostMetaData[];
  roleData:RoleData;
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  const parsedData = JSON.parse(jsonData);

  const allPosts: PostMetaData[] = Array.isArray(parsedData) ? parsedData : parsedData.posts || [];

  if (!Array.isArray(allPosts)) {
    throw new Error("notionDatabase.jsonのデータが配列ではありません！");
  }

  const allTags:string[] = await getAllTags(allPosts);
  const roleData = await fetchRoleInfo();
  return {
    props:{
      allTags,
      posts:allPosts,
      roleData
    },
  };
};

export default function SearchPage({allTags, posts,roleData}:Props) {
  const [matchPosts, setMatchPosts] = useState<PostMetaData[]>(posts);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPage, setNumberOfPage] = useState(calculatePageNumber(posts));
  const router = useRouter();
  const query = router.query.search!==undefined ? router.query.search as string : undefined;
  useEffect(()=>{
    if(query!==undefined){
      const searchKeyWords = createSearchQuery(query);
      const result = searchByKeyWord(searchKeyWords,posts)
      setMatchPosts(result)
      const numberOfPage = calculatePageNumber(result);
      setNumberOfPage(numberOfPage);
    }
  },[query,posts])
  const postsPerPage = NUMBER_OF_POSTS_PER_PAGE;
  
  return (
    <Layout headerProps={{pageNavs:[HOME_NAV,SEARCH_NAV],allTags}} roleData={roleData}>
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
