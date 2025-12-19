export default function TestimonialsSection() {
    const testimonials = [
        {
            initial: 'A',
            color: 'bg-blue-500',
            name: '高校2年生 A.Tさん',
            textbook: 'システム英単語使用',
            quote: '「間違えた単語をタップするだけで記録できるから便利！」',
        },
        {
            initial: 'M',
            color: 'bg-green-500',
            name: '中学3年生 M.Sさん',
            textbook: 'ターゲット1900使用',
            quote: '「間違えた単語だけの復習テストが自動で作られるので効率的に覚えられます。」',
        },
        {
            initial: 'R',
            color: 'bg-purple-500',
            name: '高校3年生 R.Kさん',
            textbook: 'ターゲット1900使用',
            quote: '「受験勉強で愛用しています。苦手な単語を繰り返し復習できるので助かっています」',
        },
        {
            initial: 'Y',
            color: 'bg-orange-500',
            name: '高校1年生 Y.Hさん',
            textbook: 'システム英単語使用',
            quote: '「学校のテストの前に復習テストを何度も繰り返したら、毎回の単語テストで満点取れるようになりました！」',
        },
        {
            initial: 'S',
            color: 'bg-pink-500',
            name: '中学2年生 S.Nさん',
            textbook: 'ターゲット1800使用',
            quote: '「スマホで隙間時間に復習できるから、通学時間も無駄にならなくなりました！」',
        },
        {
            initial: 'K',
            color: 'bg-indigo-500',
            name: '高校3年生 K.Mさん',
            textbook: 'LEAP使用',
            quote: '「自分専用の復習リストができるから、市販の単語帳より効率的。定期テストの単語の大問で満点取れるようになりました！」',
        },
    ];

    return (
        <section className="py-8 md:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                    利用者の声
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-xl border border-white/50">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className={`w-10 h-10 md:w-12 md:h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4`}>
                                    {t.initial}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{t.name}</p>
                                    <p className="text-xs md:text-sm text-gray-600">{t.textbook}</p>
                                </div>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                                {t.quote}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
