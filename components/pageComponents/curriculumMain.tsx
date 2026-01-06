import useCheckRole from "@/hooks/useCheckUserProfile";
import Image from "next/image";
import { useEffect } from "react";
import PageCover from "../pageCover";
import { RenderChildren } from "../mdBlocks/mdBlock";
import MessageBoard from "../messageBoard/messageBoard";
import CantLoadProgress from "../cantLoadProgress/cantLoadProgress";
import { MdBlock } from "@/types/MdBlock";
import { Profile } from "@/types/profile";
import Loader from "../loader/loader";

type Props={
    userProfile:Profile | null
    visibility:string[]
    resourceType: "answer" | "info" | "curriculum"
    title:string
    coverUrl:string;
    iconUrl:string;
    iconType:string;
    pageId:string
    mdBlocks:MdBlock[]
}

export const CurriculumMain=({userProfile,visibility,resourceType,title,iconUrl,iconType,coverUrl,pageId,mdBlocks}:Props)=>{
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
            {notVisible && resourceType==="answer" && cannotLoad && <CantLoadProgress />}
            {notVisible && resourceType==="answer" && !cannotLoad && <MessageBoard 
                title='このページは制限されています' 
                message={`まだこの問題を提出していないようです。リンクから提出済みの問題を確認できます`}
                link='/user/progress'
                linkLabel='進捗を確認'
            />}
      </>
    )
}