import Link from 'next/link';
import { PiArrowRightBold } from "react-icons/pi"; // アイコン追加

export default function BasicCurriculum() {
    return (
        <Link href={`/posts/course/basic`} className="block group">
            <section className='relative bg-gradient-to-br mb-6 border mx-auto rounded-lg p-5 shadow-lg hover:bg-slate-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300'>
                        基礎班カリキュラム
                    </h2>
                    <PiArrowRightBold className="text-3xl text-gray-600 group-hover:text-blue-700 transition-colors duration-300" />
                </div>
                <p className='text-gray-600 mt-2 text-sm leading-relaxed'>
                    PythonやFletライブラリを通してアプリ開発を学べるコースです。初心者向けに丁寧に解説！
                </p>
            </section>
        </Link>
    )
}
