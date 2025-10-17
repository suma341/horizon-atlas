import StaticHead from "@/components/head/staticHead";
import Layout from "@/components/Layout/Layout"
import LoginModal from "@/components/loginModal/loginModal";
import { EDIT_NAV, HOME_NAV, SETTING_NAV } from "@/constants/pageNavs"
import { saveStudentNumber } from "@/lib/fireStore";
import useUserProfileStore from "@/stores/userProfile";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UserSettingEdit=()=>{
    const [isFocused, setIsFocused] = useState(false);
    const [studentNum,setStudentNum] = useState("");
    const {userProfile,setUserProfile} = useUserProfileStore()
    const [errMess,setErrMess] = useState<string | null>(null);
    const router = useRouter()

    const handleConfirm=async()=>{
       const isValid = /^[A-Z][0-9]{6}$/.test(studentNum)
       if(!isValid){
        setErrMess("学籍番号の値が不正です。")
        return;
       }
        if(!userProfile){
            setErrMess("ユーザープロフィールの読み取りに失敗しました。しばらくしてからもう一度試してください。")
            return;
        }
        await saveStudentNumber(studentNum,userProfile);
        setUserProfile({...userProfile,studentNum})
        router.push("/user/setting")
    }

    useEffect(()=>{
        const isValid = /^[A-Z][0-9]{6}$/.test(studentNum)
        if(isValid){
            setErrMess(null)
        }
    },[studentNum])
    
    return (
        <>  
            <StaticHead />
            <Layout pageNavs={[HOME_NAV,SETTING_NAV,EDIT_NAV]}>
                {!userProfile && <LoginModal />}
                {userProfile && <div className="min-h-screen w-full pt-24 px-5 items-center flex flex-col">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={studentNum}
                            onChange={(e) => setStudentNum(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="peer w-full border border-gray-300 text-gray-900 rounded-xl px-4 pt-5 pb-2 bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder={"学籍番号"}
                        />
                        <label
                            className={`
                            absolute left-4 top-2 text-sm text-gray-500 
                            transition-all duration-200 
                            ${isFocused || studentNum ? "text-xs top-1 text-purple-400" : "top-5"}
                            peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm
                            peer-placeholder-shown:text-gray-400
                            `}
                        >
                            学籍番号
                        </label>
                    </div>
                    <div className="w-full max-w-md my-1">
                        <p className="text-red-500 font-bold text-sm">* 一文字目は大文字にしてください</p>
                    </div>
                    <div  className="w-full max-w-md my-1">
                        <div className="border border-neutral-400 rounded-md p-3 max-w-md">
                            <p>例：</p>
                            <div className="flex gap-3">
                                <CheckCircle className="text-green-500 relative top-1" size={16} />
                                <p>L220429</p>
                            </div>
                            <div className="flex gap-3">
                                <XCircle className="text-red-500 relative top-1" size={16} />
                                <p>l220429</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-md">
                        <div className="items-end justify-end p-5 w-full flex flex-col">
                            <button
                            onClick={async()=>{
                                await handleConfirm()
                            }}
                                className="
                                    px-6 py-2 rounded-full 
                                    bg-purple-600 text-white font-medium 
                                    shadow-md hover:shadow-lg 
                                    hover:bg-purple-700 transition-all purple-200 
                                    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                確定
                            </button>
                        </div>
                    </div>
                    <div className="w-full max-w-md">
                        <p className="text-red-500 font-bold text-sm">{errMess}</p>
                    </div>
                </div>}
            </Layout>
        </>
    )
}

export default UserSettingEdit;