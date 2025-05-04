import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProgress } from "@/lib/services/DriveService";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV, PROGRESS_NAV, SETTING_NAV } from "@/constants/pageNavs";
import { motion } from "framer-motion";
import useUserProfileStore from "@/stores/userProfile";
import Link from "next/link";

type Progress={
  title: string;
  value: string;
}

export default function Progress() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(false);
  const [cannotLoad, setCannotLoad] = useState(false);
  const { userProfile } = useUserProfileStore()

  useEffect(() => {
    async function setData() {
      if (userProfile) {
        setLoading(true);
        if(userProfile.studentNum){
          const data = await getUserProgress(userProfile.studentNum);
          if(data===null || data.length===0){
            setCannotLoad(true)
          }else{
            setProgress(data)
          }
        }
        setLoading(false);
      }
      if(!userProfile || !userProfile.studentNum){
        setCannotLoad(true)
      }
    }
    setData();
  }, [userProfile]);

  if(cannotLoad){
    return (
      <Layout pageNavs={[HOME_NAV,SETTING_NAV,PROGRESS_NAV]}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
                <div className="w-full max-w-md text-white bg-purple-900 border-purple-700 shadow-xl rounded-2xl">
                    <div className="p-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl font-semibold mb-2">
                          進捗が読み込めませんでした
                        </h1>
                        {(userProfile?.studentNum && userProfile.studentNum!=="") && <p>
                          学籍番号は合っていますか？：{userProfile.studentNum}<br />
                          違う場合は<Link href={"/user/setting/edit"} className="underline">こちら</Link>から設定し直してください。<br />
                        </p>}
                        {(!userProfile?.studentNum || userProfile.studentNum==="") && <p>
                          学籍番号が設定されていません。<br />
                          <Link href={"/user/setting/edit"} className="underline">こちら</Link>から設定してください
                          </p>}
                        <Link href={"/posts"} className="text-neutral-100 hover:text-white font-bold mt-5">
                            ホームに戻る
                        </Link>
                    </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    )
  }

  return (
    <Layout pageNavs={[HOME_NAV, SETTING_NAV, PROGRESS_NAV]}>
      <div className="min-h-screen text-gray-900 pt-24 px-5">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-neutral-600">
            {userProfile?.name!.split("-")[0]}さんの進捗度
          </h1>
          <div className="w-40 mx-auto border-b-4 border-purple-400 mt-4"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-purple-400" size={48} />
            <p className="text-lg font-semibold text-gray-700">読み込み中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
            {progress.map((item, i) => (
                <CurriculumItem title={item.title} achieved={item.value==="TRUE"} key={i} />
            ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const CurriculumItem = ({ title, achieved }: { title: string; achieved: boolean }) => {
  return (
    <div className={`mt-3 p-3 rounded-lg ${achieved ? "bg-purple-100 border-l-4 border-purple-500" : "bg-gray-100 border-l-4 border-gray-400"} hover:shadow-md transition-shadow`}> 
      <div className="flex items-center gap-3">
        {achieved ? <CheckCircle className="text-purple-700" size={24} /> : <XCircle className="text-gray-500" size={24} />}
        <span className="text-base font-medium text-gray-700">{title}</span>
      </div>
    </div>
  );
};
