interface CTASectionProps {
    onSignupClick: () => void;
}

export default function CTASection({ onSignupClick }: CTASectionProps) {
    return (
        <section className="py-8 md:py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 md:p-12 shadow-xl text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                        今すぐ英語力向上を<br className="md:hidden" />始めよう
                    </h3>
                    <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed">
                        無料で始められます<br className="md:hidden" />
                        アカウント登録は1分で完了！
                    </p>
                    <button
                        onClick={onSignupClick}
                        className="bg-white text-red-600 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-colors"
                    >
                        無料で始める
                    </button>
                </div>
            </div>
        </section>
    );
}
