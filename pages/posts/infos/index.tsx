import Layout from "@/components/Layout/Layout";
import { HOME_NAV, INFO_NAV } from "@/constants/pageNavs";
import type { GetStaticProps,} from "next";
import InfoSvc from "@/lib/services/infoSvc";
import { PageInfo } from "@/types/page";
import SinglePost from "@/components/Post/SinglePost";
import DynamicHead from "@/components/head/dynamicHead";

type Props={
    infoPages:PageInfo[]
}

// getStaticProps関数
export const getStaticProps: GetStaticProps = async () => {
    const infoPages = await InfoSvc.getAll()

    return {
        props: {
            infoPages
        } as Props
    };
};

export default function BasicCoursePageList({infoPages}: Props){
    return (
        <>
            <DynamicHead
                title="部活情報"
                firstText="部活情報をまとめたページです"
                image="https://raw.githubusercontent.com/Ryukoku-Horizon/atlas-storage2/main/public/ogp/infos.png"
                link="https://ryukoku-horizon.github.io/horizon-atlas/posts/infos"
            />
            <Layout pageNavs={[HOME_NAV, INFO_NAV]}>
                <div className="min-h-screen md:flex md:flex-col md:justify-center md:items-center bg-gradient-to-br from-white via-gray-100 to-purple-50 animate-gradient transition-all">
                    <main className="w-full md:max-w-5xl mx-auto text-center">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text tracking-wide mb-16">
                            部活情報
                        </h1>
                        <section className="grid grid-cols-1 px-6">
                            {infoPages.sort((a,b)=> a.order - b.order).map((page, i) => {
                                return (
                                    <SinglePost
                                        postData={{...page,tags:["情報"]}}
                                        key={i}
                                    />
                                );
                            })}
                        </section>
                    </main>
                </div>
            </Layout>
        </>

    );
}
