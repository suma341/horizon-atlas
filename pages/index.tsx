// pages/index.js
import LoginButton from '@/components/LoginButton/loginButton';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Horizon TechShelf</title>
        <meta name="description" content="Horizon TechShelf - 学習資料をまとめたWebアプリ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-neutral-300 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Horizon TechShelf</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-16">
          <h2 className="text-4xl font-bold text-gray-800">Welcome to Horizon TechShelf</h2>
          <p className="text-gray-600 mt-4">プログラミング部Horizonで使用する学習資料を簡単に閲覧、検索できます。</p>
          <div className="mt-8">
          <SessionProvider>
            <LoginButton />
          </SessionProvider>
            <a
              href="#features"
              className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600"
            >
              Learn More
            </a>
          </div>
        </section>

        <section id="about" className="py-16">
          <h3 className="text-3xl font-bold text-gray-800">About Horizon TechShelf</h3>
          <p className="text-gray-600 mt-4">
            Horizon TechShelfは、学習資料を整理して部員全員でアクセスできるアプリです。
            基礎班カリキュラム、web、スマホアプリなど、自分の見たい学習資料を簡単に探せます。
          </p>
        </section>

        <section id="features" className="py-16 px-4 bg-gray-100 rounded-lg">
          <h3 className="text-3xl font-bold text-gray-800">Features</h3>
          <ul className="mt-4 space-y-4">
            <li className="text-gray-600">✔️ 資料のカテゴリ別整理</li>
            <li className="text-gray-600">✔️ Horizon部員全員のみアクセス可能</li>
            <li className="text-gray-600">✔️ 最新の資料アップロードと検索機能</li>
          </ul>
        </section>

        <section id="contact" className="py-16">
          <h3 className="text-3xl font-bold text-gray-800">Contact Us</h3>
          <p className="text-gray-600 mt-4">ご意見や質問がありましたら、以下のメールアドレスまでご連絡ください。</p>
          <p className="text-blue-600 mt-2">horizon-techshelf@example.com</p>
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
