import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { useRouter } from "next/router";
import { auth } from "@/lib/fireabase";
import { Profile } from "@/types/profile";
import useUserProfileStore from "@/stores/userProfile";
import MessageBoard from "@/components/messageBoard/messageBoard";
import UserDataSvc from "@/lib/services/userDataSvc";

const Callback = () => {
  const { loginWithCustomToken, user, logout,loading } = useFirebaseUser();
  const router = useRouter();
  const [load,setLoad] = useState(false);
  const [errMessage,setErrMessage] = useState("")
  const {userProfile,setUserProfile} = useUserProfileStore()
  const [loadingMess,setLoadingMess] = useState("");
  const [dotCount, setDotCount] = useState(0);
  const [trigger,setTrigger]=useState(0);

  const handleSignIn=()=>{
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_ROOT_PATH}/callback`);
    const scope = "identify guilds guilds.members.read";

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    window.location.href = discordAuthUrl;
  }

  useEffect(() => {
    const getUserProfile = async () => {
      setLoad(true)
      try{
        if (auth.currentUser) {
          if(!userProfile){
            const user = await UserDataSvc.get(auth.currentUser.uid)
            if(user){
              setUserProfile(user)
            }else{
              await logout();
              handleSignIn()
              return;
            }
          }
          router.push("/posts");
          return;
        }else{
          if(typeof window !== "undefined"){
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            if (!code) {
              if(trigger<2){
                setLoadingMess("ログイン中にエラーが起きました。再度ログインを試みます...")
                setTimeout(()=>{
                  setTrigger((prev)=>prev + 1)
                },5000)
                return;
              }
              setErrMessage("URLから`code`を取得できませんでした");
              return;
            }
            const redirectUrl = `${process.env.NEXT_PUBLIC_ROOT_PATH}/callback`;
            const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}/api/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, redirectUrl }),
            });
            if(!res.ok){
              console.error(`error:${res.text}`)
              if(trigger<2){
                setLoadingMess("ログイン中にエラーが起きました。再度ログインを試みます...")
                setTimeout(()=>{
                  setTrigger((prev)=>prev + 1)
                },5000)
                return;
              }
              setErrMessage(`${res.status}：${await res.text()}`);
              console.error("Error:", res.status, await res.text());
              return;
            }
            const data:{succes:false,data:null | {firebaseToken:string,profile:Profile},error:null | string} = await res.json();
            if(data.error){
              console.error(data.error)
            }
            if(data.data!==null){
              const {firebaseToken,profile} = data.data
              if(profile.profile){
                try{
                  console.log(profile)
                  await loginWithCustomToken(firebaseToken);
                  console.log("ログイン成功")
                }catch(e){
                  console.error(`error:${e}`)
                  if(trigger<2){
                    setLoadingMess("ログイン中にエラーが起きました。再度ログインを試みます...")
                    setTimeout(()=>{
                      setTrigger((prev)=>prev+1);
                    },5000)
                    return;
                  }else{
                    console.error(e)
                    setErrMessage("トークンの保存に失敗しました")
                    return;
                  }
                }
              }else{
                setErrMessage("HorizonのDiscordサーバーに参加したアカウントのみログインできます")
                return;
              }
              if(auth.currentUser){
                setUserProfile(profile)
                await UserDataSvc.save(profile)
              }
            }
          }
        }
      }finally{
        setLoad(false)
      }
    };
    getUserProfile();
  }, [user,trigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4) 
    }, 1000)

    return () => clearInterval(interval) 
  }, [])

  const dots = '.'.repeat(dotCount)

  if(load || loading){
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-purple-400 mt-10" size={48} />
        <p className="font-semibold text-gray-700">読み込み中{dots}</p>
        <p className="text-gray-700">{loadingMess}</p>
      </div>
    );
  }
  if(!load && !loading && errMessage!==""){
    return (
      <MessageBoard
        title="ログインに失敗しました"
        message={errMessage}
        link="/"
        linkLabel="ホームに戻る"
      />
    )
  }
};

export default Callback;
