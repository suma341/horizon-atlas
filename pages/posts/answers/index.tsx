import Layout from "@/components/Layout/Layout";
import { ANSWER_NAV, HOME_NAV } from "@/constants/pageNavs";
import type { GetStaticProps,} from "next";
import { PageInfo } from "@/types/page";
import SinglePost from "@/components/Post/SinglePost";
import DynamicHead from "@/components/head/dynamicHead";
import LoginModal from "@/components/loginModal/loginModal";
import AnswerSvc from "@/lib/services/answerSvc";
import useProgress from "@/hooks/useProgress";
import Loader from "@/components/loader/loader";
import { useEffect } from "react";
import Link from "next/link";
import CantLoadProgress from "@/components/cantLoadProgress/cantLoadProgress";

type Props={
    answerPages:PageInfo[]
}

export const getStaticProps: GetStaticProps = async () => {
    const answerPages = await AnswerSvc.getAll()

    return {
        props: {
            answerPages:answerPages
        } as Props
    };
};

export default function AnswersPage({answerPages}: Props){
    const {userProfile,entity,loading,cannotLoad} = useProgress()

    useEffect(()=>{
        console.log(entity)
    },[entity])

    return (
        <>
            <DynamicHead
                title="解答ページ"
                firstText="カリキュラムの解答ページです"
                image="https://raw.githubusercontent.com/Ryukoku-Horizon/atlas-storage2/main/public/ogp/answers.png"
                link="https://ryukoku-horizon.github.io/horizon-atlas/posts/answers"
            />
            <Layout pageNavs={[HOME_NAV, ANSWER_NAV]}>
                {!userProfile && <LoginModal />} 
                {loading && <div className="mt-16 h-full w-full align-middle justify-center p-16">
                    <Loader size={60} />    
                    <p className="font-bold text-gray-500">進捗を読み込み中...</p>
                </div>}
                {userProfile && !loading && 
                <div className="min-h-screen md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-white via-gray-100 to-purple-50 animate-gradient transition-all">
                    <main className="w-full md:max-w-5xl mx-auto text-center mt-16">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text tracking-wide mb-16">
                            解答ページ
                        </h1>
                        <p className="mt-8">提出した問題の解答のみ閲覧できます。※一部の問題の解答が用意できていない場合があります。</p>
                        <p>提出済みの問題を見るには
                            <Link href="/user/progress" className="text-sky-500 hover:text-sky-700">こちら</Link>
                        から</p>
                        {cannotLoad && <CantLoadProgress studentNum={userProfile.studentNum} />}
                        {!cannotLoad && <section className="grid grid-cols-1 px-6 mt-8">
                            {answerPages.sort((a,b)=> a.order - b.order).map((page, i) => {
                                const isAnswered = entity.find((e)=>e.title===page.title && e.value)
                                if(!isAnswered)return null;
                                return (
                                    <SinglePost
                                        postData={{...page,tags:["解答"]}}
                                        key={i}
                                    />
                                );
                            })}
                        </section>}
                    </main>
                </div>}
            </Layout>
        </>

    );
}
