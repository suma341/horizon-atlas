import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import useUserProfileStore from "@/stores/userProfile";
import { auth } from "@/lib/fireabase";
import { fetchUser } from "@/lib/fireStore";
import { useRouter } from "next/router";
import Loader from "@/components/loader/loader";
import LoginModal from "@/components/loginModal/loginModal";

function App({ Component, pageProps }:AppProps) {
  const {logout,loading:authLoading} = useFirebaseUser();
  const { userProfile,setUserProfile } = useUserProfileStore();
  const [loading,setLoading] = useState(false);
  const router = useRouter()

  useEffect(()=>{
    const checkUser=async()=>{
      try{
        setLoading(true)
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
          return;
        }
      }finally{
        setLoading(false)
      }
    }
    checkUser()
  },[auth.currentUser])

  if(!authLoading && !auth.currentUser){
    <LoginModal />
  }

  if(authLoading || loading){
    return (
      <div className="flex flex-col items-center gap-4 mt-5 flex-1 justify-center">
        <Loader size={100} />
        <p className="text-xl font-semibold text-gray-700">読み込み中...</p>
      </div>
    )
  }

  return (
    <Component {...pageProps} />
  );
}

export default App;
