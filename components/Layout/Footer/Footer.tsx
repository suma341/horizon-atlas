import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          {/* ロゴ */}
          <div className="text-2xl font-bold">
            HorizonAtlas
          </div>

          {/* リンク */}
          <nav className="flex flex-col md:flex-row gap-4 text-sm">
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href={'https://docs.google.com/forms/d/e/1FAIpQLScW_wz_h2Yd5ij50k8vH91EPUn_0EenEOJ9M147bcVl8KTQLA/viewform?usp=dialog'} target='_brank' rel="noopener noreferrer" className="hover:text-gray-300">改善要請</Link>
          </nav>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          © 2025 Ryukoku Horizon
        </p>
      </div>
    </footer>
  );
};


export default Footer;
