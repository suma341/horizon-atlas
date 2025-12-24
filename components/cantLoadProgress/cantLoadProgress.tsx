import { motion } from "framer-motion";
import Link from "next/link";

type Props={
    studentNum?:string
}

const CantLoadProgress=({studentNum}:Props)=>{
    return (
        <div className="md:flex md:flex-col w-full align-middle max-w-md text-white bg-purple-900 border-purple-700 shadow-xl rounded-2xl">
            <div className="p-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-2xl font-semibold mb-2">
                    進捗が読み込めませんでした
                </h1>
                {(studentNum && studentNum!=="") && <p>
                    学籍番号は合っていますか？：{studentNum}<br />
                    違う場合は<Link href={"/user/setting/edit"} className="underline">こちら</Link>から設定し直してください。<br />
                </p>}
                {(!studentNum || studentNum==="") && <p>
                    学籍番号が設定されていません。<br />
                    <Link href={"/user/setting/edit"} className="underline">こちら</Link>から設定してください
                    </p>}
                <Link href={"/posts"} className="text-neutral-100 hover:text-white font-bold mt-5">
                    ホームに戻る
                </Link>
            </motion.div>
            </div>
        </div>
    )
}

export default CantLoadProgress