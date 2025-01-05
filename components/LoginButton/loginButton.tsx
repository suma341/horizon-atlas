import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import router from "next/router";

export default function Session() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkGuild = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      checkGuild();
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return (
      <button
        className="bg-neutral-900 text-white py-1.5 px-9 mr-2 rounded shadow-2xl hover:bg-neutral-300 hover:text-neutral-800 hover:translate-y-2 hover:shadow-none duration-300"
        onClick={() => signIn("discord")}
      >
        Sign in
      </button>
    );
  }

  if (loading) {
    return <p>Checking your membership...</p>;
  }

  return null;
}
