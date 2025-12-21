import StaticHead from "@/components/head/staticHead";
import Layout from "@/components/Layout/Layout"
import LoginModal from "@/components/loginModal/loginModal";
import { HOME_NAV, SETTING_NAV } from "@/constants/pageNavs"
import useUserProfileStore from "@/stores/userProfile";
import Link from "next/link";
import { FaArrowTrendUp } from "react-icons/fa6";

const UserSetting=()=>{
    const { userProfile } = useUserProfileStore()
    
    return (
        <>
            <StaticHead />
            <Layout pageNavs={[HOME_NAV,SETTING_NAV]}>
                {!userProfile && <LoginModal />}
                {userProfile &&<div className="min-h-screen w-full pt-24 px-5 items-center flex flex-col">
                    <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full">
                        <h1 className="text-3xl font-bold my-4">プロフィール</h1>
                        <div className="flex">
                            <div className="flex flex-col items-center text-center basis-1/3">
                                <img
                                    src={userProfile.picture}
                                    alt={`${userProfile.name}'s avatar`}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <h1 className="mt-4 text-2xl font-semibold text-gray-900">{userProfile?.name}</h1>
                                <p className="mt-2 text-gray-600 max-w-md">{userProfile?.given_name}</p>
                            </div>
                            <div className="mt-4 flex flex-col basis-2/3">
                                <div>
                                    <p className="text-neutral-500">学籍番号</p>
                                    {(userProfile?.studentNum && userProfile.studentNum!=="") && <div className="flex gap-2 w-full mt-4 items-center">
                                        <Link href={"/user/setting/edit"}>
                                            <span className="px-6 py-1 bg-neutral-50 text-black rounded-md hover:bg-neutral-200 shadow inline-flex items-center">変更</span>
                                        </Link>
                                        <p className="p-3 text-gray-800 bg-slate-50 border border-neutral-400 rounded-md">{userProfile.studentNum}</p>
                                    </div>}
                                    {(!userProfile?.studentNum || userProfile.studentNum==="") && <div className="py-4">
                                        <Link href={"/user/setting/edit"}
                                        className="mt-2 px-6 py-2 bg-neutral-50 text-black rounded-md hover:bg-neutral-200 transition shadow">
                                            設定する
                                        </Link>
                                    </div>}
                                </div>
                                <div className="mt-10 w-full basis-1">
                                    <Link href={"/user/progress"}>
                                        <span className=" text-neutral-500 hover:text-neutral-600 text-lg py-4 px-2 w-full hover:bg-neutral-100 flex gap-3">
                                            <FaArrowTrendUp size={20} className="relative top-1" />
                                            進捗を確認する
                                        </span>
                                    </Link>
                                </div>
                                <div className="mt-12 w-full">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </Layout>
        </>
    )
}

export default UserSetting;