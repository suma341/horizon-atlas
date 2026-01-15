import Layout from "@/components/Layout/Layout";
import { HOME_NAV } from "@/constants/pageNavs";
import {  getAllTags } from "@/lib/services/notionApiService";
import { GetStaticProps } from "next";
import { CategoryService } from "@/lib/services/CategoryService";
import { Category } from "@/types/category";
import Loader from "@/components/loader/loader";
import StaticHead from "@/components/head/staticHead";
import { PageInfo } from "@/types/page";
import PageInfoSvc from "@/lib/services/PageInfoSvc";
import { useAuth } from "@/hooks/useAuth";
import { HomeMain } from "@/components/pageComponents/homeMain";
import { VersionGW } from "@/lib/Gateways/VersionGW";

type Props = {
  categoryAndCurriculums:{
    category: Category;
    curriculums: PageInfo[];
  }[],
  allTags:string[],
  noCaterizedCurriculums:PageInfo[]
  v:string
};

export const getStaticProps: GetStaticProps = async () => {
  const allPosts:PageInfo[] = await PageInfoSvc.getBaseCurriculum()
  const noCaterizedCurriculums = await PageInfoSvc.getCurriculumByCategory("")
  const notBasicCategories = await CategoryService.getNotBasicCategory()
  const categoryAndCurriculums = await Promise.all(notBasicCategories.filter((c)=>c.id!=="info" && c.id!=="answer").map(async(c)=>{
    const curriculums = await PageInfoSvc.getCurriculumByCategory(c.title)
    return {
      category:c,
      curriculums
    }
  }))

  const allTags = await getAllTags(allPosts);
  const v = await VersionGW.get()

  return {
      props: {
        categoryAndCurriculums,
        allTags,
        noCaterizedCurriculums,
        v
      } as Props,
  };
};

const PostsPage = ({ allTags,noCaterizedCurriculums,categoryAndCurriculums,v}: Props)=> {
  const {dotCount,loading,userProfile} = useAuth()
  const dot = ".".repeat(dotCount)

    return (
      <>
        <StaticHead />
        <Layout pageNavs={[HOME_NAV]} version={v}>  
          {!loading && <HomeMain
            userProfile={userProfile}
            allTags={allTags}
            noCaterizedCurriculums={noCaterizedCurriculums}
            categoryAndCurriculums={categoryAndCurriculums}
          />}
          {loading && <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
            <Loader size={80} />
            <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
          </div>}
        </Layout>
      </>
    );
  }

  export default  PostsPage;