import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getCarriculumProgress } from "@/lib/services/DriveService";
import Layout from "@/components/Layout/Layout";
import { HOME_NAV, PROGRESS_NAV } from "@/constants/pageNavs";

interface Progress {
  title: string;
  progress: {
    title:string;
    achieved: boolean;
  }[];
}

export default function Progress() {
  const { user } = useAuth0();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function setData() {
      if (user) {
        setLoading(true);
        const progress = await getCarriculumProgress(user.name!.split("-")[0]);
        setProgress(progress);
        setLoading(false);
      }
    }
    setData();
  }, [user]);

  return (
    <Layout pageNavs={[HOME_NAV, PROGRESS_NAV]}>
      <div className="min-h-screen text-gray-900 pt-24 px-5">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-neutral-600">
            {user?.name!.split("-")[0]}さんの進捗度
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
            {progress.map((item, i) => (
              <div key={i} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-neutral-500 mb-4">{item.title}</h2>
                {item.progress.map((p, j) => (
                  <CurriculumItem key={j} {...p} />
                ))}
              </div>
            ))}
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
