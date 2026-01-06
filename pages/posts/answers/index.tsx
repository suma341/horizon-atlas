import Layout from "@/components/Layout/Layout";
import { ANSWER_NAV, HOME_NAV } from "@/constants/pageNavs";
import type { GetStaticProps,} from "next";
import { PageInfo } from "@/types/page";
import DynamicHead from "@/components/head/dynamicHead";
import Loader from "@/components/loader/loader";
import PageInfoSvc from "@/lib/services/PageInfoSvc";
import { useAuth } from "@/hooks/useAuth";
import { AnswerMain } from "@/components/pageComponents/answerMain";

type Props={
    answerPages:PageInfo[]
}

export const getStaticProps: GetStaticProps = async () => {
    const answerPages = await PageInfoSvc.getAnswerPages()

    return {
        props: {
            answerPages:answerPages
        } as Props
    };
};

export default function AnswersPage({answerPages}: Props){
    const {loading,dotCount,userProfile}= useAuth()
    const dot = ".".repeat(dotCount)

    return (
        <>
            <DynamicHead
                title="解答ページ"
                firstText="カリキュラムの解答ページです"
                image={`${process.env.NEXT_PUBLIC_STORAGE_URL}/ogp/answers.png`}
                link="https://ryukoku-horizon.github.io/horizon-atlas/posts/answers"
            />
            <Layout pageNavs={[HOME_NAV, ANSWER_NAV]}>
                {!loading && <AnswerMain
                    answerPages={answerPages}
                    userProfile={userProfile}
                />}
                {loading && <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
                    <Loader size={80} />
                    <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
                </div>}
            </Layout>
        </>

    );
}
