import Link from "next/link";
import { Github } from "lucide-react";

type FooterProps={
  version:string
}

const Footer = ({version}:FooterProps) => {
  return (
    <footer className="bg-gray-700 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6">
          <div className="text-2xl font-bold">
            HorizonAtlas
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/qna" className="hover:text-gray-300">QnA</Link>
          </nav>

          <Link
            href="https://github.com/suma341/horizon-atlas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-300 hover:text-white transition
                      flex items-center justify-center
                      w-12 h-12 rounded-full
                      bg-gray-600 hover:bg-gray-500"
          >
            <Github size={26} />
          </Link>
        </div>
        <p className="mt-8 flex flex-col md:flex-row md:justify-between text-xs text-gray-400">
          <span>
            © 2026 RyukokuHorizon<br />
            Built & maintained by suma341
          </span>
          <span className="mt-2 md:mt-0">
            version {version.slice(0,6)}
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
