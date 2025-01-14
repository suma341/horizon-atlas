import { pageNav } from '@/types/pageNav';
import Link from 'next/link';
import { useEffect, useState } from "react";

type Props={
    title:string;
    slug:string;
    childPages:pageNav[];
}

const Sidebar = ({ title, childPages, slug }:Props) => {
  const [isFixed, setIsFixed] = useState(false);

  const getPageHeight = () => {
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    return pageHeight;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= getPageHeight() - 1000 || window.scrollY <= 40) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // クリーンアップ
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.scrollY]);

  return (
    <section className="hidden md:block w-36 lg:w-44 mt-14 ml-2">
      <div
        className={"border h-screen fixed overflow-y-scroll scrollbar-thin py-4 rounded-md w-36 lg:w-44"}
        style={isFixed ? {opacity:0} : {opacity:"75",height:"400px"}}
      >
        <p className="truncate text-sm px-1">{title}</p>
        <div className="pl-4">
          {childPages.map((page, i) => (
            <Link href={`/posts/post/${slug}/${page.id}`} key={i} className="w-36 lg:w-44">
              <p className="my-1.5 text-sm text-neutral-500 underline truncate hover:text-neutral-900">
                {page.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div
        className={`border h-screen relative overflow-y-scroll scrollbar-thin py-4 rounded-md`}
        style={isFixed ? { top: window.scrollY <= 40 ? "40px" : `${getPageHeight() - 1000}px` ,opacity:"75",height:"400px" } : {opacity:0}}
      >
        <p className="truncate text-sm px-1">{title}</p>
        <div className="pl-4">
          {childPages.map((page, i) => (
            <Link href={`/posts/post/${slug}/${page.id}`} key={i} className="w-36 lg:w-44">
              <p className="my-1.5 text-sm text-neutral-500 underline truncate hover:text-neutral-900">
                {page.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
