'use client';

import Link from 'next/link';

interface HeroSectionProps {
    onSignupClick: () => void;
}

export default function HeroSection({ onSignupClick }: HeroSectionProps) {
    return (
        <section className="py-6 md:py-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-12 shadow-xl border border-white/50 mb-8">
                    <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
                        もう忘れない。<br />「間違えた単語」に集中する<br />新しい単語学習システム。
                    </h1>
                    <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
                        『システム英単語』『ターゲット1900』『LEAP』『DUO3.0』、社会人・大学生向けの『TOEIC 金のフレーズ』、さらに古文単語帳など、主要な単語帳に幅広く対応。<br />
                        全ての知識を確実に定着させます。
                    </p>
                    <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center items-center">
                        <button
                            onClick={onSignupClick}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
                        >
                            アカウント作成(無料)
                        </button>
                        <Link
                            href="/mistap/about"
                            prefetch={false}
                            className="text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
                        >
                            詳しく見る
                        </Link>
                        <button
                            onClick={() => {
                                const element = document.getElementById('textbook-list');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className="text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
                        >
                            対応教材一覧
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
