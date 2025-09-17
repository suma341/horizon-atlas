import { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react';
import { PostMetaData } from '@/types/postMetaData';
import { MdBlock } from 'notion-to-md/build/types';
import MdBlockComponent from '@/components/mdBlocks/mdBlock';
import { pageNav } from '@/types/pageNav';
import { BASIC_NAV, HOME_NAV } from '@/constants/pageNavs';
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

type postPath = {
  params: { id:string }
}

type StaticProps = {
  title:string;
  metadata:PostMetaData;
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

  const paths: postPath[] = allPages.map((data) => {
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

    const pageInfo = await PageInfoSvc.getByPageId(pageId)
    if(!pageInfo){
        throw Error(`missing pageInfo in ${pageId}`)
    }
    const { curriculumId } = pageInfo
    const achieve:string[] = [`${pageInfo.title}：`]
    try{
        const mdBlocks =  await PageDataService.getPageDataByPageId(pageId,curriculumId);
        achieve.push("🤍")
        const singlePost:PostMetaData = await CurriculumService.getCurriculumById(curriculumId);
        achieve.push("🩵")

        const courseNav: pageNav = { title: singlePost.category ? singlePost.category : "", link: `/posts/course/${singlePost.category}` };
        const postNav: pageNav = { title: singlePost.title, link: `/posts/curriculums/${curriculumId}` };
        const pageNavs: pageNav[] = singlePost.is_basic_curriculum
            ? [HOME_NAV, BASIC_NAV, courseNav, postNav]
            : (singlePost.category ===undefined || singlePost.category === "")
            ? [HOME_NAV, postNav]
            : [HOME_NAV, courseNav, postNav];

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
        const childPage = await PageDataService.getPageNavs(pageInfo)
        const pageNavs_ = curriculumId!==pageId ? [...pageNavs, ...childPage.reverse()] : pageNavs
        achieve.push("🟢")
        return {
            props: {
            title:pageInfo.title,
            metadata: singlePost,
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
  const [notVisible,setNotVisible] = useState(false);
  const [load,setLoad] = useState(false)

  useEffect(()=>{
    try{
      setLoad(true)
      const usersRole = userProfile?.given_name ?? "体験入部";
      const isVisible = metadata.visibility.some((item)=>item===usersRole)
      if(!isVisible && usersRole!=="幹事長" && usersRole!=="技術部員"){
        setNotVisible(true)
      }else{
        setNotVisible(false)
      }
    }finally{
      setLoad(false)
      if (typeof window !== "undefined" && window.location.hash) {
        const id = window.location.hash.substring(1); // "#" を除去
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100); 
        }
      }
    }
  },[userProfile?.given_name])

  return (
    <>
      <DynamicHead
        title={title}
        firstText={firstText}
        link={`https://ryukoku-horizon.github.io/horizon-atlas/${pageNavs[pageNavs.length - 1].link}`}
        image={`https://ryukoku-horizon.github.io/horizon-atlas/ogp/${metadata.curriculumId}/${pageId}.png`}
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
            {!load && <div key={pageId}>
              {mdBlocks.map((mdBlock)=>{
                  return (
                    <MdBlockComponent mdBlock={mdBlock} depth={0} key={mdBlock.blockId} />
                  )
              })}
            </div>}
            {load && <Loader size={80} />}
          </div>
        </section>
      </div>}
      {notVisible && <MessageBoard 
        title='このページは制限されています' 
        message={`${userProfile?.given_name || "体験入部"}のユーザーはこのページを見ることを制限されています。ロールを更新するには再度ログインしてください。`}
        link='/posts'
        linkLabel='戻る'
      />}
    </Layout>
    </>
  )
}

export default Post
