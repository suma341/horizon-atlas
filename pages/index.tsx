"use client";
import AuthButton from '@/components/LoginButton/loginButton';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const scrollToSection = (targetId:string) => {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          <nav className="hidden md:flex space-x-6">
            {['about', 'curriculum', 'features'].map((section) => (
              <motion.button
                key={section}
                onClick={()=>scrollToSection(section)}
                className="text-gray-800 hover:text-purple-700 text-lg font-medium relative group"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
              >
                {section}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-purple-700 transition-all group-hover:w-full"></span>
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

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
          <div className="mt-8 flex justify-center">
            <AuthButton  />
          </div>
          <div className='mt-2 text-sm text-gray-50'>⚠️Horizonサーバーのメンバーアカウントのみログインできます</div>
        </section>
        <section id="about" className="py-20 bg-white px-8">
          <motion.h3 
            className="text-3xl font-bold text-gray-800 border-b-4 border-purple-700 inline-block pb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            About HorizonAtlas
          </motion.h3>
          <motion.p
            className="text-lg mt-4 text-gray-600 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            HorizonAtlasは、龍谷大学プログラミング部Horizonの部員専用の学習支援アプリです。<br />
            部員が学習資料を効率よく閲覧できるように、カリキュラムのカテゴリ別整理や、検索機能を具えています。
            view more...
          </motion.p>
        </section>

        <section id="curriculum" className="py-20 bg-gray-50 px-8">
          <h3 className="text-3xl font-bold text-gray-800 text-center">Curriculum</h3>
          <div className="w-16 h-1 bg-purple-700 mx-auto mb-8"></div>
          <p className="text-lg mt-4 text-gray-600">Horizonの学習カリキュラムの一部を紹介します。</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {[
              { title: 'Gitの基礎', description: 'バージョン管理システムの使い方' },
              { title: 'Flet入門', description: 'Fletを使ったアプリの作り方' },
              { title: 'Python入門', description: 'プログラミングの基本を学ぶ' }
            ].map((curriculum, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-bold text-purple-700">{curriculum.title}</h4>
                <p className="text-gray-600 mt-2">{curriculum.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-100 px-8">
          <h3 className="text-3xl font-bold text-gray-800 text-center">Features</h3>
          <div className="w-16 h-1 bg-purple-700 mx-auto mb-8"></div>
          <ul className="mt-6 space-y-4 text-lg text-gray-700">
            <li className="flex items-center space-x-2"><span className="text-purple-700 text-xl">✔️</span> <span>カリキュラムのカテゴリ別整理</span></li>
            <li className="flex items-center space-x-2"><span className="text-purple-700 text-xl">✔️</span> <span>最新の進捗を確認できる</span></li>
            <li className="flex items-center space-x-2"><span className="text-purple-700 text-xl">✔️</span> <span>最新の資料アップロードと検索機能</span></li>
          </ul>
        </section>
      </main>

      <footer className="bg-gray-200 text-gray-700 py-4 text-center">
        <p className="text-sm">&copy; 2025 Ryukoku Horizon</p>
      </footer>
    </div>
  );
}
