import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const redirectUri =
  process.env.NEXT_PUBLIC_ROOT_PATH ?? "https://sakiyamamamama.github.io/horizon-atlas";

  const router = useRouter();

  useEffect(()=>{
    if(isAuthenticated){
      router.push("/posts");
    }
  },[isAuthenticated])

  return (
    <div className="">
      {isAuthenticated ? (
        <>
          <button onClick={() => logout({ logoutParams: { returnTo: redirectUri } })}>
            ログアウト
          </button>
        </>
      ) : (
        <button
        className="flex items-center justify-center px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm transition duration-300 hover:bg-gray-100"
          onClick={() =>
            loginWithRedirect({
              authorizationParams: {
                redirect_uri: redirectUri,
                connection: "discord",
              },
            })
          }
        >
          <img src="/horizon-atlas/discord_logo.png" alt="Google" className="w-5 h-5 mr-2" />
          Discordでログイン
        </button>
      )}
    </div>
  );
}
