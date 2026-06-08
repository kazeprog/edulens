import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    BarChart3,
    ChevronRight,
    CheckSquare,
    CreditCard,
    KeyRound,
    ShieldCheck,
    UsersRound,
    Zap,
} from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const dynamic = 'force-static';

const pageUrl = 'https://edulens.jp/mistap/school';
const pageTitle = 'Mistap for School｜学習塾向け英単語テスト管理・小テスト作成';
const pageDescription = 'Mistap for Schoolは、学習塾が生徒の英単語テスト履歴・正答率・苦手単語・未実施者を管理できる機能です。塾IDで簡単連携、5名まで無料。6名以上は月額2,980円または年額29,800円で利用できます。';
const ogImage = 'https://edulens.jp/MistapLP.png';

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: [
        '学習塾向け 英単語テスト 管理',
        'Mistap 塾',
        'Mistap for School',
        '単語学習 管理',
        '学習塾 英単語',
        '英単語テスト 管理',
        '英単語テスト 小テスト 作成',
        '塾 管理画面',
        '生徒 学習履歴',
        '苦手単語 管理',
        '未実施 生徒 管理',
        '英単語 小テスト 塾',
    ],
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        locale: 'ja_JP',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'Mistap for School 学習塾向け英単語テスト管理',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: [ogImage],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const graphPaperBackground = "bg-white bg-fixed bg-[linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(rgba(220,38,38,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.08)_1px,transparent_1px)] [background-size:24px_24px,24px_24px,120px_120px,120px_120px] [background-position:-1px_-1px,-1px_-1px,-1px_-1px,-1px_-1px]";

const faqItems = [
    {
        question: '生徒は新しいアプリを使う必要がありますか？',
        answer: 'ありません。生徒は従来通りMistapで単語テストや復習を行い、その履歴が塾管理画面で確認できるようになります。',
    },
    {
        question: '無料で何人まで使えますか？',
        answer: '1つの塾につき5名まで無料で連携できます。6名以上の登録には学習塾向け有料プランが必要です。月払いと年払いを選べます。',
    },
    {
        question: '6名以上で使う場合の料金はいくらですか？',
        answer: '有料プランは月額2,980円です。年額プランは29,800円で、月払い12か月分と比べて年間5,960円お得です。',
    },
    {
        question: '塾で配る紙の小テストも作れますか？',
        answer: '管理画面の学習履歴から、生徒が実施した単語範囲をもとに最大20語の印刷用テストと解答を作成できます。',
    },
    {
        question: '一般ユーザーに塾管理画面は表示されますか？',
        answer: 'Mistapメニュー内の塾管理画面リンクは、塾を所有しているユーザーや管理権限のあるユーザーだけに表示されます。',
    },
];

const setupSteps = [
    '塾管理画面を作成する',
    '4桁の塾IDを生徒に共有する',
    '生徒がプロフィールで塾IDを入力する',
    '管理画面で学習履歴・苦手単語・未実施者を確認する',
];

const useCases = [
    {
        title: '宿題の実施確認',
        description: '英単語テストを実施したか、直近1週間で取り組めているかを生徒別に確認できます。',
    },
    {
        title: '授業前の弱点把握',
        description: '正答率と苦手単語を見て、授業前に扱うべき単語や復習範囲を決めやすくなります。',
    },
    {
        title: '紙の小テスト作成',
        description: '生徒が取り組んだ単語範囲から最大20語を抽出し、問題と解答を印刷できます。',
    },
];

const relatedLinks = [
    {
        href: '/mistap/word-test-maker',
        title: '英単語テストメーカー',
        description: '学校・塾の小テスト作成にも使えるMistapの無料ツールです。',
    },
    {
        href: '/mistap/test-setup',
        title: '単語テストを作成する',
        description: '対応教材と範囲を選んで、すぐに英単語テストを作成できます。',
    },
    {
        href: '/mistap/chugaku-teiki-test',
        title: '中学生の定期テスト対策',
        description: '中学英語の教科書・単語帳を使ったテスト対策に使えます。',
    },
];

const schoolPageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            name: pageTitle,
            url: pageUrl,
            description: pageDescription,
            inLanguage: 'ja-JP',
            isPartOf: {
                '@type': 'WebSite',
                name: 'Mistap',
                url: 'https://edulens.jp/mistap',
            },
            about: [
                '学習塾向け英単語テスト管理',
                '生徒の学習履歴管理',
                '苦手単語の確認',
                '小テスト作成',
                '英単語学習管理',
            ],
            primaryImageOfPage: {
                '@type': 'ImageObject',
                url: ogImage,
            },
        },
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Mistap',
                    item: 'https://edulens.jp/mistap',
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Mistap for School',
                    item: pageUrl,
                },
            ],
        },
        {
            '@type': 'HowTo',
            name: 'Mistap for Schoolを学習塾で導入する方法',
            step: setupSteps.map((step, index) => ({
                '@type': 'HowToStep',
                position: index + 1,
                name: step,
            })),
        },
        {
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                },
            })),
        },
        {
            '@type': 'SoftwareApplication',
            name: 'Mistap for School',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            url: pageUrl,
            description: pageDescription,
            featureList: [
                '塾IDによる生徒連携',
                '英単語テスト履歴の確認',
                '正答率と苦手単語の管理',
                '1週間以内に未実施の生徒確認',
                '印刷用小テスト作成',
            ],
            offers: [
                {
                    '@type': 'Offer',
                    name: '無料プラン',
                    price: '0',
                    priceCurrency: 'JPY',
                    description: '1つの塾につき5名まで無料',
                },
                {
                    '@type': 'Offer',
                    name: '月額プラン',
                    price: '2980',
                    priceCurrency: 'JPY',
                    priceSpecification: {
                        '@type': 'UnitPriceSpecification',
                        price: '2980',
                        priceCurrency: 'JPY',
                        billingDuration: 'P1M',
                    },
                },
                {
                    '@type': 'Offer',
                    name: '年額プラン',
                    price: '29800',
                    priceCurrency: 'JPY',
                    priceSpecification: {
                        '@type': 'UnitPriceSpecification',
                        price: '29800',
                        priceCurrency: 'JPY',
                        billingDuration: 'P1Y',
                    },
                },
            ],
        },
    ],
};

export default function MistapSchoolPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolPageJsonLd) }}
            />
            <main className={`${graphPaperBackground} min-h-screen`}>
                <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                    <div className="absolute inset-0 z-0 bg-white/35 pointer-events-none" />

                    <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                        <nav aria-label="パンくず" className="mb-8 text-sm font-bold text-slate-500">
                            <Link href="/mistap" className="hover:text-red-600">Mistap</Link>
                            <span className="mx-2">/</span>
                            <span className="text-slate-800">学習塾向け機能</span>
                        </nav>
                        <div className="grid items-center gap-12 md:gap-14 lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)] xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.9fr)]">
                            <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                                    <span className="block text-xl md:text-2xl font-bold text-red-600 mb-4 tracking-normal">
                                        学習塾向け Mistap 管理機能
                                    </span>
                                    生徒の単語学習を<br />
                                    <span className="text-red-500">塾IDでまとめて見える化</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    生徒は従来のMistapを使うだけ。塾IDを入力した生徒のテスト回数、正答率、苦手単語、最新履歴を塾の管理画面で確認できます。
                                    <br />
                                    英単語テストの宿題確認、授業前の小テスト作成、1週間以内に未実施の生徒確認まで、学習塾の単語指導に必要な情報をまとめます。
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                                    <Link
                                        href="/login?mode=signup&redirect=/mistap/school-admin"
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-red-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-6 h-6" />
                                        5名まで無料で始める
                                    </Link>
                                    <Link
                                        href="/mistap/contact"
                                        className="w-full sm:w-auto px-8 py-4 bg-white text-red-700 border-2 border-red-200 rounded-xl font-bold text-lg shadow-lg shadow-red-100 hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        導入について相談する
                                    </Link>
                                </div>
                                <div className="flex flex-col items-center lg:items-start gap-2">
                                    <p className="text-sm text-slate-400 font-medium">
                                        ※ 5名まで無料。6名以上は月額2,980円または年額29,800円で登録できます。
                                    </p>
                                </div>
                            </div>

                            <div className="w-full max-w-md md:max-w-full relative animate-in slide-in-from-right-5 fade-in duration-1000 delay-150">
                                <div className="pointer-events-none absolute -bottom-20 -right-14 z-20 w-32 sm:-bottom-24 sm:-right-16 sm:w-40 md:-bottom-28 md:-right-20 md:w-52 lg:-bottom-32 lg:-right-24">
                                    <Image
                                        src="/mistap/mascot/mistap-mascot-pointing.png"
                                        alt=""
                                        width={447}
                                        height={558}
                                        className="h-auto w-full"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="relative w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-4 md:p-6 border border-slate-100">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-700">学習塾向け管理画面</h3>
                                        <div className="mt-2 text-2xl font-black text-slate-800 tracking-wider">
                                            Mistap for School
                                        </div>
                                        <div className="text-sm text-slate-500 font-medium">生徒の学習履歴を一括確認</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl p-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center text-xs">ID</span>
                                            <span>塾ID</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center text-xs">5</span>
                                            <span>無料枠</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center text-xs">∞</span>
                                            <span>有料拡張</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        {[
                                            ['連携生徒', '18名'],
                                            ['平均正答率', '78%'],
                                            ['7日以内に実施', '12名'],
                                        ].map(([label, value]) => (
                                            <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                                                <span className="text-sm font-bold text-slate-500">{label}</span>
                                                <span className="text-lg font-black text-slate-800">{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        <CheckSquare className="w-5 h-5 text-emerald-500" />
                                        <p className="text-slate-500 text-sm">生徒はいつものMistapで学習</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white/70 border-t border-slate-100/80 border-b backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">英単語テストの学習データを指導に活かす</h2>
                            <p className="text-slate-600 text-lg">
                                塾IDでつながった生徒だけを対象に、単語テストの実施状況と苦手単語を確認できます。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard
                                icon={<KeyRound className="w-8 h-8 text-red-500" />}
                                title="4桁の塾IDで連携"
                                description="生徒はプロフィール画面で塾IDを入力するだけ。面倒な名簿登録なしで管理対象に追加されます。"
                            />
                            <FeatureCard
                                icon={<BarChart3 className="w-8 h-8 text-red-500" />}
                                title="学習履歴を一覧化"
                                description="テスト回数、正答率、最終実施日、7日以内の学習状況を生徒別に確認できます。未実施の生徒も見つけやすくなります。"
                            />
                            <FeatureCard
                                icon={<ShieldCheck className="w-8 h-8 text-red-500" />}
                                title="連携した生徒だけ表示"
                                description="生徒が塾IDを入力した場合のみ履歴を共有。連携解除も生徒側から行えます。"
                            />
                            <FeatureCard
                                icon={<CheckSquare className="w-8 h-8 text-red-500" />}
                                title="印刷用小テストを作成"
                                description="生徒が実施した単語範囲から最大20語をランダム抽出し、問題用紙と解答用紙を印刷できます。"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white/60 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">学習塾の英単語指導で使いやすい場面</h2>
                            <p className="text-slate-600 text-lg">
                                Mistap for Schoolは、英単語テストの管理、宿題チェック、小テスト作成をまとめたい学習塾向けの機能です。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {useCases.map((item) => (
                                <div key={item.title} className="rounded-2xl border border-slate-100 bg-white/85 p-8 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                                    <p className="mt-4 leading-relaxed text-slate-600">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 rounded-2xl border border-red-100 bg-white/90 p-6">
                            <h3 className="text-xl font-bold text-slate-800">関連するMistapの英単語テスト機能</h3>
                            <div className="mt-5 grid gap-4 md:grid-cols-3">
                                {relatedLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-red-200 hover:bg-red-50"
                                    >
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white/60 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">導入は、塾IDを配るだけ</h2>
                            <p className="text-slate-600 text-lg">
                                生徒の学習体験はそのまま。塾側は生徒の学習履歴を確認できます。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<span className="text-3xl font-black text-red-600">01</span>}
                                title="塾管理画面を作成"
                                description="ログイン後、塾名を入力すると英字と数字を含む4桁の塾IDが発行されます。"
                            />
                            <FeatureCard
                                icon={<span className="text-3xl font-black text-red-600">02</span>}
                                title="生徒に塾IDを共有"
                                description="生徒はMistapのプロフィール設定で塾IDを入力します。"
                            />
                            <FeatureCard
                                icon={<span className="text-3xl font-black text-red-600">03</span>}
                                title="履歴が自動で集まる"
                                description="生徒がMistapで単語テストを行うだけで、管理画面に学習状況が反映されます。"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white/70 border-t border-slate-100/80 border-b backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-8">
                            <FeatureCard
                                icon={<UsersRound className="w-8 h-8 text-emerald-500" />}
                                title="5名まで無料"
                                description="小規模なクラス、体験導入、講師自身の検証に使いやすい無料枠です。6名以上になるまでは決済不要で始められます。"
                            />
                            <FeatureCard
                                icon={<CreditCard className="w-8 h-8 text-red-500" />}
                                title="6名以上は月額2,980円"
                                description="5名を超える生徒連携は月額2,980円、年額29,800円で利用できます。年額なら月払い12か月分より年間5,960円お得です。"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white/70 border-t border-slate-100/80 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">よくある質問</h2>
                        <div className="space-y-6">
                            {faqItems.map((item) => (
                                <FAQItem key={item.question} question={item.question} answer={item.answer} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white/70 text-center border-y border-slate-100/80 backdrop-blur-[1px]">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">まずは5名まで無料で試せます</h2>
                        <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-600">
                            生徒がいつものMistapを使うだけで、塾側に学習履歴が集まります。
                        </p>
                        <Link
                            href="/login?mode=signup&redirect=/mistap/school-admin"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-bold text-xl shadow-lg shadow-red-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            塾管理画面を作成
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                <div className="py-8 bg-white/70 text-center px-4 border-t border-slate-100/80 backdrop-blur-[1px]">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Mistap for Schoolは、Mistapの学習履歴を学習塾向けに確認しやすくする管理機能です。<br />
                        生徒が塾IDを入力して連携した場合のみ、塾管理画面に学習状況が表示されます。
                    </p>
                </div>
            </main>
            <MistapFooter />
        </>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white/85 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-6 w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="bg-white/85 rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-start gap-3 mb-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-0.5 shrink-0">Q</span>
                {question}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed pl-9">
                {answer}
            </p>
        </div>
    );
}
