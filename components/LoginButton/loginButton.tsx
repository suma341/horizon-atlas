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
      if (typeof window !== "undefined") { 
        try {
          const response = await fetch("/api/discord/guilds");
          const data = await response.json();

          if (response.status === 200 && data.message === "User is in Horizon") {
            router.push("/posts");
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
        className="bg-neutral-900 text-white py-1.5 px-9 mr-2 rounded shadow-2xl hover:bg-neutral-300 hover:text-neutral-800 hover:translate-y-2 hover:shadow-none duration-300"
        onClick={() => signIn("discord")}
      >
        Sign in
      </button>
    </>
  );
}
