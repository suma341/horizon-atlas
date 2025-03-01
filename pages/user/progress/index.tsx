import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getFletCarriculumProgress } from "@/lib/services/DriveService";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV, PROGRESS_NAV } from "@/constants/pageNavs";

interface Progress {
  title: string;
  isAchieved: boolean;
}

export default function Progress() {
  const { user } = useAuth0();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function setData() {
      if (user) {
        setLoading(true);
        const progress = await getFletCarriculumProgress(user.name!.split("-")[0]);
        setProgress(progress);
        setLoading(false);
      }
    }
    setData();
  }, [user]);

  return (
    <Layout headerProps={{ pageNavs: [HOME_NAV, PROGRESS_NAV] }} roleData={{ basic: { id: "", name: "" }, develop: { id: "", name: "" } }}>
      <div className="min-h-screen text-gray-900 diagonal-bg pt-20 px-5">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-500 animate-fadeIn">
            {user?.name!.split("-")[0]}さんの進捗度
          </h1>
          <div className="w-40 mx-auto border-b-4 border-blue-300 mt-2"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-lg font-semibold text-gray-700">読み込み中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
            {progress.map((item, index) => (
              <CurriculumItem key={index} {...item} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const CurriculumItem = ({ title, isAchieved }: { title: string; isAchieved: boolean }) => {
  return (
    <div className={`p-4 rounded-2xl shadow-md transition-all ${isAchieved ? "bg-green-100 hover:bg-green-200" : "bg-gray-100 hover:bg-gray-200"}`}>
      <div className="flex items-center gap-3">
        {isAchieved ? <CheckCircle className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
        <span className="text-lg font-semibold">{title}</span>
      </div>
    </div>
  );
};
