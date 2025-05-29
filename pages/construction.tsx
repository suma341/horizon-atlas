import React from "react";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV } from "@/constants/pageNavs";
import MessageBoard from "@/components/messageBoard/messageBoard";

const Construction=()=>{
    return (
        <Layout pageNavs={[HOME_NAV]}>
            <MessageBoard
                title="現在整備中です"
                message=""
                link="posts"
                linkLabel="ホームに戻る"
            />
        </Layout>
    )
}

export default Construction;