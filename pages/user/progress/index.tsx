import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV, PROGRESS_NAV, SETTING_NAV } from "@/constants/pageNavs";
import StaticHead from "@/components/head/staticHead";
import LoginModal from "@/components/loginModal/loginModal";
import useProgress from "@/hooks/useProgress";
import CantLoadProgress from "@/components/cantLoadProgress/cantLoadProgress";

export default function Progress() {
  const {cannotLoad,userProfile,loading,progress} = useProgress()

  if(cannotLoad){
    return (
      <>
        <StaticHead />
        <Layout pageNavs={[HOME_NAV,SETTING_NAV,PROGRESS_NAV]}>
            {!userProfile && <LoginModal />}
            {userProfile && <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
                <CantLoadProgress studentNum={userProfile.studentNum} />
            </div>}
        </Layout>
      </>
    )
  }

  return (
    <>
      <StaticHead />
      <Layout pageNavs={[HOME_NAV, SETTING_NAV, PROGRESS_NAV]}>
        <div className="min-h-screen text-gray-900 pt-24 px-5">
          <div className="text-center mb-10 animate-fadeIn mt-16">
            <h1 className="text-3xl font-extrabold text-neutral-600">
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
              {progress.map((item,i)=>(
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow" key={i}>
                  <p className="font-bold text-xl">{item.category}</p>
                  {item.data.map((item2,j)=>(
                    <CurriculumItem title={item2.title} achieved={item2.value} key={j} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
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
