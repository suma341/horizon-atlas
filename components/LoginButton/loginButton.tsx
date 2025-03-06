import { CustomUser } from "@/global";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [allowed, setAllowed] = useState(false);
  const redirectUri =
  process.env.NEXT_PUBLIC_ROOT_PATH ?? "https://sakiyamamamama.github.io/horizon-atlas";
  const router = useRouter();

  const customUser = user! as CustomUser;

  useEffect(()=>{
    if(isAuthenticated){
      const checkGuild = async()=>{
        const isMember = customUser.profile
        console.log("roles",customUser.given_name);
        if (!isMember) {
          alert("Horizonメンバーアカウントのみログインできます");
          logout({ logoutParams: { returnTo: redirectUri } });
        } else {
          setAllowed(true);
        }
      }
      checkGuild();
    }
  },[isAuthenticated])

  useEffect(()=>{
    if(allowed){
      router.push("/posts")
    }
  },[allowed])

  return (
    <div className="">
        <button
        className="flex items-center justify-center border border-gray-300
        bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
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