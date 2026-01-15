import Layout from "@/components/Layout/Layout";
import { BASIC_NAV, HOME_NAV } from "@/constants/pageNavs";
import type { GetStaticProps,} from "next";
import { CategoryService } from "@/lib/services/CategoryService";
import { Category } from "@/types/category";
import Loader from "@/components/loader/loader";
import DynamicHead from "@/components/head/dynamicHead";
import { PageInfo } from "@/types/page";
import PageInfoSvc from "@/lib/services/PageInfoSvc";
import { BasicMain } from "@/components/pageComponents/basicMain";
import { useAuth } from "@/hooks/useAuth";
import { VersionGW } from "@/lib/Gateways/VersionGW";

type Props={
    courseAndPosts: {
        category: Category;
        curriculums: PageInfo[];
    }[];
    v:string
}

export const getStaticProps: GetStaticProps = async () => {
    const basicCategories = await CategoryService.getBasicCategory()
    const categoryAndCurriculums = await Promise.all(basicCategories.map(async(c)=>{
        const curriculums = await PageInfoSvc.getCurriculumByCategory(c.title)
        return {
            category:c,
            curriculums
        }
    }))
    const v = await VersionGW.get()

    return {
        props: {
            courseAndPosts:categoryAndCurriculums,
            v
        } as Props
    };
};

export default function BasicCoursePageList({courseAndPosts,v}: Props){
    const {userProfile,loading,dotCount} = useAuth()
    const dot = ".".repeat(dotCount)

    return (
        <>
            <DynamicHead
                title="基礎班カリキュラム"
                firstText="基礎班向けにプログラミングを１から学べます"
                image={`${process.env.NEXT_PUBLIC_STORAGE_URL}/ogp/basic.png`}
                link="https://ryukoku-horizon.github.io/horizon-atlas/posts/basic"
            />
            <Layout pageNavs={[HOME_NAV, BASIC_NAV]} version={v}>
                {!loading && <BasicMain
                    courseAndPosts={courseAndPosts}
                    userProfile={userProfile}
                />}
                {loading &&<div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
                    <Loader size={80} />
                    <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
                </div>}
            </Layout>
        </>

    );
}
