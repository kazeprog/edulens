import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Camera, MessageCircle, BookOpen, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
    title: 'ナルホドレンズ - AIが教える家庭教師アプリ | 数学・英語・理科の宿題解説',
    description: '「この問題わからない...」を10秒で解決。ナルホドレンズは、写真を撮るだけでAIが専属家庭教師のようにステップバイステップで解説する無料学習アプリです。数学の途中式、英語の長文読解、理科の計算問題に対応。中学生・高校生・大学受験生の独学を強力にサポートします。',
    keywords: [
        'ナルホドレンズ', 'EduLens', 'AI家庭教師', '勉強アプリ', '宿題代行', '数学アプリ',
        '途中式', '英語解説', '無料学習アプリ', '大学受験', '高校入試', '共通テスト対策',
        '定期テスト対策', '独学', '質問アプリ'
    ],
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
            'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.8',
                'ratingCount': '1250'
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
                        </div>
                    </div>
                </section>

                {/* SEO Text Block (Bottom) */}
                <section className="py-12 bg-slate-50 text-slate-500 text-sm">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h3 className="font-bold text-slate-700 mb-4">ナルホドレンズについて</h3>
                        <p className="leading-relaxed mb-4">
                            ナルホドレンズは、EduLensが提供するAI学習アシスタントサービスです。従来の「答えを検索する」だけの勉強法から、「AIと対話して理解する」新しい学習スタイルを提案します。
                            独学で勉強している中学生、高校生、大学受験生にとって、いつでも質問できる家庭教師のような存在を目指しています。
                            宿題の解き方がわからない時、予習・復習でつまずいた時、過去問の解説が理解できない時など、様々なシーンで活用いただけます。
                            共通テスト対策や定期テスト前の追い込みにも最適です。
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <span className="bg-white border px-2 py-1 rounded text-xs">数学解説</span>
                            <span className="bg-white border px-2 py-1 rounded text-xs">英語添削</span>
                            <span className="bg-white border px-2 py-1 rounded text-xs">物理化学</span>
                            <span className="bg-white border px-2 py-1 rounded text-xs">宿題ヘルパー</span>
                            <span className="bg-white border px-2 py-1 rounded text-xs">大学入試対策</span>
                            <span className="bg-white border px-2 py-1 rounded text-xs">高校入試対策</span>
                            <span className="bg-white border px-2 py-1 rounded text-xs">定期テスト</span>
                            <span className="bg-white border px-2 py-1 rounded text-xs">共通テスト</span>
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
