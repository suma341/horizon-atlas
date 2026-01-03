import Header from "@/components/about/header";
import Footer from "@/components/Layout/Footer/Footer";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { MdOutlineQuestionAnswer } from "react-icons/md";

export default function ContactPage() {
  return (
    <>
        <Header />
        <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-xl space-y-10">
                {/* Title */}
                <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Contact
                </h1>
                <p className="text-sm text-gray-500">
                    お問い合わせ
                </p>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                <ContactCard
                    icon={<FaGithub />}
                    iconBg="bg-purple-100 text-purple-700"
                    title="GitHub"
                    description="ソースコード・不具合報告はこちらから"
                    href="https://github.com/suma341/horizon-atlas"
                    accent="border-purple-500"
                    buttonClass="bg-purple-600 text-white hover:bg-purple-700"
                    buttonText="GitHubを見る"
                />

                <ContactCard
                    icon={<MdOutlineQuestionAnswer />}
                    iconBg="bg-purple-100 text-purple-700"
                    title="アンケート"
                    description="カリキュラム内容について問題や改善案があればこちら"
                    href="https://docs.google.com/forms/d/e/1FAIpQLScW_wz_h2Yd5ij50k8vH91EPUn_0EenEOJ9M147bcVl8KTQLA/viewform?usp=dialog"
                    accent="border-purple-300"
                    buttonClass="bg-purple-100 text-purple-700 hover:bg-purple-200"
                    buttonText="開く"
                />
                </div>

                <p className="text-xs text-gray-400 text-center">
                ※ アンケートには大学アカウントのみアクセス可能です。
                </p>
            </div>
        </main>
        <Footer />
    </>
  );
}

type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  accent: string;
  iconBg: string;
  buttonClass: string;
  buttonText: string;
};

function ContactCard({
  icon,
  title,
  description,
  href,
  accent,
  iconBg,
  buttonClass,
  buttonText,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border ${accent} bg-white p-6
                  shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center
                      rounded-lg ${iconBg}`}
        >
          <span className="text-xl">{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          </div>

          <Link
            href={href}
            target="_blank"
            className={`inline-flex items-center justify-center
                        rounded-lg px-4 py-2 text-sm font-medium
                        transition ${buttonClass}`}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
