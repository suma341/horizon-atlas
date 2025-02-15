import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { SessionData } from "@/types/sessionData";

// interface checkGuildData {
//   message:string;
// }

export default function LoginButton() {
  // const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(false);

  useEffect(() => {
    // const checkGuild = async () => {
    //   try {
    //     const response = await fetch("https://horizon-atlas.vercel.app/api/discord/guilds",{
    //       credentials: "include", 
    //       mode:"cors",
    //     });
        
    //     if (!response.ok) {
    //       console.error("API Error:", response.status, await response.text());
    //       alert("Error fetching guilds. Please try again later.");
    //       setLoading(false);
    //       return;
    //     }

    //     const data:checkGuildData = await response.json();

    //     if (data.message === "User is in Horizon") {
    //       router.push("/posts");
    //     } else if (data.message === "User is not in Horizon") {
    //       alert(data.message);
    //       window.location.href = "https://horizon-atlas.vercel.app/api/auth/signout?callbackUrl=https%3A%2F%2Fsakiyamamamama.github.io%2Fhorizon-atlas";
    //     }
    //   } catch (error) {
    //     console.error("Error checking guild:", error);
    //     alert("Unexpected error occurred. Please try again later.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    async function checkLoginStatus() {
      try {
        const res = await fetch("https://horizon-atlas.vercel.app/api/auth/session", {
          credentials: "include",
          mode: "cors",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });
    
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
    
        const data = await res.json();
        console.log("Session data:", data);
    
        if (data && data.token) {
          setSession(true);
        } else {
          setSession(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setSession(false);
      } finally {
        setLoading(false);
      }
    }

    checkLoginStatus();
  }, []); 

  if (loading) {
    return <p>Checking session ...</p>;
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
