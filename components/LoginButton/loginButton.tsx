import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionData } from "@/types/sessionData";

interface checkGuildData {
  message:string;
}

export default function LoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(false);

  useEffect(() => {
    const checkGuild = async () => {
      try {
        const response = await fetch("https://horizon-atlas.vercel.app/api/discord/guilds");
        
        if (!response.ok) {
          console.error("API Error:", response.status, await response.text());
          alert("Error fetching guilds. Please try again later.");
          setLoading(false);
          return;
        }

        const data:checkGuildData = await response.json();

        if (data.message === "User is in Horizon") {
          router.push("/posts");
        } else if (data.message === "User is not in Horizon") {
          alert(data.message);
          window.location.href = "https://horizon-atlas.vercel.app/api/auth/signout?callbackUrl=https%3A%2F%2Fsakiyamamamama.github.io%2Fhorizon-atlas";
        }
      } catch (error) {
        console.error("Error checking guild:", error);
        alert("Unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    async function checkLoginStatus() {
      const res = await fetch("https://horizon-atlas.vercel.app/api/auth/session", {
        credentials: "include", // Cookie を送る
      });

      const data:SessionData = await res.json();
      console.log(data); // デバッグ用

      if (!data || Object.keys(data).length === 0) {
        console.log("ログインしていません");
        setLoading(false);
        setSession(false);
        return;
      }

      console.log("ログインしています:", data);
      setSession(true);
      await checkGuild();
    }

    checkLoginStatus();
  }, []); 

  if (loading) {
    return <p>Checking your membership...</p>;
  }

  if (!session) {
    return (
      <a
        href="https://horizon-atlas.vercel.app/api/auth/signin?callbackUrl=https%3A%2F%2Fsakiyamamamama.github.io%2Fhorizon-atlas"
        className="bg-neutral-900 text-white py-1.5 px-9 mr-2 rounded shadow-2xl hover:bg-neutral-300 hover:text-neutral-800 hover:translate-y-2 hover:shadow-none duration-300"
      >
        Sign in
      </a>
    );
  }

  return null;
}
