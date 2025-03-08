import { CustomUser } from "@/global";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const redirectUri =
  `${process.env.NEXT_PUBLIC_ROOT_PATH}/posts`;
  const router = useRouter();

  const customUser = user! as CustomUser;

  useEffect(()=>{
    if(isAuthenticated){
      const checkGuild = async()=>{
        const isMember = customUser.profile
        if (!isMember) {
          alert("Horizonメンバーアカウント以外はログインできせん");
          logout({ logoutParams: { returnTo: process.env.NEXT_PUBLIC_ROOT_PATH } });
        } else {
          // setAllowed(true);
        }
      }
      checkGuild();
    }
  },[isAuthenticated])

  return (
    <div className="">
        {!isAuthenticated && <button
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
        </button>}
        {isAuthenticated && <button
        className="flex items-center justify-center border border-gray-300
        bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() =>router.push("/posts")}>
          <img src="/horizon-atlas/discord_logo.png" alt="discord" className="w-5 h-5 mr-2" />
          Discordでログイン
        </button>}
    </div>
  );
}