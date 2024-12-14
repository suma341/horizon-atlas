import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import router from "next/router";

export default function LoginButton() {
  return (
    <SessionProvider>
      <Session />
    </SessionProvider>
  );
}

export function Session() {
  const { data: session } = useSession();

  
    const checkGuild = async () => {
      if (typeof window !== "undefined") { // クライアントサイドでのみ実行
        try {
          const response = await fetch("/api/discord/guilds");
          const data = await response.json();

          if (response.status === 200 && data.message === "User is in Horizon") {
            router.push("/posts/page/1");
          } else if (response.status === 302 && data.message === "User is not in Horizon") {
            alert("Only Horizon members can login");
            signOut(); 
          }
        } catch (error) {
          console.error("Error checking guild:", error);
        }
      }
    };

  if (session) {
    checkGuild();
    return (
      <>
        <p>Checking your membership...</p>
      </>
    );
  }

  return (
    <>
      <button
        className="p-3 bg-slate-900 text-white rounded-md shadow-xl hover:shadow-none hover:translate-y-1 transition-all duration-300"
        onClick={() => signIn("discord")}
      >
        Sign in
      </button>
    </>
  );
}
