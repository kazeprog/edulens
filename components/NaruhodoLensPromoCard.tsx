import Link from 'next/link';
import Image from 'next/image';

export default function NaruhodoLensPromoCard() {
    return (
        <Link
            href="/naruhodo-lens"
            prefetch={false}
            className="group relative block w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-sky-100 hover:border-sky-300 hover:shadow-xl transition-all duration-300 overflow-hidden mb-4"
        >
            {/* おすすめバッジ */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-sky-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-sm z-10">
                おすすめ
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* 画像エリア */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-sky-50 rounded-full scale-90 opacity-50"></div>
                    <Image
                        src="/naruhodolenslogo.png"
                        alt="ナルホドレンズ"
                        width={128}
                        height={128}
                        className="w-full h-full object-contain relative z-10"
                    />
                </div>

                {/* テキストエリア */}
                <div className="text-center sm:text-left flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">
                        わからない問題はAIに質問！
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-4">
                        <span className="font-bold text-sky-600">最短10秒でAIが解説！</span><br />
                        スマホで写真を撮るだけ。<br className="sm:hidden" />
                        24時間いつでも解説します。
                    </p>
                    <span className="inline-flex items-center gap-2 text-sky-600 font-bold border-b border-sky-200 group-hover:border-sky-500 pb-0.5 transition-all">
                        今すぐ質問する
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
