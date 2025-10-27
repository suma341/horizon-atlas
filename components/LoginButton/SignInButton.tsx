import useFirebaseUser from "@/hooks/useFirebaseUser";
import { useRouter } from "next/router";

const SignInButton=()=>{
    const { user } = useFirebaseUser()
    const router = useRouter()

    const handleSignIn=()=>{
        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_ROOT_PATH}/callback`);
        const scope = "identify guilds guilds.members.read";

        const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

        window.location.href = discordAuthUrl;
    }

    return (
        <div className="">
            {!user && <button
            className="flex items-center justify-center border border-gray-300
            bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
              onClick={() =>{
                handleSignIn()
              }}
            >
              <img src="/horizon-atlas/discord_logo.png" alt="discord" className="w-5 h-5 mr-2" />
              Discordでログイン
            </button>}
            {user && <button
            className="flex items-center justify-center border border-gray-300
            bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
              onClick={() =>router.push("/posts")}>
              スタート
            </button>}
        </div>
      );
}

export default SignInButton