import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [allowed, setAllowed] = useState(false);
  const redirectUri =
  process.env.NEXT_PUBLIC_ROOT_PATH ?? "https://sakiyamamamama.github.io/horizon-atlas";
  const router = useRouter();

  useEffect(()=>{
    if(isAuthenticated){
      const checkGuild = async()=>{
        const GUILD_ID = process.env.NEXT_PUBLIC_GUILD_ID!;

        const isMember = user?.profile!.some((guild) => guild.id === GUILD_ID);
        // console.log("GUILD_ID",GUILD_ID);
        // console.log(user?.profile?.map((p)=>p.id));

        if (!isMember) {
          console.warn("Horizonメンバーアカウントではないため許可されません");
          logout({ logoutParams:{returnTo:redirectUri} });
        } else {
          setAllowed(true);
        }
      }
      checkGuild();
      console.log(user)
    }
  },[isAuthenticated])

  useEffect(()=>{
    if(allowed){
      router.push("/posts")
    }
  },[allowed])

  if(isAuthenticated){
    return(<button onClick={()=>{
      logout({logoutParams:{returnTo:redirectUri}})
    }}>
      ログアウト
    </button>)
  }

  return (
    <div className="">
        <button
        className="flex items-center justify-center px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm transition duration-300 hover:bg-gray-100"
          onClick={() =>
            loginWithRedirect({
              authorizationParams: {
                redirect_uri: redirectUri,
                connection: "Discord-custom-auth",
                scope:"identify guilds",
              },
            })
                      
          }
        >
          <img src="/horizon-atlas/discord_logo.png" alt="discord" className="w-5 h-5 mr-2" />
          Discordでログイン
        </button>
    </div>
  );
}