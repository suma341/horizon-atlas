import React from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV } from "@/constants/pageNavs";

const Construction=()=>{
    return (
        <Layout pageNavs={[HOME_NAV]}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
                <div className="w-full max-w-md text-white bg-purple-900 border-purple-700 shadow-xl rounded-2xl">
                    <div className="p-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl font-semibold mb-2">現在整備中です</h1>
                        <Link href={"/posts"} className="text-neutral-100 hover:text-white">
                            <ArrowLeft className="mr-2" size={28} /> ホームに戻る
                        </Link>
                    </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Construction;