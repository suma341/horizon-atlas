import type { GetStaticPaths, GetStaticProps } from "next";
import SinglePost from "@/components/Post/SinglePost";
import { PostMetaData } from "@/types/postMetaData";
import Pagenation from "@/components/pagenation/Pagenation";
import { getAllTags, getNumberOfPages, getPostsByPage } from "@/lib/services/notionApiService";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV } from "@/constants/pageNavs";
import fs from "fs";
import path from "path";
import { RoleData } from "@/types/role";
import { fetchRoleInfo } from "@/lib/fetchRoleInfo";

type pagePath = {
    params: { page:string }
  }

export const getStaticPaths:GetStaticPaths = async() =>{
    const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const allPosts: PostMetaData[] = JSON.parse(jsonData);
    // const allPosts = await getAllPosts();
    const numberOfPages:number =await getNumberOfPages(allPosts);
    const paramsList:pagePath[] = [];
    for(let i:number=0;i<numberOfPages;i++){
        paramsList.push({ params:{ page:i.toString() } })
    }
    return {
        paths:paramsList,
        fallback:'blocking'
    }
  }

type Props = {
  postsByPage:PostMetaData[];
  numberOfPages:number;
  currentPage:string;
  allTags:string[];
  roleData:RoleData;
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async (context) => {
    const filePath = path.join(process.cwd(), "public", "notion_data", "notionDatabase.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const allPosts: PostMetaData[] = JSON.parse(jsonData);
    const currentPage:string = typeof context.params?.page == 'string' ? context.params.page : '1';
    // const allPosts = await getAllPosts();
    const allTags = await getAllTags(allPosts);
    const numberOfPages:number =await getNumberOfPages(allPosts);

    const postsByPage = await getPostsByPage(parseInt(currentPage),allPosts);
    const roleData = await fetchRoleInfo();
    return {
        props: {
          postsByPage,
          numberOfPages,
          currentPage,
          allTags,
          roleData
        },
    };
};

// Homeコンポーネント
const blogPageList = ({ postsByPage,numberOfPages,currentPage,allTags,roleData }: Props)=> {

  // console.log(allMetaData);
  return (
    <Layout headerProps={{pageNavs:[HOME_NAV,{title:'カリキュラム一覧',id:"/posts/page/1"}],allTags:allTags}} roleData={roleData}>
      <div className="h-full w-full mx-auto font-mono">
        <main className="mt-20 mx-5 md:mx-16 mb-3">
          <section className="pt-5 bg-white">
            {postsByPage.map((post:PostMetaData,i:number)=>(
            <div key={i}>
                <SinglePost
                  postData={post}
                  isPagenationPage={true}
                />
            </div>
            ))}
          </section>
        </main>
        <Pagenation numberOfPage={numberOfPages} currentPage={currentPage} tag={""} />
      </div>
    </Layout>
  );
}

export default blogPageList;