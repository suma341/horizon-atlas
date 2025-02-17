import React, { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { pageNav } from "@/types/pageNav";
import Navbar from "./Navbar/navbar";
import Sidebar from "./Sidebar/Sidebar";

type LayoutProps = {
  children: ReactNode;
  headerProps: {
    pageNavs: pageNav[];
    searchKeyWord?: string;
    allTags: string[];
  };
  sideNavProps?: {
    title: string;
    slug: string;
    childPages: pageNav[];
  };
};

const Layout: React.FC<LayoutProps> = ({ children, headerProps, sideNavProps }) => {
  const [isVisible, setIsVisible] = useState(true); // ヘッダーの表示状態
  const [lastScrollY, setLastScrollY] = useState(0); // 最後のスクロール位置
  const [openbar, setOpenbar] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
      <div className="bg-white">
        <Head>
          <title>Horizon Atlas</title>
        </Head>
        <Sidebar openbar={openbar} setOpenbar={setOpenbar} allTags={headerProps.allTags} pageNav={sideNavProps} />
        <div
          className="fixed top-0 z-50 w-full duration-500"
          style={isVisible ? { transform: "translateY(0px)" } : { transform: "translateY(-65%)" }}
        >
          <Header searchKeyWord={headerProps.searchKeyWord} setOpenbar={setOpenbar} />
          <Navbar pageNavs={headerProps.pageNavs} />
        </div>
        {children}
        <div className="h-10"></div>
        <Footer />
      </div>
    );
};

export default Layout;
