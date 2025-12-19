export default function FeaturesSection() {
    return (
        <section className="py-8 md:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                    なぜMistapが選ばれるのか
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                    {/* 特徴1 */}
                    <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50 text-center">
                        <div className="text-4xl md:text-5xl mb-3 md:mb-4">✏️</div>
                        <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">タップで簡単記録</h4>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            間違えた単語をタップするだけで<br className="md:hidden" />簡単に記録できます
                        </p>
                    </div>

                    {/* 特徴2 */}
                    <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50 text-center">
                        <div className="text-4xl md:text-5xl mb-3 md:mb-4">🔄</div>
                        <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">復習テスト機能</h4>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            間違えた単語のみで<br className="md:hidden" />復習テストを自動作成
                        </p>
                    </div>

                    {/* 特徴3 */}
                    <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50 text-center">
                        <div className="text-4xl md:text-5xl mb-3 md:mb-4">📖</div>
                        <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">豊富な教材対応</h4>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            LEAP、ターゲット、システム英単語<br className="md:hidden" />古文単語帳にも完全対応
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
