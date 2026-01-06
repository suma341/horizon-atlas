import StaticHead from "@/components/head/staticHead";
import Layout from "@/components/Layout/Layout"
import Loader from "@/components/loader/loader";
import { UserMain } from "@/components/pageComponents/userMain";
import { HOME_NAV, SETTING_NAV } from "@/constants/pageNavs"
import { useAuth } from "@/hooks/useAuth";

const UserSetting=()=>{
    const {dotCount,loading,userProfile} = useAuth()
    const dot = ".".repeat(dotCount)
    
    return (
        <>
            <StaticHead />
            <Layout pageNavs={[HOME_NAV,SETTING_NAV]}>
                {!loading && <UserMain userProfile={userProfile} />}
                {loading && <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
                    <Loader size={80} />
                    <p className="text-xl font-semibold text-gray-700">読み込み中{dot}</p>
                </div>}
            </Layout>
        </>
    )
}

export default UserSetting;