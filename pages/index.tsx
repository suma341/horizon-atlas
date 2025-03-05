// pages/index.js
import AuthButton from '@/components/LoginButton/loginButton';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen text-gray-900 diagonal-bg">
      <Head>
        <title>HorizonAtlas</title>
        <meta name="description" content="HorizonAtlasは、学習カリキュラムをまとめたHorizon部員専用のサービスです。" />
        <meta property="og:image" content="/horizon-atlas/app_image.png" />
        <link rel="icon" href="/horizon-atlas/favicon.ico" />
      </Head>

      <header className="bg-neutral-50 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div>
            <Image src={'/horizon-atlas/logo_.png'} alt={''} width={32} height={16} className='w-32 top-[-20px] h-auto absolute left-0' />
          </div>
        </div>
        <div className='h-7'></div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <section className="py-16">
          <motion.h2 
            className="text-5xl font-bold text-gray-800"
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
              className="text-purple-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              HorizonAtlas
            </motion.span>
          </motion.h2>


          <p className="text-lg mt-4 text-gray-600">プログラミング部Horizonで使用する学習資料を簡単に閲覧、検索できます。</p>
          <div className="mt-8 flex justify-center">
            <AuthButton  />
          </div>
          <div className='mt-2 text-sm text-gray-500'>⚠️Horizonサーバーのメンバーアカウントのみログインできます</div>
        </section>

        <section id="features" className="py-16 px-6 bg-gray-100 rounded-xl shadow-lg">
          <h3 className="text-3xl font-bold text-gray-800">Features</h3>
          <ul className="mt-6 space-y-4 text-lg text-gray-700">
            <li className="flex items-center space-x-2"><span className="text-purple-700 text-xl">✔️</span> <span>資料のカテゴリ別整理</span></li>
            <li className="flex items-center space-x-2"><span className="text-purple-700 text-xl">✔️</span> <span>Horizon部員全員のみアクセス可能</span></li>
            <li className="flex items-center space-x-2"><span className="text-purple-700 text-xl">✔️</span> <span>最新の資料アップロードと検索機能</span></li>
          </ul>
        </section>
      </main>

      <footer className="bg-gray-200 text-gray-700 py-4 text-center">
        <p className="text-sm">&copy; 20245 Ryukoku Horizon</p>
      </footer>
    </div>
  );
}
