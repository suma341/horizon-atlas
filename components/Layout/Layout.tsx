"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { pageNav } from "@/types/pageNav";
import Navbar from "./Navbar/navbar";
import Sidebar from "./Sidebar/Sidebar";

type LayoutProps = {
  children: ReactNode;
  pageNavs: pageNav[];
  version:string
};

const Layout: React.FC<LayoutProps> = ({ children, pageNavs,version }) => {
  const [isVisible, setIsVisible] = useState(true); 
  const [lastScrollY, setLastScrollY] = useState(0); 
  const [openbar, setOpenbar] = useState(false);

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

    return (
      <div className="bg-white min-h-screen flex flex-col flex-1">
        {openbar && <Sidebar openbar={openbar} setOpenbar={setOpenbar} />}
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
        <Footer version={version} />
      </div>
    
    );
};

export default Layout;
