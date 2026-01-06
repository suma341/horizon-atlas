 import Layout from "@/components/Layout/Layout";
import { HOME_NAV, PROGRESS_NAV, SETTING_NAV } from "@/constants/pageNavs";
import StaticHead from "@/components/head/staticHead";
import { useAuth } from "@/hooks/useAuth";
import { ProgressMain } from "@/components/pageComponents/progressMain";
import Loader from "@/components/loader/loader";

export default function Progress() {
  const {loading,userProfile,dotCount} = useAuth()
  const dot = ".".repeat(dotCount)

    return (
      <>
        <StaticHead />
        <Layout pageNavs={[HOME_NAV,SETTING_NAV,PROGRESS_NAV]}>
          {!loading && <ProgressMain
            userProfile={userProfile}
          />}
          {loading && <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
            <Loader size={80} />
            <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
          </div>}
        </Layout>
      </>
    )

}
