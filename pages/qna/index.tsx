import Header from "@/components/about/header";
import Footer from "@/components/Layout/Footer/Footer";
import { VersionGW } from "@/lib/Gateways/VersionGW";
import { GetStaticProps } from "next";
import { useState } from "react";

const qnaList = [
  {
    question: "カリキュラムはどのように作成されていますか",
    answer: "Notionで作成したものをAtlasで公開しています",
  },
  {
    question: "カリキュラムの内容が間違っていた場合はどのように知らせればいいですか？",
    answer:
      "技術部の人に知らせるか、[こちら](https://docs.google.com/forms/d/e/1FAIpQLScW_wz_h2Yd5ij50k8vH91EPUn_0EenEOJ9M147bcVl8KTQLA/viewform?usp=dialog)から送信してください。",
  },
  {
    question: "進捗データがすぐに反映されないのはなぜですか？",
    answer:
      "cloudflareの無料枠を使っているため、使用を節約する必要があり、５分に一回に更新されます。それまではブラウザのキャッシュを使用しています。",
  },
  {
    question: "スマートフォンでも使えますか",
    answer: "はい、スマートフォン・タブレットにも対応しています。",
  },
];

export const getStaticProps: GetStaticProps = async () => {
  const v = await VersionGW.get()

  return {
    props:{
      v
    } 
  };
};

function renderTextWithLinks(text: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [full, label, url] = match;

    parts.push(text.slice(lastIndex, match.index));

    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-purple-600 underline-offset-4 hover:underline hover:text-purple-700 transition-colors"
      >
        {label}
      </a>
    );

    lastIndex = match.index + full.length;
  }

  parts.push(text.slice(lastIndex));
  return parts;
}

export default function QnAPage({v}:{v:string}) {

  return (
    <>
        <Header />
        <div className="min-h-screen bg-white px-4 py-20">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-14 text-center text-4xl font-extrabold tracking-tight text-gray-900">
                よくある質問
                </h1>

                <div className="space-y-6">
                {qnaList.map((item, index) => {
                    return <QnaItem question={item.question} answer={item.answer} key={index} />
                })}
                </div>
            </div>
        </div>
        <Footer version={v} />
    </>
  );
}

type itemProps= {
    question: string;
    answer: string;
}

const QnaItem=({question,answer}:itemProps)=>{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
            <button
                onClick={() =>
                setIsOpen((p)=>!p)
                }
                className="group flex w-full items-center justify-between px-7 py-5 text-left"
            >
                <span className="text-base font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                {question}
                </span>
                <span
                className={`text-2xl font-light text-purple-500 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : "rotate-0"
                }`}
                >
                ＋
                </span>
            </button>

            {isOpen && (
                <div className="px-7 pb-6 text-sm leading-relaxed text-gray-600">
                {renderTextWithLinks(answer)}
                </div>
            )}
            </div>
    )
}