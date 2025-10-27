"use client";
import { motion } from 'framer-motion';
import About from '@/components/top/about';
import Curriculums from '@/components/top/curriculums';
import { GetStaticProps } from 'next';
import Header from '@/components/top/header';
import SignInButton from '@/components/LoginButton/SignInButton';
import StaticHead from '@/components/head/staticHead';
import PageInfoSvc from '@/lib/services/PageInfoSvc';
import { useRouter } from 'next/router';
import useFirebaseUser from '@/hooks/useFirebaseUser';

type Props = {
  pageNum:number;
}

export const getStaticProps: GetStaticProps = async () => {
  const pages = await PageInfoSvc.getAll()
  const pageNum = pages.length
  return {
    props:{
      pageNum,
    } as Props,
  };
};

export default function Home({pageNum}:Props) {
  const router = useRouter()
  const {user} = useFirebaseUser()

  return (
    <div className="min-h-screen text-gray-900 diagonal-bg">
      <StaticHead />

      <Header />
      <main className="mx-auto py-16 text-center">
      <section className="bg-hero text-white flex flex-col justify-center items-center text-center h-[34rem]">
          <motion.h2 
            className="text-gray-800 text-6xl font-extrabold drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {["W", "e", "l", "c", "o", "m", "e", " ", "t", "o", " "].map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.05, delay: index * 0.1 }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span 
              className="text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              HorizonAtlas
            </motion.span>
          </motion.h2>

          <p className="text-lg mt-4 max-w-2xl">プログラミング部Horizonで使用する学習資料を簡単に閲覧、検索できます。</p>
          <div className='m-4 gap-4 flex flex-col'>
            <div className="mt-8 flex justify-center">
              <SignInButton  />
            </div>
            {!user && <button onClick={()=>{router.push("/posts")}} className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 active:bg-gray-600 transition">
              ゲストモード
            </button>}
          </div>
          <div className='mt-2 text-sm text-gray-50'>⚠️Horizonサーバーのメンバーアカウントのみログインできます</div>
        </section>
        <About />
        <Curriculums pageNum={pageNum} />
      </main>

      <footer className="bg-gray-200 text-gray-700 py-4 text-center">
        <p className="text-sm">&copy; 2025 Ryukoku Horizon</p>
      </footer>
    </div>
  );
}
