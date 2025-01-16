import React,{ ReactNode, useEffect } from 'react'
import Head from 'next/head';
import Footer from './Footer/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './Header/Header';
import { pageNav } from '@/types/pageNav';

const PUBLIC_PAGES = ["/"]; // 認証不要なページ

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession(); // statusを直接取得
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && !PUBLIC_PAGES.includes(router.pathname)) {
      router.push("/"); // 未ログインで公開ページ以外にアクセスした場合は初期ページへ
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className='mx-auto my-0'>Loading...</p>; // ローディング中の表示
  }

  console.log(session);

  return <>{children}</>; // ログイン済みの場合にコンテンツを表示
}
function SesstionProviderWraped({children} : {children: React.ReactNode}){
  return (
      <AuthGuard>
        {children}
      </AuthGuard>)
}

type LayoutProps={
  children: ReactNode;
  headerProps:pageNav[];
}

const Layout:React.FC<LayoutProps> = ({ children,headerProps })=> {
  return (
    <div className='bg-white'>
        <Head>
          <title>Horizon TechShelf</title>
        </Head>
        <Header pageNavs={headerProps} />
          <SesstionProviderWraped>
            {children}
          </SesstionProviderWraped>
        <Footer />
    </div>
  );
};

export default Layout