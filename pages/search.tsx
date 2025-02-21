import Layout from "@/components/Layout/Layout";
import SinglePost from "@/components/Post/SinglePost";
import Tags from "@/components/tag/Tags";
import { HOME_NAV, SEARCH_NAV } from "@/constants/pageNavs";
import { createSearchQuery, searchByKeyWord } from "@/lib/searchKeyWord";
import { getAllTags } from "@/lib/services/notionApiService";
import { PostMetaData } from "@/types/postMetaData";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import path from "path";
import { useEffect, useState } from "react";
import fs from "fs";
import SearchField from "@/components/SearchField/SearchField";
import { RoleData } from "@/types/role";
import { fetchRoleInfo } from "@/lib/fetchRoleInfo";

type Props = {
  allTags:string[];
  posts:PostMetaData[];
  roleData:RoleData;
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  const allPosts: PostMetaData[] = JSON.parse(jsonData);
  // const allPosts:PostMetaData[] = await getAllPosts();
  const allTags:string[] = await getAllTags(allPosts);
  const roleData = await fetchRoleInfo();
  return {
    props:{
      allTags,
      posts:allPosts,
      roleData
    },
  }
}

export default function SearchPage({allTags, posts,roleData}:Props) {
  const [matchPosts, setMatchPosts] = useState<PostMetaData[]>(posts);
  const router = useRouter();
  const query = router.query.search!==undefined ? router.query.search as string : undefined;
  useEffect(()=>{
    if(query!==undefined){
      const searchKeyWords = createSearchQuery(query);
      const result = searchByKeyWord(searchKeyWords,posts)
      setMatchPosts(result)
    }
  },[query])
  console.log(query);
  
  return (
    <Layout headerProps={{pageNavs:[HOME_NAV,SEARCH_NAV],allTags}} roleData={roleData}>
      <div className="pt-20">
        <main className="w-full mt-16 px-8">
          <div>
            <SearchField searchKeyWord={query} />
            <div className="h-5"></div>
            <Tags allTags={allTags} />
            <div className="mt-5" />
            {matchPosts.length!==0 && matchPosts.map((post,i)=>
              <SinglePost postData={post} isPagenationPage={false} key={i} />
            )}
            {matchPosts.length===0 && <div className="text-xl">カリキュラムが見つかりませんでした</div>}
          </div>
        </main>
      </div>
    </Layout>
  );
}
