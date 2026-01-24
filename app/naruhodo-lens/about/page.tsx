import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Camera, MessageCircle, BookOpen, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
    title: 'ナルホドレンズ - AIが教える家庭教師アプリ | 数学・英語・理科の宿題解説',
    description: '「この問題わからない...」を10秒で解決。ナルホドレンズは、写真を撮るだけでAIが専属家庭教師のようにステップバイステップで解説する無料学習アプリです。数学の途中式、英語の長文読解、理科の計算問題に対応。中学生・高校生・大学受験生の独学を強力にサポートします。',
    openGraph: {
        title: 'ナルホドレンズ - スマホで撮るだけ！AI家庭教師',
        description: '写真を撮るだけでAIが「なぜそうなるのか」まで丁寧に解説。数学、英語、理科全対応の次世代学習ツール。',
        url: 'https://edulens.jp/naruhodo-lens/about',
        type: 'website',
        locale: 'ja_JP',
        siteName: 'EduLens',
        images: [
            {
                url: '/naruhodo-demo-main.png',
                width: 1200,
                height: 630,
                alt: 'ナルホドレンズ アプリ画面',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ナルホドレンズ - AIが教える家庭教師アプリ',
        description: '写真を撮るだけでAIが解説！数学・英語・理科の宿題やテスト勉強に。',
        images: ['/naruhodo-demo-main.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/naruhodo-lens/about',
    },
};

// Structured Data
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'SoftwareApplication',
            'name': 'ナルホドレンズ (Naruhodo Lens)',
            'applicationCategory': 'EducationalApplication',
            'operatingSystem': 'Web, iOS, Android',
            'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'JPY',
            },
            'featureList': 'AI解説, 画像認識, チャット形式の質問, テスト対策, 宿題サポート',
            'screenshot': 'https://edulens.jp/naruhodo-demo-main.png'
        },
        {
            '@type': 'FAQPage',
            'mainEntity': [
                {
                    '@type': 'Question',
                    'name': '無料で使えますか？',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'はい、基本的な機能は無料でご利用いただけます。無料プランでは1日あたりの質問回数に制限（2回まで）がありますが、高精度のAI解説を体験いただけます。'
                    }
                },
                {
                    '@type': 'Question',
                    'name': 'どんな教科に対応していますか？',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': '数学（算数）、英語、理科（物理・化学・生物・地学）、社会、国語など主要教科に対応しています。特に数学の途中式解説や、英語の文法解説で高い評価をいただいています。'
                    }
                },
                {
                    '@type': 'Question',
                    'name': 'Proプラン（有料）との違いは？',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'Proプランでは、1日の質問回数が大幅に増え（20回まで）、より混雑時でも優先的に回答が生成されます。テスト前など集中的に勉強したい時に便利です。'
                    }
                },
                {
                    '@type': 'Question',
                    'name': 'AIの回答は正確ですか？',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': '最新のAIモデルを使用しており非常に高い精度を誇りますが、100%の正解を保証するものではありません。あくまで学習の補助ツールとしてご活用ください。'
                    }
                }
            ]
        },
        {
            '@type': 'HowTo',
            'name': 'ナルホドレンズの使い方',
            'step': [
                {
                    '@type': 'HowToStep',
                    'name': '問題を撮影',
                    'text': 'わからない問題があったら、アプリを開いてカメラで撮影します。手書きの文字でも認識可能です。'
                },
                {
                    '@type': 'HowToStep',
                    'name': 'AI解説を見る',
                    'text': 'AIが問題を分析し、ステップバイステップでわかりやすく解説を作成します。'
                },
                {
                    '@type': 'HowToStep',
                    'name': '質問する',
                    'text': '解説を読んでわからない所があれば、チャット形式で追加の質問ができます。'
                }
            ]
        }
    ]
};

export default function NaruhodoLensAboutPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SiteHeader />
            <main className="bg-white min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-sky-50 to-white">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-100/50 to-transparent skew-x-12 transform origin-top-right z-0 pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                            <div className="flex-1 text-center md:text-left space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-bold mb-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                    </span>
                                    新世代の学習体験
                                </div>
                                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                                    <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">わからない問題は、写真を撮るだけ。</span>
                                    AIがあなたの<br />
                                    <span className="text-sky-500">専属家庭教師</span>に。
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                                    ナルホドレンズは、問題の画像をアップロードするとAIがステップバイステップで解説してくれる学習ツールです。<br />
                                    答えを教えるだけでなく、「なぜそうなるのか」まで丁寧に指導します。
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
                                    <Link
                                        href="/naruhodo-lens"
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-sky-200 hover:shadow-2xl hover:scale-105 hover:from-sky-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-6 h-6" />
                                        今すぐ質問する (無料)
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">
                                    ※ 登録不要で試せます
                                </p>
                            </div>

                            <div className="flex-1 w-full max-w-md md:max-w-full relative animate-in slide-in-from-right-5 fade-in duration-1000 delay-150">
                                <div className="relative w-full max-w-lg mx-auto">
                                    {/* Main App Screenshot */}
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <Image
                                            src="/naruhodo-demo-main.png"
                                            alt="ナルホドレンズ アプリ画面：AIが数学の文章題を解説している様子"
                                            width={600}
                                            height={800}
                                            className="w-full h-auto object-cover"
                                            priority
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">ナルホドレンズの3つの特徴</h2>
                            <p className="text-slate-600 text-lg">ただ答えを教えるだけではありません。<br className="hidden md:inline" />あなたの「理解」を深めるための工夫が詰まっています。</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Camera className="w-8 h-8 text-sky-500" />}
                                title="写真を撮って送るだけ"
                                description="難しい入力は不要。スマホでパシャリと撮って送信するだけで、AIが画像を認識して問題を読み取ります。"
                            />
                            <FeatureCard
                                icon={<MessageCircle className="w-8 h-8 text-purple-500" />}
                                title="対話形式で深く理解"
                                description="一方的な解説ではなく、チャット形式で質問できます。「ここがわからない」と聞けば、さらに噛み砕いて教えてくれます。"
                            />
                            <FeatureCard
                                icon={<BookOpen className="w-8 h-8 text-emerald-500" />}
                                title="全教科・全レベル対応"
                                description="数学の難問から英語の長文読解、理科の計算問題まで。小学生から大学受験生まで、あらゆるレベルに対応しています。"
                            />
                        </div>
                    </div>
                </section>

                {/* Step Section */}
                <section className="py-20 bg-slate-50 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">使い方はとっても簡単</h2>

                        <div className="space-y-12">
                            <StepRow
                                number="01"
                                title="問題を撮影"
                                description="わからない問題があったら、アプリを開いてカメラで撮影。手書きの文字でも認識可能です。"
                                image="/naruhodo-step1.png"
                                isReversed={false}
                            />
                            <StepRow
                                number="02"
                                title="AIが解説を作成"
                                description="読み取った問題をAIが分析し、となりに先生がついているかのように理解度を確認しながらわかりやすく解説します。途中式もしっかり提示。"
                                image="/naruhodo-step2.png"
                                isReversed={true}
                            />
                            <StepRow
                                number="03"
                                title="わからない所は質問"
                                description="解説を読んで疑問に思ったことは、そのままチャットで質問。納得いくまでとことん付き合います。"
                                image="/naruhodo-step3.png"
                                isReversed={false}
                            />
                        </div>
                    </div>
                </section>

                {/* Search Intent & Use Cases Section (Newly Added/Expanded) */}
                <section className="py-20 bg-white border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-16">こんな悩みを解決します</h2>

                        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className="order-2 md:order-1 space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="w-6 h-6" /></span>
                                    数学の途中式がわからない
                                </h3>
                                <div className="prose prose-slate text-slate-600">
                                    <p>
                                        「<strong>数学 解説 AI</strong>」で検索しても、答えしか出ないアプリに飽きていませんか？
                                        ナルホドレンズなら、答えだけでなく「どのようにその答えにたどり着いたか」という<strong>途中式</strong>も詳しく解説します。
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>複雑な因数分解や二次方程式の解法ステップ</li>
                                        <li>図形問題の補助線の引き方</li>
                                        <li>微分積分の計算過程</li>
                                    </ul>
                                    <p className="text-sm bg-blue-50 p-4 rounded-lg mt-4">
                                        <strong>ユーザーの声：</strong>「教科書の解説よりも丁寧で、どこで間違えたかがすぐにわかりました！」
                                    </p>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner flex items-center justify-center min-h-[300px]">
                                <Image
                                    src="/naruhodo-demo-main.png"
                                    alt="数学の問題を写真で解説するAI画面イメージ"
                                    width={300}
                                    height={500}
                                    className="rounded-xl shadow-lg border border-white"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner flex items-center justify-center min-h-[300px]">
                                <div className="text-center p-8">
                                    <p className="text-slate-400 font-bold mb-2">BEFORE</p>
                                    <p className="text-slate-600 mb-6">翻訳サイトに打ち込むのが面倒...</p>
                                    <div className="text-slate-300 transform rotate-90">➔</div>
                                    <p className="text-sky-500 font-bold mt-6 mb-2">AFTER</p>
                                    <p className="text-slate-800 font-bold text-lg">カメラで撮るだけ、<br />文法解説付きで即翻訳！</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <span className="p-2 bg-purple-100 text-purple-600 rounded-lg"><MessageCircle className="w-6 h-6" /></span>
                                    英語の長文読解・和訳
                                </h3>
                                <div className="prose prose-slate text-slate-600">
                                    <p>
                                        「<strong>英語 長文 AI</strong>」としても活用できます。長文読解問題の写真を撮れば、全訳だけでなく、
                                        文構造（SVOなど）の分解や、重要単語の意味まで解説します。
                                    </p>
                                    <p>
                                        わからない単語や熟語があっても、辞書を引くことなく、その場ですぐに意味を確認。
                                        <strong>AI家庭教師</strong>が、文脈に合わせた適切な訳を教えてくれます。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Clock className="w-6 h-6" /></span>
                                    宿題・定期テストの深夜の味方
                                </h3>
                                <div className="prose prose-slate text-slate-600">
                                    <p>
                                        「<strong>AI 宿題 解説</strong>」が必要になるのは、たいてい夜遅くです。
                                        塾の先生や学校の先生に質問できない時間帯でも、ナルホドレンズなら24時間365日、いつでも即座に回答します。
                                    </p>
                                    <p>
                                        「<strong>問題 写真 解説</strong>」機能を使えば、手書きのノートやプリントの問題も高精度に認識。
                                        テスト前日の「これなんだっけ？」をその場で解決し、安心して眠りにつけます。
                                    </p>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="font-bold text-xl mb-4">⏰ 23:45</div>
                                    <p className="font-medium text-lg mb-6">「明日提出の宿題、ここだけ解き方がわからない...」</p>
                                    <p className="text-emerald-400 font-bold text-xl">✨ ナルホドレンズなら3秒で解決。</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Comparison Section (AI vs Tutor) */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">家庭教師 vs AIアプリ 徹底比較</h2>
                        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                            「<strong>家庭教師 AI 比較</strong>」で迷っている方へ。それぞれのメリット・デメリットを整理しました。
                            ナルホドレンズは、家庭教師の「丁寧さ」とAIの「手軽さ」をいいとこ取りしたサービスです。
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-slate-600 font-medium w-1/4">比較項目</th>
                                        <th className="py-4 px-6 text-center text-slate-600 font-medium w-1/4">一般的な家庭教師</th>
                                        <th className="py-4 px-6 text-center text-slate-600 font-medium w-1/4">検索エンジン</th>
                                        <th className="py-4 px-6 text-center bg-blue-50 text-blue-700 font-bold w-1/4">ナルホドレンズ (AI)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm md:text-base">
                                    <tr>
                                        <td className="py-5 px-6 font-bold text-slate-700">質問できる時間</td>
                                        <td className="py-5 px-6 text-center">週1〜2回 (60-90分)</td>
                                        <td className="py-5 px-6 text-center">24時間</td>
                                        <td className="py-5 px-6 text-center bg-blue-50/30 font-bold text-blue-700">24時間365日</td>
                                    </tr>
                                    <tr>
                                        <td className="py-5 px-6 font-bold text-slate-700">解説のわかりやすさ</td>
                                        <td className="py-5 px-6 text-center">◎ (対話で解決)</td>
                                        <td className="py-5 px-6 text-center">△ (自分に合う記事を探すのが大変)</td>
                                        <td className="py-5 px-6 text-center bg-blue-50/30 font-bold text-blue-700">◎ (対話形式で深掘り可能)</td>
                                    </tr>
                                    <tr>
                                        <td className="py-5 px-6 font-bold text-slate-700">特定の宿題への対応</td>
                                        <td className="py-5 px-6 text-center">◎</td>
                                        <td className="py-5 px-6 text-center">✕ (まったく同じ問題はない)</td>
                                        <td className="py-5 px-6 text-center bg-blue-50/30 font-bold text-blue-700">◎ (写真にとって即解析)</td>
                                    </tr>
                                    <tr>
                                        <td className="py-5 px-6 font-bold text-slate-700">料金</td>
                                        <td className="py-5 px-6 text-center">月2万〜5万円</td>
                                        <td className="py-5 px-6 text-center">無料</td>
                                        <td className="py-5 px-6 text-center bg-blue-50/30 font-bold text-blue-700">基本無料</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ Section (SEO Content Rich) */}
                <section className="py-20 bg-white border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">よくある質問</h2>

                        <div className="space-y-6">
                            <FAQItem
                                question="無料で使えますか？"
                                answer="はい、基本的な機能は無料でご利用いただけます。無料プランでは1日あたりの質問回数に制限（2回まで）がありますが、高精度のAI解説を体験いただけます。"
                            />
                            <FAQItem
                                question="どんな教科に対応していますか？"
                                answer="数学（算数）、英語、理科（物理・化学・生物・地学）、社会、国語など主要教科に対応しています。特に数学の途中式解説や、英語の文法解説で高い評価をいただいています。"
                            />
                            <FAQItem
                                question="Proプラン（有料）との違いは？"
                                answer="Proプランでは、1日の質問回数が大幅に増え（20回まで）、より混雑時でも優先的に回答が生成されます。テスト前など集中的に勉強したい時に便利です。"
                            />
                            <FAQItem
                                question="AIの回答は正確ですか？"
                                answer="最新のAIモデルを使用しており非常に高い精度を誇りますが、100%の正解を保証するものではありません。あくまで学習の補助ツールとしてご活用ください。"
                            />
                            <FAQItem
                                question="写真を使わずにテキスト入力で質問できますか？"
                                answer="はい、可能です。手元に画像がない場合でも、キーボード入力で質問内容を送信すればAIが回答します。"
                            />
                        </div>
                    </div>
                </section>

                {/* SEO Text Block (Bottom) - Significantly Expanded */}
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="prose prose-sm prose-slate max-w-none text-slate-500">
                            <h3 className="text-lg font-bold text-slate-700 mb-4">AI家庭教師アプリ「ナルホドレンズ」とは</h3>
                            <p>
                                ナルホドレンズは、最先端の画像認識技術と生成AIを組み合わせた、新しい形の学習サポートアプリです。
                                従来の勉強アプリでは難しかった「特定の問題集の解説」や「自分の手書きノートの添削」も、<strong>写真撮影からわずか数秒</strong>で完了します。
                            </p>

                            <h4 className="text-base font-bold text-slate-700 mt-6 mb-2">対応科目と活用シーン</h4>
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h5 className="font-bold text-slate-700">数学・算数</h5>
                                    <p>
                                        因数分解、方程式、関数、図形証明、確率統計など、中学・高校数学の全範囲に対応。
                                        「答えは合っているけど途中式がわからない」という悩みを解消するために、AIが論理的かつステップバイステップで式変形を解説します。
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-700">英語</h5>
                                    <p>
                                        英文解釈、和訳、文法問題の解説に対応。
                                        教科書の長文読解でつまずいた時も、カメラで撮るだけで単語の意味や構文構造を解析し、日本語訳とあわせて表示します。
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-700">理科（物理・化学・生物）</h5>
                                    <p>
                                        物理の力学計算や化学反応式の係数合わせなど、理系科目の計算プロセスも丁寧に記述。
                                        「なぜこの公式を使うのか」という根本的な理解を助けます。
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-700">受験対策・資格試験</h5>
                                    <p>
                                        大学入学共通テスト、高校入試の過去問、定期テスト対策はもちろん、
                                        SPIや公務員試験の数的推理など、学習に関わるあらゆる疑問に対応可能です。
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-base font-bold text-slate-700 mt-6 mb-2">独学の限界を突破する</h4>
                            <p>
                                独学で最も辛いのは「わからない場所で止まってしまうこと」です。
                                ナルホドレンズは、そんな「学習のボトルネック」を解消するために開発されました。
                                「AIに聞くなんてズルじゃないか？」と思うかもしれませんが、わからないまま放置するよりも、
                                <strong>AIの解説を読んで理解し、類題を自力で解けるようになること</strong>こそが、真の学力向上につながります。
                            </p>
                            <p>
                                家庭教師を雇う余裕がない、塾に行く時間がない、深夜に勉強したい。
                                そんなすべての学習者のために、ナルホドレンズは「ポケットの中の専属家庭教師」として、あなたの学習を24時間サポートし続けます。
                            </p>

                            <hr className="my-12 border-slate-200" />

                            <h3 className="text-xl font-bold text-slate-800 mb-6">ナルホドレンズの仕組み：画像認識と生成AIの融合</h3>
                            <p>
                                ナルホドレンズが高い精度で問題を解説できる背景には、最新の<strong>画像認識技術（Computer Vision）</strong>と<strong>大規模言語モデル（LLM）</strong>の高度な連携があります。
                            </p>
                            <h5 className="font-bold text-slate-700 mt-4">1. 高精度な文字・数式認識</h5>
                            <p>
                                従来のOCR（文字認識）ソフトでは、手書きの「<span className="font-mono">x</span>」と「<span className="font-mono">×</span>（かける）」の区別や、複雑な分数の認識、幾何学問題の図形の読み取りは困難でした。
                                ナルホドレンズは、数式や図形に特化した視覚モデルを採用しており、問題文の構造を正確に把握します。縦書きの国語の文章や、書き込みのあるプリントでも高い精度で認識可能です。
                            </p>
                            <h5 className="font-bold text-slate-700 mt-4">2. 教育に特化した生成AI</h5>
                            <p>
                                画像から読み取った情報は、単なるテキストデータとしてではなく、「学習者が何を求めているか」というコンテキスト（文脈）と共にAIに渡されます。
                                裏側で動くAIモデルには、「答えをただ提示するのではなく、途中経過を論理的に説明する」「生徒の学年に合わせて言葉選びを変える」といった、熟練の家庭教師のような振る舞いをさせるための特殊な指示（プロンプトエンジニアリング）が組み込まれています。
                            </p>

                            <h3 className="text-xl font-bold text-slate-800 mt-12 mb-6">従来の学習アプリ・AI家庭教師との決定的な違い</h3>
                            <p>
                                世の中には多くの学習アプリが存在しますが、ナルホドレンズはその中でも「<strong>疑問解決の即時性</strong>」に特化しています。
                            </p>
                            <div className="my-6 border-l-4 border-sky-400 pl-4 bg-sky-50 py-2 pr-2 rounded-r">
                                <h5 className="font-bold text-sky-800 mb-2">動画授業アプリとの違い</h5>
                                <p className="text-sky-900 text-sm">
                                    動画授業は「体系的な知識のインプット」には最適ですが、「今解いているこの問題がわからない」というピンポイントな悩みには対応できません。
                                    ナルホドレンズは、あなたの目の前にある特定の問題に対して、オーダーメイドの解説を提供します。
                                </p>
                            </div>
                            <div className="my-6 border-l-4 border-emerald-400 pl-4 bg-emerald-50 py-2 pr-2 rounded-r">
                                <h5 className="font-bold text-emerald-800 mb-2">ドリル・一問一答アプリとの違い</h5>
                                <p className="text-emerald-900 text-sm">
                                    問題を出すだけのアプリとは異なり、ナルホドレンズは「解説」がメインです。
                                    「なぜ間違えたのか」「次はどう考えればいいのか」という思考プロセスを重視するため、応用力が身につきます。
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mt-12 mb-6">ChatGPTや他のAIツールとの違い</h3>
                            <p>
                                「ChatGPTに聞くのとどう違うの？」という質問をよくいただきます。
                                確かに汎用的なAIでも学習サポートは可能ですが、ナルホドレンズは<strong>学習専用にチューニングされた体験</strong>を提供します。
                            </p>
                            <ul className="list-disc pl-5 space-y-3 mt-4">
                                <li>
                                    <strong>プロンプト不要：</strong>
                                    ChatGPTで適切な解説を引き出すには、「中学生にわかるように」「ステップバイステップで」といった指示を自分で考える必要があります。ナルホドレンズは最初から教育向けに最適化されているため、写真を撮るだけで最適な解説が得られます。
                                </li>
                                <li>
                                    <strong>数式表示の最適化：</strong>
                                    一般的なチャットAIでは、複雑な数式が崩れて表示されたり、読みづらいテキスト形式で出力されたりすることがあります。本アプリでは、数学の記述に特化したレンダリングエンジン（KaTeX等）を使用しており、教科書と同じように綺麗な数式で解説を読めます。
                                </li>
                                <li>
                                    <strong>スマホ特化のUI：</strong>
                                    片手で撮影し、すぐに解説を読む。勉強のフローを止めないためのUI/UXを徹底的に追求しています。
                                </li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-800 mt-12 mb-6">教育現場・学習塾での活用事例</h3>
                            <p>
                                ナルホドレンズは、個人の自習だけでなく、教育現場でも導入が進んでいます。
                            </p>
                            <h5 className="font-bold text-slate-700 mt-4">自立学習型授業のサポート</h5>
                            <p>
                                先生が生徒一人ひとりの質問に全て答えるのは物理的に不可能です。特に試験前などの繁忙期には、質問待ちの行列ができてしまうこともあります。
                                「基礎的な質問はAIで即座に解決し、進路相談やモチベーション管理、難問の深い指導は人間の先生が行う」という役割分担により、教育の質が向上します。
                            </p>
                            <h5 className="font-bold text-slate-700 mt-4">「反転授業」のツールとして</h5>
                            <p>
                                自宅で問題を解き、AIで理解を深めてから、教室ではディスカッションや応用問題に取り組む。
                                そんな「反転授業」の心強いパートナーとして活用されています。
                            </p>

                            <h3 className="text-xl font-bold text-slate-800 mt-12 mb-6">偏差値を上げる！ナルホドレンズの効果的な使い方</h3>
                            <p>
                                AIアプリを使った勉強にはコツがあります。ただ答えを写すだけでは成績は伸びません。
                                偏差値を確実に上げるための「3ステップ活用法」をご紹介します。
                            </p>
                            <div className="space-y-4 mt-6">
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <h6 className="font-bold text-blue-600">STEP 1. 解説を読む前に「1分」だけ考える</h6>
                                    <p className="text-sm mt-1">
                                        すぐに写真を撮るのも良いですが、まずは自分で問題を見て「何がわからないのか」を言語化しましょう。「単語がわからないのか」「公式を忘れたのか」。
                                        その意識を持ってAIの解説を読むと、定着率が段違いに上がります。
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <h6 className="font-bold text-blue-600">STEP 2. 「なぜ？」をAIに突っ込む</h6>
                                    <p className="text-sm mt-1">
                                        解説を読んで「ふーん」で終わらせないこと。
                                        「どうしてここでこの公式を使うの？」「この変形はどうやったの？」と、納得いくまでチャットで質問してください。
                                        ナルホドレンズは何度聞いても嫌な顔ひとつしません。
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <h6 className="font-bold text-blue-600">STEP 3. 解説を閉じて、もう一度解く</h6>
                                    <p className="text-sm mt-1">
                                        これが最も重要です。わかった気になっても、実際に手を動かすと解けないことはよくあります。
                                        AIの解説を閉じ、白い紙にもう一度自力で解答を再現できるか試してください。再現できて初めて「理解した」と言えます。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">もう、ひとりで悩まない。</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            24時間365日、あなたの勉強をサポートします。<br />
                            今すぐナルホドレンズを体験しよう。
                        </p>
                        <Link
                            href="/naruhodo-lens"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-xl shadow-lg hover:shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                        >
                            解説を体験する
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-6 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}

function StepRow({ number, title, description, image, isReversed }: { number: string, title: string, description: string, image: string, isReversed: boolean }) {
    // If the image is a mock/placeholder, render the placeholder box.
    // Otherwise, render the actual image.
    const isMock = image.includes('_mock.png');

    return (
        <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isReversed ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 space-y-4">
                <span className="text-5xl font-black text-slate-200">{number}</span>
                <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{description}</p>
            </div>

            <div className={`flex-1 w-full ${isMock ? 'aspect-video' : ''} flex items-center justify-center`}>
                {isMock ? (
                    <div className="w-full h-full bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-300">
                        <div className="text-center">
                            <Image className="mx-auto mb-2 opacity-50" src="/naruhodolenslogo.png" width={48} height={48} alt="step" />
                            <span className="text-sm font-medium">Image: {title}</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                        <Image
                            src={image}
                            width={600}
                            height={400}
                            alt={title}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-start gap-3 mb-3">
                <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded mt-0.5 shrink-0">Q</span>
                {question}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed pl-9">
                {answer}
            </p>
        </div>
    );
}
