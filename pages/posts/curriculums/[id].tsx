import { GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import { PostMetaData } from '@/types/postMetaData';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { pageNav } from '@/types/pageNav';
import { BASIC_NAV, HOME_NAV, INFO_NAV } from '@/constants/pageNavs';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import { CurriculumService } from '@/lib/services/CurriculumService';
import { PageDataService } from '@/lib/services/PageDataService';
import useUserProfileStore from '@/stores/userProfile';
import MessageBoard from '@/components/messageBoard/messageBoard';
import { ParagraphData } from '@/types/paragraph';
import DynamicHead from '@/components/head/dynamicHead';
import Loader from '@/components/loader/loader';
import PageInfoSvc from '@/lib/services/PageInfoSvc';
import { CategoryService } from '@/lib/services/CategoryService';
import InfoSvc from '@/lib/services/infoSvc';
import { MdBlock } from '@/types/MdBlock';
import useCheckRole from '@/hooks/useCheckUserProfile';

type postPath = {
  params: { id:string }
}

type StaticProps = {
  title:string;
  metadata:PostMetaData | "info";
  mdBlocks:MdBlock[];
  pageNavs:pageNav[];
  pageId:string;
  iconType:string;
  iconUrl:string;
  coverUrl:string;
  firstText:string;
};

export const getStaticPaths = async () => {
  const allPages = await PageInfoSvc.getAll()
  const allInfoPages = await InfoSvc.getAll()

  const paths: postPath[] = [...allPages,...allInfoPages].map((data) => {
    return { params: { 
      id:data.id 
    }
     };
  });
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }):Promise<{props:StaticProps}> => {
    const pageId = params?.id as string;

    let pageInfo = await PageInfoSvc.getByPageId(pageId)
    let isInfo = false
    if(!pageInfo){
        pageInfo = await InfoSvc.getById(pageId)
        isInfo = true
    }
    if(!pageInfo){
      throw new Error(`missing pageinfo in ${pageId}`)
    }
    const { curriculumId } = pageInfo
    const achieve:string[] = [`${pageInfo.title}：`]
    try{
        const mdBlocks =  await PageDataService.getPageDataByPageId(pageId,curriculumId);
        achieve.push("🤍")
        const singlePost = isInfo ? (pageId===curriculumId ? pageInfo : await InfoSvc.getById(curriculumId)) :
          await CurriculumService.getCurriculumById(curriculumId);
        if(!singlePost){
          throw new Error(`missing query in ${pageId}`)
        }
        achieve.push("🩵")
        const pageNavs:pageNav[] = [HOME_NAV]
        if(isInfo){
          pageNavs.push(INFO_NAV)
          pageNavs.push({ title: singlePost.title, link: `/posts/curriculums/${curriculumId}` })
        }else{
          if("category" in singlePost){
            const noCategorized = singlePost.category===""
            if(!noCategorized){
              const category = await CategoryService.getCategoryByName(singlePost.category)
              if(category){
                if(category.is_basic_curriculum){
                  pageNavs.push(BASIC_NAV)
                }
                pageNavs.push({title: singlePost.category, link: `/posts/course/${category.id}`})
              }
            }
            pageNavs.push({ title: singlePost.title, link: `/posts/curriculums/${curriculumId}` })
          }
        }
        let firstText = "";
        try{
            for(const i of mdBlocks){
                if(i.type==="paragraph"){
                    const textData:ParagraphData = JSON.parse(i.parent)
                    for(const i2 of textData.parent){
                        firstText = firstText + i2.plain_text
                    }
                    if(firstText.length>12){
                        break;
                    }
                }
            }
        }catch(e){
            throw new Error(`🟥 error in ${pageInfo.title}:${e}`)
        }
        achieve.push("🩷")
        const childPage = await PageDataService.getPageNavs(pageInfo,isInfo)
        const pageNavs_ = curriculumId!==pageId ? [...pageNavs, ...childPage.reverse()] : pageNavs
        achieve.push("🟢")
        return {
            props: {
            title:pageInfo.title,
            metadata: "category" in singlePost ? singlePost : "info",
            mdBlocks,
            pageNavs:pageNavs_,
            pageId,
            iconUrl:pageInfo.iconUrl,
            iconType:pageInfo.iconType,
            coverUrl:pageInfo.coverUrl,
            firstText
            },
        };
    }catch(e){
        throw new Error(`🟥 error in ${pageInfo.title}:${e}`)
    }finally{
        console.log(achieve)
    }
};

const Post =({ metadata, mdBlocks,pageNavs,pageId,title,iconType,iconUrl,coverUrl,firstText}: StaticProps) => {
  const { userProfile } = useUserProfileStore();

  const {notVisible,roleChecking} = useCheckRole(metadata==="info" ? metadata : metadata.visibility)

  useEffect(()=>{
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1); // "#" を除去
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
        image={`https://raw.githubusercontent.com/Ryukoku-Horizon/atlas-storage2/main/public/ogp/${pageId}.png`}
      />
      <Layout pageNavs={pageNavs}>
      {!notVisible && <div className='pt-20 pb-8 min-h-screen md:flex md:flex-col md:justify-center md:items-center '>
      {coverUrl!=="" && <Image src={coverUrl} alt={''} width={120} height={120} className='h-56 top-0' style={{width:"100vw"}} />}
        <section className='bg-white pb-10 md:max-w-4xl md:min-w-[670px] px-2' style={coverUrl!=="" ? {} : {paddingTop:"4rem"}}>
          <div>
          {iconType==="" && <Image src={"/horizon-atlas/file_icon.svg"} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}} />}
          {iconType !== "emoji" && iconType!=="custom_emoji" && iconType!=="" && <Image src={iconUrl} alt={''} width={20} height={20} className='relative w-20 h-20 m-0' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}} />}
          {iconType==="custom_emoji" && <img src={iconUrl} alt={''} className='relative w-20 h-20 m-0' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}} />}
          {iconType === "emoji" && <p className='relative w-14 h-14 text-7xl' style={coverUrl!=="" ? {top:"-40px",left:"20px"} : {marginBottom:"1.25rem"}}>{iconUrl}</p>}
            <h2 className='w-full text-3xl font-bold'>{title}</h2>
          </div>
          <div className='border-b mt-2'></div>
          <div className='mt-4 font-medium'>
            {!roleChecking && <div key={pageId}>
              {mdBlocks.map((mdBlock)=>{
                  return (
                    <MdBlockComponent mdBlock={mdBlock} depth={0} key={mdBlock.blockId} />
                  )
              })}
            </div>}
            {roleChecking && <Loader size={80} />}
          </div>
        </section>
      </div>}
      {notVisible && <MessageBoard 
        title='このページは制限されています' 
        message={`${userProfile ? (userProfile?.given_name || "体験入部") : "ゲスト"}ユーザーはこのページを見ることを制限されています。ロールを更新するには再度ログインしてください。`}
        link='/posts'
        linkLabel='戻る'
      />}
    </Layout>
    </>
  )
}

export default Post
