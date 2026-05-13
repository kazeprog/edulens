import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, Gauge, Headphones, ListChecks, Repeat2, Sparkles, Target } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'TOEIC単語テストを無料で作成｜金フレ・銀フレ対応 - Mistap',
    description: 'TOEIC L&R対策向けの無料英単語テストページ。金のフレーズ・銀のフレーズに対応し、TOEIC頻出単語をスコア目標別に小テスト形式で確認できます。',
    keywords: [
        'TOEIC 単語テスト',
        'TOEIC 英単語テスト',
        'TOEIC 単語 アプリ',
        'TOEIC 単語 小テスト',
        'TOEIC 単語 無料',
        '金のフレーズ テスト',
        '金フレ 単語テスト',
        '銀のフレーズ テスト',
        '銀フレ 単語テスト',
        'TOEIC 頻出単語'
    ],
    alternates: {
        canonical: 'https://edulens.jp/mistap/toeic-word-test'
    },
    openGraph: {
        title: 'TOEIC単語テストを無料で作成｜金フレ・銀フレ対応 - Mistap',
        description: 'TOEIC頻出単語を無料で小テスト化。金フレ・銀フレに対応したTOEIC単語テストページです。',
        url: 'https://edulens.jp/mistap/toeic-word-test',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        locale: 'ja_JP',
        images: [
            {
                url: 'https://edulens.jp/MistapLP.png',
                width: 1200,
                height: 630,
                alt: 'Mistap TOEIC単語テストページ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TOEIC単語テストを無料で作成｜Mistap',
        description: '金フレ・銀フレ対応。TOEIC頻出単語を小テスト形式で確認できます。',
        images: ['https://edulens.jp/MistapLP.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const supportedBooks = [
    {
        name: 'TOEIC L&R TEST 出る単特急 銀のフレーズ',
        shortName: '銀のフレーズ',
        href: '/mistap/textbook/toeic-silver',
        score: '600点前後を目指す基礎固め',
        description: 'TOEICの土台になる基本語彙を、スキマ時間に小テスト形式で確認できます。',
        accent: 'from-zinc-500 to-slate-700',
    },
    {
        name: 'TOEIC L&R TEST 出る単特急 金のフレーズ',
        shortName: '金のフレーズ',
        href: '/mistap/textbook/toeic-gold',
        score: '730点・860点以上を目指す頻出語対策',
        description: 'TOEIC頻出の実戦語彙を、目標スコアに合わせてテンポよく反復できます。',
        accent: 'from-orange-500 to-amber-600',
    },
];

const useCases = [
    {
        icon: Clock3,
        title: '通勤・通学の短時間で回す',
        description: 'TOEIC単語は毎日少しずつ触れるほうが定着しやすいです。Mistapならスマホで短い小テストをすぐ始められます。',
    },
    {
        icon: Target,
        title: '覚えたつもりを見つける',
        description: '単語帳を眺めるだけでは、意味を選べるかまでは分かりません。テスト形式で抜けを確認できます。',
    },
    {
        icon: Repeat2,
        title: '間違えた単語だけ復習する',
        description: '分からなかった単語を残しておけば、次の復習で同じ範囲を全部やり直す必要が減ります。',
    },
];

const scoreRoutes = [
    {
        label: '500〜600点を目指す',
        title: 'まずは銀フレで基礎語彙を固める',
        href: '/mistap/textbook/toeic-silver',
        description: 'TOEICでよく出る基本語を落とさないように、短い範囲で反復します。',
    },
    {
        label: '700点台を目指す',
        title: '金フレで頻出語の穴を埋める',
        href: '/mistap/textbook/toeic-gold',
        description: 'Part 5、Part 6、長文で出やすい語彙を小テストで確認します。',
    },
    {
        label: '800点以上を目指す',
        title: '金フレを高精度で取り切る',
        href: '/mistap/textbook/toeic-gold',
        description: '知っている単語の意味の取り違えを減らし、処理速度を上げる復習に使えます。',
    },
];

const steps = [
    '目標スコアに近い教材を選ぶ',
    'テストしたい範囲を指定する',
    '意味を選んで頻出語の抜けを確認する',
    '間違えた単語だけを復習に回す',
];

const faqs = [
    {
        q: 'TOEIC単語テストは無料で使えますか？',
        a: 'はい。Mistapでは、金のフレーズ・銀のフレーズに対応したTOEIC単語テストを無料で試せます。学習履歴や苦手単語を保存したい場合は無料登録がおすすめです。',
    },
    {
        q: '金フレと銀フレのどちらから始めるべきですか？',
        a: 'TOEIC600点前後を目指すなら銀のフレーズ、700点台以上や頻出語の実戦確認をしたいなら金のフレーズから始めるのがおすすめです。',
    },
    {
        q: 'スマホだけでTOEIC単語の復習はできますか？',
        a: 'できます。Mistapはブラウザで使えるので、スマホ・タブレット・PCからTOEIC単語の小テストを始められます。',
    },
    {
        q: 'リスニング対策にも単語テストは役立ちますか？',
        a: '役立ちます。TOEICのリスニングでは、頻出語を見てすぐ意味が分かる状態が大切です。単語テストで反応速度を上げておくと、音声理解の土台になります。',
    },
];

export default function ToeicWordTestPage() {
    const pageUrl = 'https://edulens.jp/mistap/toeic-word-test';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: 'TOEIC単語テストを無料で作成｜金フレ・銀フレ対応 - Mistap',
                url: pageUrl,
                description: 'TOEIC L&R対策向けの無料英単語テストページ。金のフレーズ・銀のフレーズに対応。',
                about: [
                    'TOEIC 単語テスト',
                    'TOEIC 頻出単語',
                    '金のフレーズ テスト',
                    '銀のフレーズ テスト'
                ],
                isPartOf: {
                    '@type': 'WebSite',
                    name: 'Mistap',
                    url: 'https://edulens.jp/mistap'
                }
            },
            {
                '@type': 'ItemList',
                name: 'MistapでテストできるTOEIC単語帳',
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
                        name: 'TOEIC単語テスト',
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
                    'TOEIC単語帳対応の小テスト',
                    '金のフレーズ対応',
                    '銀のフレーズ対応',
                    '間違えた単語の復習'
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
                <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_31%),radial-gradient(circle_at_bottom_right,_rgba(71,85,105,0.16),_transparent_30%),linear-gradient(180deg,#fff7ed_0%,#ffffff_64%)] pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="mx-auto max-w-6xl px-4">
                        <nav aria-label="パンくず" className="mb-8 text-sm text-slate-500">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li>
                                    <Link href="/mistap" prefetch={false} className="hover:text-orange-600 transition-colors">
                                        Mistap
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-slate-700">TOEIC単語テスト</li>
                            </ol>
                        </nav>

                        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                                    <BriefcaseBusiness className="h-4 w-4" />
                                    TOEIC L&Rの単語対策に
                                </div>
                                <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                    TOEIC単語テストを
                                    <span className="block text-orange-600">無料でスコア別に作成</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                                    金のフレーズ・銀のフレーズに対応したTOEIC英単語テスト。
                                    頻出単語を小テスト形式で確認し、間違えた単語だけを復習できます。
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="#supported-books"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-7 py-4 text-lg font-bold text-white shadow-xl shadow-orange-200 transition hover:scale-[1.02]"
                                    >
                                        TOEIC単語帳を選ぶ
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
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">金フレ対応</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">銀フレ対応</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">登録なしで試せる</span>
                                </div>
                            </div>

                            <div className="relative pb-12 pr-8 sm:pb-16 sm:pr-12">
                                <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-orange-300/30 blur-2xl" />
                                <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full bg-slate-300/30 blur-2xl" />
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
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">TOEIC Vocabulary</p>
                                            <p className="text-sm font-semibold text-slate-600">頻出単語を小テスト化</p>
                                        </div>
                                        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                            無料
                                        </div>
                                    </div>
                                    <Image
                                        src="/MistapLP.png"
                                        alt="MistapのTOEIC単語テスト画面"
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

                <section id="supported-books" className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Supported TOEIC Books</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                目標スコアに近い単語帳から始める
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                TOEIC単語は、今のスコアと目標によって優先度が変わります。基礎を固めるなら銀フレ、頻出語を取り切るなら金フレから始められます。
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
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-90">{book.score}</p>
                                        <h3 className="mt-2 text-2xl font-extrabold">{book.shortName}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-base font-bold text-slate-900">{book.name}</p>
                                        <p className="mt-3 text-base leading-7 text-slate-600">{book.description}</p>
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                                            この単語帳でテストする
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
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Why Test Format</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    TOEIC単語は、見て分かるより「すぐ選べる」状態が大切
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    TOEIC本番では、単語の意味をゆっくり思い出す時間はありません。小テストで反応速度を上げておくと、リーディングにもリスニングにも効きます。
                                </p>
                            </div>
                            <div className="mt-8 grid gap-5 md:grid-cols-3">
                                {useCases.map((item) => {
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
                        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Score Routes</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    目標スコア別の始め方
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    迷ったら、現在のスコアより少し上の目標から選ぶのがおすすめです。基礎語彙が不安なら、先に銀フレで穴を埋めると進めやすくなります。
                                </p>
                            </div>
                            <div className="space-y-4">
                                {scoreRoutes.map((route) => (
                                    <Link
                                        key={route.label}
                                        href={route.href}
                                        prefetch={false}
                                        className="group block rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-orange-600">{route.label}</p>
                                                <h3 className="mt-2 text-xl font-bold text-slate-900">{route.title}</h3>
                                            </div>
                                            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                                        </div>
                                        <p className="mt-3 text-base leading-7 text-slate-600">{route.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-[linear-gradient(180deg,#fff_0%,#fff7ed_100%)]">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">Study Flow</p>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                                    TOEIC単語の復習を、重くしすぎない
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-300">
                                    まとまった時間が取れない日でも、短い範囲をテストして苦手だけ残す。毎日の積み上げにしやすい流れです。
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

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Reading And Listening</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    TOEICの単語力は、Part別対策の土台になります
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    Part 5の語彙問題だけでなく、Part 3・4の聞き取りやPart 7の長文読解でも、頻出語の反応速度がスコアに影響します。
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: Gauge, text: 'Part 5・6で、語彙問題や品詞判断に時間を使いすぎない' },
                                    { icon: Headphones, text: 'Part 3・4で、音声中の頻出語を聞いてすぐ意味につなげる' },
                                    { icon: ListChecks, text: 'Part 7で、ビジネス文書や広告に出る語彙をすばやく処理する' },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.text} className="flex gap-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-orange-100">
                                            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
                                            <p className="text-base leading-7 text-slate-700">{item.text}</p>
                                        </div>
                                    );
                                })}
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
                        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#f97316_0%,#475569_100%)] p-8 md:p-12 text-white shadow-2xl shadow-orange-200">
                            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">Start Now</p>
                                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                                        今日のTOEIC単語を、小テストで確認
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-orange-50">
                                        単語帳を読むだけで終わらせず、意味を選べるかまで確認する。
                                        まずは金フレ・銀フレから、今の目標に近い教材を選んでください。
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
                                                <CheckCircle2 className="h-5 w-5 text-orange-500" />
                                                {book.shortName}で始める
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
