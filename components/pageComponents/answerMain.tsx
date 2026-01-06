import Link from "next/link";
import Loader from "../loader/loader";
import LoginModal from "../loginModal/loginModal";
import CantLoadProgress from "../cantLoadProgress/cantLoadProgress";
import SinglePost from "../Post/SinglePost";
import useProgress from "@/hooks/useProgress";
import { Profile } from "@/types/profile";
import { PageInfo } from "@/types/page";

type Props={
    userProfile:Profile | null
    answerPages:PageInfo[]
}

export const AnswerMain=({userProfile,answerPages}:Props)=>{
    const {entity,loading,cannotLoad} = useProgress(userProfile)

    return (
        <>
            {!userProfile && <LoginModal />} 
            {loading && <div className="mt-16 h-full w-full align-middle justify-center p-16">
                <Loader size={60} />    
                <p className="font-bold text-gray-500">進捗を読み込み中...</p>
            </div>}
            {userProfile && !loading && 
            <div className="min-h-screen md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-white via-gray-100 to-purple-50 animate-gradient transition-all">
                <main className="w-full md:max-w-5xl mx-auto text-center mt-24 md:mt-12">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text tracking-wide mb-16">
                        解答ページ
                    </h1>
                    <p className="mt-8">提出した問題の解答のみ閲覧できます。※一部の問題の解答が用意できていない場合があります。</p>
                    <p>提出済みの問題を見るには
                        <Link href="/user/progress" className="text-sky-500 hover:text-sky-700">こちら</Link>
                    から</p>
                    {cannotLoad && <div className="flex items-center justify-center px-4">
                        <CantLoadProgress studentNum={userProfile.studentNum} />
                        </div>}
                    {!cannotLoad && <section className="grid grid-cols-1 px-6 mt-8">
                        {answerPages.sort((a,b)=> a.order - b.order).map((page, i) => {
                            const isAnswered = entity.find((e)=>e.title===page.title && e.value)
                            if(!isAnswered)return null;
                            return (
                                <SinglePost
                                    postData={{...page}}
                                    key={i}
                                />
                            );
                        })}
                    </section>}
                </main>
            </div>}
        </>
    )
}