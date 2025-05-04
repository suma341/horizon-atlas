"use client";
import { Link, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { useRouter } from "next/router";
import { auth } from "@/lib/fireabase";
import { Profile } from "@/types/profile";
import { fetchUser, saveUserProfile } from "@/lib/fireStore";
import { motion } from "framer-motion";
import useUserProfileStore from "@/stores/userProfile";

const Callback = () => {
  const { loginWithCustomToken, user, logout } = useFirebaseUser();
  const router = useRouter();
  const [load,setLoad] = useState(false);
  const [errMessage,setErrMessage] = useState("")
  const {userProfile,setUserProfile} = useUserProfileStore()

  useEffect(() => {
    const getUserProfile = async () => {
      setLoad(true)
      try{
        if (auth.currentUser) {
          if(!userProfile){
            const user = await fetchUser(auth.currentUser.uid);
            if(user){
              setUserProfile(user)
            }else{
              logout();
              router.push("/")
              return;
            }
          }
          router.push("/posts");
          return;
        }
        if(typeof window !== "undefined"){
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");
          if (!code) {
            setErrMessage("URLから`code`を取得できませんでした");
            return;
          }
          const redirectUrl = `${process.env.NEXT_PUBLIC_ROOT_PATH}/callback`;
          const res = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_URL}/auth/discord`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, redirectUrl }),
          });
          if(!res.ok){
            setErrMessage(`$${res.status}：${await res.text()}`);
            console.error("Error:", res.status, await res.text());
            return;
          }
          const { firebaseToken,profile }:{firebaseToken:string,profile:Profile} = await res.json();
          console.log("profile",profile)
          if(profile.profile){
            await loginWithCustomToken(firebaseToken);
          }else{
            setErrMessage("HorizonのDiscordサーバーの参加を確認できません：HorizonのDiscordサーバーに参加したアカウントのみログインできます")
            return;
          }
          if(auth.currentUser){
            await saveUserProfile(profile)
          }
        }
      }finally{
        setLoad(false)
      }
    };
    getUserProfile();
  }, [user]);

  if(load){
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-purple-400" size={48} />
        <p className="text-lg font-semibold text-gray-700">読み込み中...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
      <div className="w-full max-w-md text-white bg-purple-900 border-purple-700 shadow-xl rounded-2xl">
          <div className="p-8 text-center">
          <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          >
              <h1 className="text-3xl font-semibold mb-2">ログインに失敗しました</h1>
              <p>{errMessage}</p>
              <Link href={"/posts"} className="text-neutral-100 hover:text-white">
                ホームに戻る
              </Link>
          </motion.div>
          </div>
      </div>
  </div>
  )
};

export default Callback;
