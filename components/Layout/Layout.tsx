"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { pageNav } from "@/types/pageNav";
import Navbar from "./Navbar/navbar";
import Sidebar from "./Sidebar/Sidebar";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import useUserProfileStore from "@/stores/userProfile";
import { auth } from "@/lib/fireabase";
import { fetchUser } from "@/lib/fireStore";
import SidePeak from "./SidePeak/sidePeak";

type LayoutProps = {
  children: ReactNode;
  pageNavs: pageNav[];
  sideNavProps?: {
    title: string;
    childPages?: pageNav[];
  };
  useSelefHeader?:boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, pageNavs, sideNavProps,useSelefHeader}) => {
  const [isVisible, setIsVisible] = useState(true); 
  const [lastScrollY, setLastScrollY] = useState(0); 
  const [openbar, setOpenbar] = useState(false);
  const {logout,loading:userLoad} = useFirebaseUser();
  const { userProfile,setUserProfile } = useUserProfileStore();
  const [loading,setLoading] = useState(false)

  const router = useRouter()

  useEffect(()=>{
    const checkUser=async()=>{
      try{
        setLoading(true)
        if (auth.currentUser) {
          if(!userProfile){
            const user = await fetchUser(auth.currentUser.uid);
            if(user){
              setUserProfile(user)
            }else{
              logout();
              router.push("/")
              return;
            }
          }
          return;
        }
      }finally{
        setLoading(false)
      }
    }
    checkUser()
  },[auth.currentUser])

  useEffect(() => {
    if (window !== undefined) {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY]);

  if(!auth.currentUser && !userLoad){
    return <LoginModal />
  }

  if(loading){
    return <LoadingScreen />
  }

    return (
      <div className="bg-white min-h-screen flex flex-col flex-1">
        {!useSelefHeader && <Head>
          <title>HorizonAtlas</title>
          <meta property="og:title" content="HorizonAtlas" />
          <meta name="description" content="HorizonAtlasは、学習カリキュラムをまとめたHorizon部員専用のサービスです。" />
          <meta property="og:description" content="HorizonAtlasは、学習カリキュラムをまとめたHorizon部員専用のサービスです。" />
          <meta property="og:image" content="https://ryukoku-horizon.github.io/horizon-atlas/home.png" />
          <meta property="og:type" content="website" />
          <meta name='twitter:title' content="HorizonAtlas" />
          <meta name='twitter:description' content="HorizonAtlasは、学習カリキュラムをまとめたHorizon部員専用のサービスです。" />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name="twitter:card" content="https://ryukoku-horizon.github.io/horizon-atlas/home.png" />
          <link rel="icon" href="/horizon-atlas/favicon.ico" />
        </Head>}
        {openbar && <Sidebar openbar={openbar} setOpenbar={setOpenbar} pageNav={sideNavProps} />}

        <SidePeak setOpenbar={setOpenbar} />
        <div
          className="fixed top-0 z-50 w-full duration-500"
          style={isVisible ? { transform: "translateY(0px)" } : { transform: "translateY(-65%)" }}
        >
          <Header setOpenbar={setOpenbar} />
          <Navbar pageNavs={pageNavs} />
        </div>
        <div className="bg-white flex-grow w-full">
          {children}
          <div className="h-5"></div>
        </div>
        <Footer />
      </div>
    
    );
};

function LoginModal() {
  const redirectUri =
    process.env.NEXT_PUBLIC_ROOT_PATH ?? "https://sakiyamamamama.github.io/horizon-atlas";
  const router = useRouter();
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">ログインが必要です</h2>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => {
            router.push(redirectUri);
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center gap-4 mt-5">
      <Loader2 className="animate-spin text-purple-400" size={48} />
      <p className="text-lg font-semibold text-gray-700">読み込み中...</p>
    </div>
  );
}

export default Layout;
