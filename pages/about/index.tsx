import { useState } from 'react'
import Header from '@/components/top/header'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function AboutDetail() {
    const [openSection, setOpenSection] = useState<string | null>(null)

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section)
    }

    return (
        <>
            <Header />
            <section className="py-20 bg-gray-50 px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl font-bold text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        HorizonAtlasとは？
                    </motion.h2>
                    <div className="w-16 h-1 bg-purple-700 mx-auto my-4"></div>

                    <motion.p
                        className="text-lg text-gray-700 mt-4 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        HorizonAtlasは、龍谷大学プログラミング部Horizonの部員専用の学習支援サービスです。
                        プログラミングの基礎からアプリ開発まで、幅広いカリキュラムを提供し、部員の学習をサポートします。
                    </motion.p>
                </div>
                <motion.div
                    className="mt-10 flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Image src="/horizonatlas-demo.png" width={800} height={400} alt="HorizonAtlasのデモ画面" className="rounded-lg shadow-lg" />
                </motion.div>

                <div className="max-w-4xl mx-auto mt-16">
                    <button
                        className="text-2xl font-semibold text-gray-800 w-full text-left focus:outline-none"
                        onClick={() => toggleSection('serviceName')}
                    >
                        サービス名の由来
                    </button>
                    <div className="w-12 h-1 bg-purple-700 my-2"></div>
                    <AnimatePresence>
                        {openSection === 'serviceName' && (
                            <motion.ul
                                className="mt-4 text-lg text-gray-700 space-y-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className='font-bold'>HorizonAtlasという名前の由来</p>
                                <p>
                                    「HorizonAtlas」は、プログラミング部Horizonの名前と、地図帳を意味するAtlasを組み合わせたものです。
                                    多様なカリキュラムを通じて、部員が学習の道しるべを見つけられるような、技術知識の地図帳を目指しています。
                                </p>
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                <div className="max-w-4xl mx-auto mt-16">
                    <button
                        className="text-2xl font-semibold text-gray-800 w-full text-left focus:outline-none"
                        onClick={() => toggleSection('features')}
                    >
                        主な機能
                    </button>
                    <div className="w-12 h-1 bg-purple-700 my-2"></div>
                    <AnimatePresence>
                        {openSection === 'features' && (
                            <motion.ul
                                className="mt-4 text-lg text-gray-700 space-y-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <li>プログラミングの基礎から、アプリ開発・ツールの使い方まで幅広いカリキュラムを公開</li>
                                <li>カテゴリ別にカリキュラムを整理し、学習をスムーズに</li>
                                <li>キーワード検索で学習資料をすぐに探せる</li>
                                <li>進捗を確認できる</li>
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                <div className="max-w-4xl mx-auto mt-16">
                    <button
                        className="text-2xl font-semibold text-gray-800 w-full text-left focus:outline-none"
                        onClick={() => toggleSection('faq')}
                    >
                        カリキュラムの制作方法
                    </button>
                    <div className="w-12 h-1 bg-purple-700 my-2"></div>
                    
                </div>


                <div className="flex justify-center mt-10">
                    <motion.button
                        className="px-6 py-3 bg-purple-700 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-purple-800 transition"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        カリキュラム一覧を見る
                    </motion.button>
                </div>
            </section>
        </>
    )
}

export default AboutDetail
