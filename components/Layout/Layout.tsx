import React,{ ReactNode, useEffect } from 'react'
import Navbar from './Navbar/Navbar';
import Head from 'next/head';
import Footer from './Footer/Footer';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type LayoutProps = {
    children: ReactNode;
};

const PUBLIC_PAGES = ["/"]; // 認証不要なページ

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && !PUBLIC_PAGES.includes(router.pathname)) {
      router.push("/"); // 未ログインで公開ページ以外にアクセスした場合は初期ページへ
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // ローディング中の表示
  }

  return <>{children}</>; // ログイン済みの場合にコンテンツを表示
}
function SesstionProviderWraped({children} : {children: React.ReactNode}){
  return (
    <SessionProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </SessionProvider>)
}

const Layout:React.FC<LayoutProps> = ({ children })=> {
  return (
    <div className='bg-neutral-200'>
        <Head>
          <title>Horizon TechShelf</title>
        </Head>
        <Navbar />
          <SesstionProviderWraped>
            {children}
          </SesstionProviderWraped>
        <Footer />
    </div>
  );
};

export default Layout