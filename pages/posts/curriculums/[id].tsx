import { GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import { RenderChildren } from '@/components/mdBlocks/mdBlock';
import { pageNav } from '@/types/pageNav';
import { ANSWER_NAV, BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import { PageDataService } from '@/lib/services/PageDataService';
import useUserProfileStore from '@/stores/userProfile';
import MessageBoard from '@/components/messageBoard/messageBoard';
import DynamicHead from '@/components/head/dynamicHead';
import Loader from '@/components/loader/loader';
import PageInfoSvc from '@/lib/services/PageInfoSvc';
import { CategoryService } from '@/lib/services/CategoryService';
import { MdBlock } from '@/types/MdBlock';
import useCheckRole from '@/hooks/useCheckUserProfile';
import CantLoadProgress from '@/components/cantLoadProgress/cantLoadProgress';
import PageCover from '@/components/pageCover';

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
  const { userProfile } = useUserProfileStore();
  const {notVisible,roleChecking,cannotLoad} = useCheckRole(visibility,resourceType,title)

  useEffect(()=>{
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1); 
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); 
      }
    }
  },[userProfile])

  return (
    <>
      <DynamicHead
        title={title}
        firstText={firstText}
        link={`https://ryukoku-horizon.github.io/horizon-atlas/${pageNavs[pageNavs.length - 1].link}`}
        image={ogpImagePath}
      />
      <Layout pageNavs={pageNavs}>
      {!notVisible && <div className='pt-20 pb-8 min-h-screen md:flex md:flex-col md:justify-center md:items-center '>
      {coverUrl && coverUrl!=="" && <Image src={coverUrl} alt={''} width={120} height={120} className='h-56 top-0' style={{width:"100vw"}} />}
        <section className='bg-white pb-10 md:max-w-4xl md:min-w-[670px] px-2' style={coverUrl!=="" ? {} : {paddingTop:"4rem"}}>
          <div>
            <PageCover iconType={iconType} iconUrl={iconUrl} coverUrl={coverUrl} />
            <h2 className='w-full text-3xl font-bold'>{title}</h2>
          </div>
          <div className='border-b mt-2'></div>
          <div className='mt-4 font-medium'>
            {!roleChecking && <div key={pageId}>
              <RenderChildren mdBlocks={mdBlocks} depth={0}  />
            </div>}
            {roleChecking && <Loader size={80} />}
          </div>
        </section>
      </div>}
      {notVisible && resourceType!=="answer" && <MessageBoard 
        title='このページは制限されています' 
        message={`${userProfile ? (userProfile?.given_name || "体験入部") : "ゲスト"}ユーザーはこのページを見ることを制限されています。ロールを更新するには再度ログインしてください。`}
        link='/posts'
        linkLabel='戻る'
      />}
      {notVisible && resourceType==="answer" && cannotLoad && <CantLoadProgress studentNum={userProfile?.studentNum} />}
      {notVisible && resourceType==="answer" && !cannotLoad && <MessageBoard 
        title='このページは制限されています' 
        message={`まだこの問題を提出していないようです。リンクから提出済みの問題を確認できます`}
        link='/user/progress'
        linkLabel='進捗を確認'
      />}
    </Layout>
    </>
  )
}

export default Post
