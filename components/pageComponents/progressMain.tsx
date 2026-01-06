import { Profile } from "@/types/profile"
import CantLoadProgress from "../cantLoadProgress/cantLoadProgress"
import LoginModal from "../loginModal/loginModal"
import useProgress from "@/hooks/useProgress"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

type Props={
    userProfile:Profile | null
}

export const ProgressMain=({userProfile}:Props)=>{
    const {cannotLoad,loading,progress} = useProgress(userProfile)

    if(cannotLoad)
    return (
        <>
            {!userProfile && <LoginModal />}
            {userProfile && <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
                <CantLoadProgress studentNum={userProfile.studentNum} />
            </div>}
        </>
    )

    return (
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
    )
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
