import Link from "next/link";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div className="text-2xl font-bold">
            HorizonAtlas
          </div>

          <nav className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/qna" className="hover:text-gray-300">QnA</Link>

            <Link
              href="https://github.com/suma341/horizon-atlas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
          </nav>
        </div>

        <p className="mt-8 flex flex-col md:flex-row md:justify-between text-xs text-gray-400">
          <span>
            © 2025 Ryukoku Horizon<br />
            Built & maintained by suma341
          </span>
          <span className="mt-2 md:mt-0">
            version 1.0.0
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
