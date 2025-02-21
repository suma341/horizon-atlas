// pages/index.js
import AuthButton from '@/components/LoginButton/loginButton';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>HorizonAtlas</title>
        <meta name="description" content="HorizonAtlas - Horizonの学習資料をまとめたWebアプリ" />
        <meta property="og:image" content="/horizon-atlas/app_image.png"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-neutral-300 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">HorizonAtlas</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#features" className="hover:underline">Features</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-16">
          <h2 className="text-4xl font-bold text-gray-800">Welcome to HorizonAtlas</h2>
          <p className="text-gray-600 mt-4">プログラミング部Horizonで使用する学習資料を簡単に閲覧、検索できます。</p>
          <div className="mt-8 flex justify-center">
            <AuthButton />
          </div>
          <div className='mt-1 flex justify-center text-xs text-neutral-500'>
            ⚠️Horizonサーバーのメンバーアカウントのみログインできます
          </div>
        </section>

        <section id="features" className="py-16 px-4 bg-gray-100 rounded-lg">
          <h3 className="text-3xl font-bold text-gray-800">Features</h3>
          <ul className="mt-4 space-y-4">
            <li className="text-gray-600">✔️ 資料のカテゴリ別整理</li>
            <li className="text-gray-600">✔️ Horizon部員全員のみアクセス可能</li>
            <li className="text-gray-600">✔️ 最新の資料アップロードと検索機能</li>
          </ul>
        </section>

      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2024 Horizon Programming Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
