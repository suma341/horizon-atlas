import { GetStaticProps } from 'next';
import { pageNav } from '@/types/pageNav';
import { ANSWER_NAV, BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import Layout from '@/components/Layout/Layout';
import { PageDataService } from '@/lib/services/PageDataService';
import DynamicHead from '@/components/head/dynamicHead';
import Loader from '@/components/loader/loader';
import PageInfoSvc from '@/lib/services/PageInfoSvc';
import { CategoryService } from '@/lib/services/CategoryService';
import { MdBlock } from '@/types/MdBlock';
import { useAuth } from '@/hooks/useAuth';
import { CurriculumMain } from '@/components/pageComponents/curriculumMain';

type postPath = {
  params: { id:string }
}

type StaticProps = {
  title:string;
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
  pageId:string;
  iconType:string;
  iconUrl:string;
  coverUrl:string;
  firstText:string;
  ogpImagePath:string;
  resourceType:ResourceType;
  visibility:string[]
};

type ResourceType = "curriculum" | "info" | "answer"

export const getStaticPaths = async () => {
  const allPages = await PageInfoSvc.getAll()

  const paths: postPath[] = allPages.map((data) => {
    return { params: { 
      id:data.id 
    }
     };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }):Promise<{props:StaticProps}> => {
    const pageId = params?.id as string;

    const pageInfo = await PageInfoSvc.getByPageId(pageId)
    if(!pageInfo){
      throw new Error(`missing pageinfo in curriculums/[id]/getStaticProps ${pageId}`)
    }
    const { curriculumId } = pageInfo
    const achieve:string[] = [`${pageInfo.title}：`]
    const isBasePage = curriculumId === pageId
    const resourceType:ResourceType = pageInfo.type
    try{
        const mdBlocks =  await PageDataService.getPageDataByPageId(pageId);
        achieve.push("🤍")
        const basePage = isBasePage ? pageInfo : await PageInfoSvc.getByPageId(curriculumId)
        if(!basePage){
          console.log(`missing query in curriculums/[id]/getStaticProps ${pageId}`)
          throw new Error(`missing query in curriculums/[id]/getStaticProps ${pageId}`)
        }
        achieve.push("🩵")
        const pageNavs:pageNav[] = [HOME_NAV]
        for(const cat of pageInfo.category){
          if(cat==="解答"){
            pageNavs.push(ANSWER_NAV)
          }else{
            const category = await CategoryService.getCategoryByName(cat)
            if(category){
              if(category.is_basic_curriculum){
                pageNavs.push(BASIC_NAV)
                pageNavs.push({title: cat, link: `/posts/course/${category.id}?is_basic=true`})
              }else{
                pageNavs.push({title: cat, link: `/posts/course/${category.id}`})
              } 
            }
          }
        }
        pageNavs.push({ title: basePage.title, link: `/posts/curriculums/${curriculumId}` })
        achieve.push("🩷")
        const childPage = await PageDataService.getPageNavs(pageInfo)
        const pageNavs_ = curriculumId!==pageId ? [...pageNavs, ...childPage.reverse()] : pageNavs
        achieve.push("🟢")
        return {
            props: {
              title:pageInfo.title,
              visibility:pageInfo.visibility ,
              mdBlocks,
              pageNavs:pageNavs_,
              pageId,
              iconUrl:pageInfo.iconUrl,
              iconType:pageInfo.iconType,
              coverUrl:pageInfo.coverUrl,
              firstText:pageInfo.ogp.first_text,
              ogpImagePath:pageInfo.ogp.image_path,
              resourceType
            },
        };
    }catch(e){
        throw new Error(`🟥 error in ${pageInfo.title}:${e}`)
    }finally{
        console.log(achieve)
    }
};

const Post =({ visibility, mdBlocks,pageNavs,pageId,title,iconType,iconUrl,coverUrl,firstText,resourceType,ogpImagePath}: StaticProps) => {
  const {loading,dotCount,userProfile} = useAuth()
  const dot = ".".repeat(dotCount)

  return (
    <>
      <DynamicHead
        title={title}
        firstText={firstText}
        link={`https://ryukoku-horizon.github.io/horizon-atlas/${pageNavs[pageNavs.length - 1].link}`}
        image={ogpImagePath}
      />
      <Layout pageNavs={pageNavs}>
        {!loading && <CurriculumMain
          visibility={visibility}
          mdBlocks={mdBlocks}
          pageId={pageId}
          iconType={iconType}
          iconUrl={iconUrl}
          coverUrl={coverUrl}
          resourceType={resourceType}
          userProfile={userProfile}
          title={title}
        />}
        {loading && <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
            <Loader size={80} />
            <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
          </div>}
    </Layout>
    </>
  )
}

export default Post
