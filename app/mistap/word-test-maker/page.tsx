import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardList, Layers3, ListChecks, Repeat2, Sparkles, Target, Zap } from 'lucide-react';
import TestSetupContent from '@/components/mistap/TestSetupContent';
import MistapFooter from '@/components/mistap/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: '英単語テストメーカー｜学校・塾の小テスト作成にも使える無料ツール - Mistap',
    description: '対応教材から範囲を選ぶだけで、無料の英単語テストを作成できるMistapの英単語テストメーカー。学校や塾の小テスト作成にも使え、PCから作成すれば印刷して配布できます。',
    keywords: [
        '英単語テストメーカー',
        '英単語テスト 作成',
        '単語テストメーカー',
        '英単語 小テスト 作成',
        '英単語 小テスト 印刷',
        '英単語テスト 印刷',
        '塾 英単語 小テスト',
        '学校 英単語 小テスト',
        '英単語 テスト 無料',
        '単語テスト 作成 無料',
        '英単語 クイズ 作成',
        '英単語 アプリ 無料',
        'システム英単語 テスト',
        'ターゲット1900 テスト'
    ],
    alternates: {
        canonical: 'https://edulens.jp/mistap/word-test-maker'
    },
    openGraph: {
        title: '英単語テストメーカー｜学校・塾の小テスト作成にも使える無料ツール - Mistap',
        description: '対応教材と範囲を選ぶだけ。英単語の小テストを無料で作成でき、PCから印刷して配布できます。',
        url: 'https://edulens.jp/mistap/word-test-maker',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        locale: 'ja_JP',
        images: [
            {
                url: 'https://edulens.jp/MistapLP.png',
                width: 1200,
                height: 630,
                alt: 'Mistap 英単語テストメーカー',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '英単語テストメーカー｜Mistap',
        description: '学校・塾の小テスト作成にも。PCから作成すれば印刷して配布できます。',
        images: ['https://edulens.jp/MistapLP.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const useCases = [
    {
        icon: ClipboardList,
        title: '学校・塾の小テスト作成に',
        description: '授業や講習の範囲だけを選んで、確認用の英単語テストをすぐ作成できます。PCから作れば印刷して配布する用途にも使えます。',
    },
    {
        icon: Target,
        title: '受験単語帳の反復に',
        description: 'システム英単語、ターゲット、LEAPなどの対応教材を、必要な範囲だけ小さく回せます。',
    },
    {
        icon: Repeat2,
        title: '苦手単語の復習に',
        description: '間違えた単語を残しておけば、次の復習で弱点だけを見直しやすくなります。',
    },
];

const supportedCategories = [
    {
        title: '大学受験・高校英語',
        examples: 'システム英単語、ターゲット1900、LEAP、鉄壁など',
        href: '/mistap/textbook',
        accent: 'from-blue-500 to-indigo-600',
    },
    {
        title: '中学英語・教科書',
        examples: 'New Horizon、New Crown、ターゲット1800など',
        href: '/mistap/chugaku-teiki-test',
        accent: 'from-emerald-500 to-teal-600',
    },
    {
        title: '英検・TOEIC',
        examples: 'パス単、金のフレーズ、銀のフレーズなど',
        href: '/mistap/toeic-word-test',
        accent: 'from-orange-500 to-amber-600',
    },
    {
        title: '古文単語',
        examples: '重要古文単語315、古文単語330、核心古文単語351など',
        href: '/mistap/textbook',
        accent: 'from-rose-500 to-pink-600',
    },
];

const steps = [
    '対応教材を選ぶ',
    'テストしたい範囲を指定する',
    '画面で解くか、PCから印刷して配布する',
    '間違えた単語を復習に回す',
];

const faqs = [
    {
        q: '英単語テストメーカーは無料で使えますか？',
        a: 'はい。対応教材から範囲を選ぶ英単語テストは無料で試せます。学習履歴や苦手単語を保存したい場合は無料登録がおすすめです。',
    },
    {
        q: '自分で単語を入力してテストを作れますか？',
        a: '現在は、Mistapが対応している教材から範囲を選んでテストを作成する形式です。対応教材は順次追加しています。',
    },
    {
        q: 'スマホでも単語テストを作れますか？',
        a: '作れます。ブラウザで使えるので、スマホ、タブレット、PCから対応教材の単語テストを作成できます。',
    },
    {
        q: '作成した英単語テストを印刷できますか？',
        a: 'PCから作成すれば、ブラウザの印刷機能を使って紙の小テストとして配布できます。学校や塾の授業前確認にも使いやすい形式です。',
    },
    {
        q: '間違えた単語だけ復習できますか？',
        a: 'はい。テスト中に分からなかった単語を残しておくことで、あとから苦手単語を中心に復習しやすくなります。',
    },
];

export default function WordTestMakerPage() {
    const pageUrl = 'https://edulens.jp/mistap/word-test-maker';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: '英単語テストメーカー｜学校・塾の小テスト作成にも使える無料ツール - Mistap',
                url: pageUrl,
                description: '対応教材から範囲を選ぶだけで、無料の英単語テストを作成できるMistapの英単語テストメーカー。学校や塾の小テスト作成にも使えます。',
                about: [
                    '英単語テストメーカー',
                    '英単語テスト 作成',
                    '単語テストメーカー',
                    '英単語 小テスト',
                    '英単語テスト 印刷',
                    '学校 塾 小テスト'
                ],
                isPartOf: {
                    '@type': 'WebSite',
                    name: 'Mistap',
                    url: 'https://edulens.jp/mistap'
                }
            },
            {
                '@type': 'HowTo',
                name: 'Mistapで英単語テストを作成する方法',
                step: steps.map((step, index) => ({
                    '@type': 'HowToStep',
                    position: index + 1,
                    name: step,
                }))
            },
            {
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.a,
                    }
                }))
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
                        name: '英単語テストメーカー',
                        item: pageUrl,
                    },
                ]
            },
            {
                '@type': 'SoftwareApplication',
                name: 'Mistap 英単語テストメーカー',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'JPY'
                },
                url: pageUrl,
                featureList: [
                    '対応教材から英単語テストを作成',
                    '範囲指定',
                    '間違えた単語の復習',
                    'スマホ対応'
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-white">
                <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,#fff1f2_0%,#ffffff_64%)] pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="mx-auto max-w-6xl px-4">
                        <nav aria-label="パンくず" className="mb-8 text-sm text-slate-500">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li>
                                    <Link href="/mistap" prefetch={false} className="hover:text-rose-600 transition-colors">
                                        Mistap
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-slate-700">英単語テストメーカー</li>
                            </ol>
                        </nav>

                        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700">
                                    <Sparkles className="h-4 w-4" />
                                    学校・塾の小テスト作成にも
                                </div>
                                <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                    英単語テストメーカーで
                                    <span className="block text-rose-600">小テストを無料作成</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                                    対応教材と範囲を選ぶだけで、英単語テストをすぐ作成できます。
                                    学校や塾の小テスト作成にも使いやすく、PCから作成すれば印刷して配布できます。
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="#test-maker"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose-200 transition hover:scale-[1.02]"
                                    >
                                        今すぐテストを作る
                                        <Zap className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#supported"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-lg font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-600"
                                    >
                                        対応教材を見る
                                    </Link>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">範囲指定OK</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">PCから印刷OK</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">スマホ対応</span>
                                </div>
                            </div>

                            <div className="relative pb-12 pr-8 sm:pb-16 sm:pr-12">
                                <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-rose-300/30 blur-2xl" />
                                <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full bg-sky-300/25 blur-2xl" />
                                <div className="pointer-events-none absolute -right-1 bottom-0 z-20 w-28 sm:w-36 md:-right-4 md:w-44">
                                    <Image
                                        src="/mistap/mascot/mistap-mascot-pointing.png"
                                        alt=""
                                        width={447}
                                        height={558}
                                        className="h-auto w-full drop-shadow-xl"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="relative overflow-hidden rounded-[30px] border border-rose-100 bg-white p-4 shadow-2xl shadow-rose-100/70">
                                    <Image
                                        src="/MistapLP.png"
                                        alt="Mistapの英単語テストメーカー画面"
                                        width={1200}
                                        height={630}
                                        className="rounded-2xl border border-slate-100"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="test-maker" className="py-16 md:py-20 bg-slate-50 border-y border-slate-100">
                    <div className="mx-auto max-w-4xl px-4">
                        <div className="text-center">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Make A Test</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                ここから英単語テストを作成
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                教材、範囲、出題数を選んで、すぐにテストを始められます。
                            </p>
                        </div>
                        <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
                            <TestSetupContent embedMode={true} startButtonLabel="テストを作成" />
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Use Cases</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                学校・塾・自習の小テスト作成に使えます
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                授業で扱った範囲をそのまま確認テストにしたり、自習用に短いテストを作ったりできます。紙で配布したいときはPCから作成して印刷できます。
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {useCases.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
                                        <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section id="supported" className="py-16 md:py-20 bg-[linear-gradient(180deg,#fff_0%,#fff1f2_100%)]">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-3xl">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Supported Categories</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    対応教材からテストを作れます
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    Mistapは、よく使われる単語帳や教科書を教材別に整理しています。目的に近いカテゴリから始めてください。
                                </p>
                            </div>
                            <Link
                                href="/mistap/textbook"
                                prefetch={false}
                                className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 transition hover:text-rose-700"
                            >
                                対応教材一覧へ
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {supportedCategories.map((category) => (
                                <Link
                                    key={category.title}
                                    href={category.href}
                                    prefetch={false}
                                    className="group overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-lg shadow-rose-100/40 transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className={`bg-gradient-to-r ${category.accent} px-6 py-5 text-white`}>
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-90">Category</p>
                                        <h3 className="mt-2 text-2xl font-extrabold">{category.title}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-base leading-7 text-slate-600">{category.examples}</p>
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                                            このカテゴリを見る
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-300">Study Flow</p>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                                    英単語テスト作成は、4ステップで完了
                                </h2>
                                    <p className="mt-4 text-base leading-7 text-slate-300">
                                    覚える範囲を決めて、テストして、必要なら紙でも配る。授業・塾・自習の確認を軽く整えられます。
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {steps.map((step, index) => (
                                    <div key={step} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
                                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-lg font-extrabold text-rose-600">
                                            {index + 1}
                                        </div>
                                        <p className="mt-4 text-lg font-bold text-slate-900">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-slate-50">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Why Mistap</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    紙の単語帳だけでは見えにくい「抜け」を見つける
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    読める単語と、テストで選べる単語は少し違います。英単語テストメーカーを使うと、いま確認すべき単語が見えやすくなります。
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: BookOpenCheck, text: '学校や塾で扱った教材範囲に合わせて、必要なところだけテストできる' },
                                    { icon: ListChecks, text: '意味を選ぶ形式で、覚えたつもりの単語を見つけやすい' },
                                    { icon: Layers3, text: 'PCから作成すれば、印刷して紙の小テストとして配布できる' },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.text} className="flex gap-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-rose-100">
                                            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-rose-500" />
                                            <p className="text-base leading-7 text-slate-700">{item.text}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-5xl px-4">
                        <div className="text-center">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">FAQ</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                よくある質問
                            </h2>
                        </div>
                        <div className="mt-10 space-y-4">
                            {faqs.map((faq) => (
                                <div key={faq.q} className="rounded-[28px] border border-slate-100 bg-white p-6 md:p-7 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-sm font-black text-white">
                                            Q
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
                                            <p className="mt-3 text-base leading-7 text-slate-600">{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-5xl px-4">
                        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#f43f5e_0%,#0ea5e9_100%)] p-8 md:p-12 text-white shadow-2xl shadow-rose-200">
                            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-100">Start Now</p>
                                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                                        今日の範囲で、すぐ小テストを作る
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-rose-50">
                                        教材と範囲を選んだら、あとはテストするだけです。
                                        読む学習に、確認テストを足して定着を見えるようにしましょう。
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <Link
                                        href="#test-maker"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-rose-50"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Zap className="h-5 w-5 text-rose-500" />
                                            英単語テストを作成する
                                        </span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/textbook"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-rose-50"
                                    >
                                        <span className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-rose-500" />
                                            対応教材一覧を見る
                                        </span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <MistapFooter />
        </>
    );
}
