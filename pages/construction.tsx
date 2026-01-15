import React from "react";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV } from "@/constants/pageNavs";
import MessageBoard from "@/components/messageBoard/messageBoard";
import StaticHead from "@/components/head/staticHead";
import { GetStaticProps } from "next";
import { VersionGW } from "@/lib/Gateways/VersionGW";

export const getStaticProps: GetStaticProps = async () => {
    const v = await VersionGW.get()

    return {
        props: {
            v
        }
    };
};

const Construction=({v}:{v:string})=>{
    return (
        <>
            <StaticHead />
            <Layout pageNavs={[HOME_NAV]} version={v}>
                <MessageBoard
                    title="現在整備中です"
                    message=""
                    link="posts"
                    linkLabel="ホームに戻る"
                />
            </Layout>
        </>
    )
}

export default Construction;