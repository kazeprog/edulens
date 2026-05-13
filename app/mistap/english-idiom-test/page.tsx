import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardList, Layers3, Repeat2, Sparkles, Target } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: '英熟語テストを無料で作成｜大学受験向け英熟語小テスト - Mistap',
    description: '英熟語ターゲット1000 5訂版・システム英熟語〈5訂版〉などに対応した無料の英熟語テストページ。句動詞、前置詞表現、重要イディオムを範囲指定で小テスト化できます。',
    keywords: [
        '英熟語 テスト',
        '英熟語 小テスト',
        '英熟語 テスト 無料',
        '英熟語 アプリ',
        '英熟語 暗記',
        '大学受験 英熟語',
        '英熟語ターゲット1000 テスト',
        'システム英熟語 テスト',
        '句動詞 テスト',
        'イディオム テスト'
    ],
    alternates: {
        canonical: 'https://edulens.jp/mistap/english-idiom-test'
    },
    openGraph: {
        title: '英熟語テストを無料で作成｜大学受験向け英熟語小テスト - Mistap',
        description: '英熟語ターゲット1000・システム英熟語に対応。英熟語を範囲指定で無料小テスト化できます。',
        url: 'https://edulens.jp/mistap/english-idiom-test',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        locale: 'ja_JP',
        images: [
            {
                url: 'https://edulens.jp/MistapLP.png',
                width: 1200,
                height: 630,
                alt: 'Mistap 英熟語テストページ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '英熟語テストを無料で作成｜Mistap',
        description: '英熟語ターゲット1000・システム英熟語を範囲指定で小テスト化。',
        images: ['https://edulens.jp/MistapLP.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const supportedBooks = [
    {
        name: '英熟語ターゲット1000 5訂版',
        href: '/mistap/textbook/idiom-target-1000-5th',
        publisher: '旺文社',
        description: '入試頻出の英熟語1000項目を、番号範囲で区切って小テスト化できます。',
        badge: 'でる順',
        accent: 'from-orange-500 to-amber-600',
    },
    {
        name: 'システム英熟語〈5訂版〉',
        href: '/mistap/textbook/system-english-idioms-5th',
        publisher: '駿台文庫',
        description: '句動詞、前置詞表現、副詞表現などを体系的に確認できます。',
        badge: '体系型',
        accent: 'from-sky-500 to-indigo-600',
    },
];

const studyPoints = [
    {
        icon: Target,
        title: '単語よりも「うろ覚え」が残りやすい',
        description: '英熟語は、動詞・前置詞・副詞の組み合わせで意味が変わります。見たことがあるだけでは本番で取り違えやすいので、意味を選ぶ練習が役立ちます。',
    },
    {
        icon: Layers3,
        title: '似た表現をまとめて確認できる',
        description: 'look after / look for / look into のような似た形の表現は、テスト形式で違いを確認すると弱点が見えやすくなります。',
    },
    {
        icon: Repeat2,
        title: '短い範囲で反復しやすい',
        description: '英熟語は一気に覚えようとすると重くなりがちです。番号範囲を小さく切って、短時間で何度も回すほうが続けやすくなります。',
    },
];

const steps = [
    '使っている英熟語帳を選ぶ',
    'テストしたい番号範囲を指定する',
    '意味を選んで理解の抜けを確認する',
    '間違えた熟語だけを復習に回す',
];

const faqs = [
    {
        q: '英熟語テストは無料で使えますか？',
        a: 'はい。Mistapでは、対応している英熟語帳の小テストを無料で試せます。学習履歴や苦手リストを残したい場合は無料登録がおすすめです。',
    },
    {
        q: '英熟語ターゲット1000とシステム英熟語のどちらに対応していますか？',
        a: 'どちらにも対応しています。英熟語ターゲット1000 5訂版とシステム英熟語〈5訂版〉のページから、それぞれ範囲指定の小テストを作成できます。',
    },
    {
        q: '句動詞や前置詞表現の確認にも使えますか？',
        a: '使えます。句動詞、前置詞表現、重要イディオムをテスト形式で確認できるので、意味の取り違えや覚えたつもりの表現を見つけやすくなります。',
    },
    {
        q: '大学受験の英熟語対策に向いていますか？',
        a: '向いています。共通テスト、私大、国公立二次で必要になる英熟語を、番号範囲ごとに小さく区切って反復できます。',
    },
];

export default function EnglishIdiomTestPage() {
    const pageUrl = 'https://edulens.jp/mistap/english-idiom-test';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: '英熟語テストを無料で作成｜大学受験向け英熟語小テスト - Mistap',
                url: pageUrl,
                description: '英熟語ターゲット1000 5訂版・システム英熟語〈5訂版〉などに対応した無料の英熟語テストページ。',
                about: [
                    '英熟語 テスト',
                    '英熟語 小テスト',
                    '大学受験 英熟語',
                    '句動詞 テスト'
                ],
                isPartOf: {
                    '@type': 'WebSite',
                    name: 'Mistap',
                    url: 'https://edulens.jp/mistap'
                }
            },
            {
                '@type': 'ItemList',
                name: 'Mistapでテストできる英熟語帳',
                numberOfItems: supportedBooks.length,
                itemListElement: supportedBooks.map((book, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: book.name,
                    description: book.description,
                    url: `https://edulens.jp${book.href}`
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
                        name: '英熟語テスト',
                        item: pageUrl,
                    },
                ]
            },
            {
                '@type': 'SoftwareApplication',
                name: 'Mistap',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'JPY'
                },
                url: 'https://edulens.jp/mistap',
                featureList: [
                    '英熟語帳対応の小テスト',
                    '番号範囲指定',
                    '間違えた英熟語の復習'
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
                <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,#fff7ed_0%,#ffffff_62%)] pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="mx-auto max-w-6xl px-4">
                        <nav aria-label="パンくず" className="mb-8 text-sm text-slate-500">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li>
                                    <Link href="/mistap" prefetch={false} className="hover:text-orange-600 transition-colors">
                                        Mistap
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-slate-700">英熟語テスト</li>
                            </ol>
                        </nav>

                        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                                    <BookOpenCheck className="h-4 w-4" />
                                    大学受験の英熟語対策に
                                </div>
                                <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                    英熟語テストを
                                    <span className="block text-orange-600">無料で範囲指定作成</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                                    英熟語ターゲット1000 5訂版、システム英熟語〈5訂版〉に対応。
                                    句動詞・前置詞表現・重要イディオムを小テスト形式で確認し、間違えた熟語だけを復習できます。
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="#supported-books"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-7 py-4 text-lg font-bold text-white shadow-xl shadow-orange-200 transition hover:scale-[1.02]"
                                    >
                                        対応英熟語帳を選ぶ
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/test-setup"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-lg font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
                                    >
                                        テスト作成へ
                                    </Link>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">登録なしで試せる</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">番号範囲指定</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">苦手熟語を復習</span>
                                </div>
                            </div>

                            <div className="relative pb-12 pr-8 sm:pb-16 sm:pr-12">
                                <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-orange-300/30 blur-2xl" />
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
                                <div className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-100/70">
                                    <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Mistap</p>
                                            <p className="text-sm font-semibold text-slate-600">英熟語の小テスト作成</p>
                                        </div>
                                        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                            無料
                                        </div>
                                    </div>
                                    <Image
                                        src="/MistapLP.png"
                                        alt="Mistapの英熟語テスト画面"
                                        width={1200}
                                        height={630}
                                        className="rounded-2xl border border-slate-100"
                                        priority
                                    />
                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-2xl bg-orange-50 p-4">
                                            <p className="text-xs font-bold text-orange-600">IDIOM</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">句動詞</p>
                                        </div>
                                        <div className="rounded-2xl bg-sky-50 p-4">
                                            <p className="text-xs font-bold text-sky-600">PHRASE</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">前置詞表現</p>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-50 p-4">
                                            <p className="text-xs font-bold text-emerald-600">REVIEW</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">苦手復習</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="supported-books" className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Supported Books</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                使っている英熟語帳から始める
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                英熟語は教材ごとに並びや整理の考え方が違います。Mistapでは、使っている英熟語帳に合わせて範囲を選べます。
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {supportedBooks.map((book) => (
                                <Link
                                    key={book.href}
                                    href={book.href}
                                    prefetch={false}
                                    className="group overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-lg shadow-orange-100/40 transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className={`bg-gradient-to-r ${book.accent} px-6 py-5 text-white`}>
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-90">{book.badge}</p>
                                        <h3 className="mt-2 text-2xl font-extrabold">{book.name}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm font-bold text-slate-400">{book.publisher}</p>
                                        <p className="mt-3 text-base leading-7 text-slate-600">{book.description}</p>
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                                            この英熟語帳でテストする
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-slate-50">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="rounded-[32px] bg-white p-8 md:p-10 shadow-sm ring-1 ring-slate-100">
                            <div className="max-w-3xl">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Why Idiom Tests Work</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    英熟語は、読むだけよりテスト形式のほうが抜けを見つけやすい
                                </h2>
                            </div>
                            <div className="mt-8 grid gap-5 md:grid-cols-3">
                                {studyPoints.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.title} className="rounded-[28px] border border-slate-100 bg-slate-50 p-6">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
                                            <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Study Flow</p>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                                    英熟語の確認は、小さく区切ると続けやすい
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-300">
                                    1000個を一気に見るのではなく、今日の範囲だけをテストして、間違えたものを次に回す。負担を軽くして反復回数を増やします。
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {steps.map((step, index) => (
                                    <div key={step} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
                                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-lg font-extrabold text-orange-600">
                                            {index + 1}
                                        </div>
                                        <p className="mt-4 text-lg font-bold text-slate-900">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-[linear-gradient(180deg,#fff_0%,#fff7ed_100%)]">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">For Exams</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    大学受験の英熟語対策で見るべきところ
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    英熟語は、長文読解・英文法・英作文のどこでも出てきます。意味だけでなく、前置詞の組み合わせや文中での働きまで意識すると、得点につながりやすくなります。
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    '句動詞の意味を、動詞単体の意味だけで判断していないか',
                                    '前置詞・副詞の違いで意味が変わる表現を混同していないか',
                                    '覚えたつもりの熟語を、選択肢の中で正しく選べるか',
                                ].map((item) => (
                                    <div key={item} className="flex gap-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-orange-100">
                                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
                                        <p className="text-base leading-7 text-slate-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-slate-50">
                    <div className="mx-auto max-w-5xl px-4">
                        <div className="text-center">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">FAQ</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                よくある質問
                            </h2>
                        </div>
                        <div className="mt-10 space-y-4">
                            {faqs.map((faq) => (
                                <div key={faq.q} className="rounded-[28px] border border-slate-100 bg-white p-6 md:p-7 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-sm font-black text-white">
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
                        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#f97316_0%,#0ea5e9_100%)] p-8 md:p-12 text-white shadow-2xl shadow-orange-200">
                            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">Start Now</p>
                                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                                        まずは、今日の範囲だけ英熟語テスト
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-orange-50">
                                        英熟語は、短く区切って反復するほど進めやすくなります。
                                        使っている教材を選んで、必要な範囲だけ小テスト化してください。
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    {supportedBooks.map((book) => (
                                        <Link
                                            key={book.href}
                                            href={book.href}
                                            prefetch={false}
                                            className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-orange-50"
                                        >
                                            <span className="flex items-center gap-3">
                                                <ClipboardList className="h-5 w-5 text-orange-500" />
                                                {book.name}
                                            </span>
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    ))}
                                    <Link
                                        href="/mistap/textbook"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-left font-bold text-white transition hover:bg-white/20"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Sparkles className="h-5 w-5" />
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
