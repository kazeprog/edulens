import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, Gauge, ListChecks, RefreshCcw, Sparkles, Target } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: '苦手単語だけ復習したい人向けの英単語アプリ | Mistap',
    description: '間違えた英単語だけを復習したい人向けのMistap紹介ページ。苦手単語を自動で残し、全部をやり直さずに効率よく見直せる無料英単語アプリです。',
    keywords: [
        '苦手単語 復習',
        '間違えた単語 復習',
        '英単語 苦手 リスト',
        '英単語 復習 アプリ',
        '英単語 やり直し 効率',
        '英単語テスト 無料',
        '英単語 苦手管理',
        '英単語 復習 テスト',
        '覚えてない単語だけ 復習',
        '英単語 弱点 克服'
    ],
    alternates: {
        canonical: 'https://edulens.jp/mistap/review-weak-words'
    },
    openGraph: {
        title: '苦手単語だけ復習したい人向けの英単語アプリ | Mistap',
        description: '全部やり直さず、間違えた単語だけを復習できるMistapの学習ページ。',
        url: 'https://edulens.jp/mistap/review-weak-words',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        locale: 'ja_JP',
        images: [
            {
                url: 'https://edulens.jp/MistapLP.png',
                width: 1200,
                height: 630,
                alt: 'Mistap 苦手単語復習ページ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '苦手単語だけ復習したい人向けの英単語アプリ | Mistap',
        description: '間違えた単語だけを残して見直せる無料英単語テスト。',
        images: ['https://edulens.jp/MistapLP.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const problems = [
    '単語帳を最初から見直すたびに、覚えている単語にも時間を使ってしまう',
    'どの単語が苦手なのか曖昧で、復習がなんとなくになりやすい',
    '間違えた単語を自分でメモするのが面倒で、復習が続かない',
];

const benefits = [
    {
        icon: ListChecks,
        title: '苦手単語が自動で残る',
        description: '分からなかった単語をテスト中にタップするだけで、復習すべき単語が自然にたまります。',
    },
    {
        icon: Target,
        title: '復習の的を絞れる',
        description: '覚えている単語を何度も回すのではなく、自分の弱点にだけ時間を使えます。',
    },
    {
        icon: RefreshCcw,
        title: '見直しを回しやすい',
        description: '苦手単語だけで復習テストを回せるので、やり直しの負担がかなり軽くなります。',
    },
];

const flow = [
    '教材と範囲を選んでテストする',
    '分からなかった単語だけをタップする',
    '苦手リストにたまった単語を確認する',
    '必要なら復習テストで弱点だけ回す',
];

const routes = [
    {
        href: '/mistap/test-setup',
        title: 'そのままテストを始める',
        description: '教材を選んで、Mistapの英単語テストをすぐ試したい人へ。',
        accent: 'from-rose-500 to-pink-600',
    },
    {
        href: '/mistap/english-words-not-sticking',
        title: '英単語が覚えられない人向けページ',
        description: 'なぜ定着しないのかから整理して、学習の流れを見直したい人へ。',
        accent: 'from-sky-500 to-indigo-600',
    },
    {
        href: '/mistap/chugaku-teiki-test',
        title: '中学生の定期テスト対策',
        description: '教科書単語の見直しやテスト前確認につなげたい人へ。',
        accent: 'from-orange-500 to-red-500',
    },
];

const faqs = [
    {
        q: '本当に苦手単語だけ復習できますか？',
        a: 'はい。Mistapは間違えた単語をベースに見直しや復習テストへつなげやすいので、全部を最初からやり直す必要が減ります。',
    },
    {
        q: '復習用の単語を自分でまとめなくても大丈夫ですか？',
        a: '大丈夫です。Mistapではテスト中に分からなかった単語をタップする形なので、紙やメモアプリに写す手間を減らせます。',
    },
    {
        q: '無料で使えますか？',
        a: 'はい。まずは登録なしでも試せます。記録を残して継続的に使いたい場合は無料登録がおすすめです。',
    },
];

export default function ReviewWeakWordsPage() {
    const pageUrl = 'https://edulens.jp/mistap/review-weak-words';
    const breadcrumbItems = [
        { name: 'Mistap', url: 'https://edulens.jp/mistap' },
        { name: '苦手単語だけ復習したい人向け', url: pageUrl },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                name: '苦手単語だけ復習したい人向けの英単語アプリ | Mistap',
                url: pageUrl,
                description: '苦手単語だけを効率よく復習したい人向けに、Mistapの学習体験を紹介するページ。',
                about: [
                    '苦手単語 復習',
                    '間違えた単語 復習',
                    '英単語 弱点管理',
                    '英単語 復習テスト'
                ],
                isPartOf: {
                    '@type': 'WebSite',
                    name: 'Mistap',
                    url: 'https://edulens.jp/mistap'
                }
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
                itemListElement: breadcrumbItems.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: item.url,
                }))
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
                    '苦手単語の自動記録',
                    '間違えた単語だけの復習',
                    '復習テストの作成'
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
                <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(251,113,133,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.16),_transparent_26%),linear-gradient(180deg,#fff7ed_0%,#ffffff_64%)] pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="mx-auto max-w-6xl px-4 relative z-10">
                        <nav aria-label="パンくず" className="mb-8 text-sm text-slate-500">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li>
                                    <Link href="/mistap" prefetch={false} className="hover:text-rose-600 transition-colors">
                                        Mistap
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-slate-700">苦手単語だけ復習したい人向け</li>
                            </ol>
                        </nav>
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                                    <Gauge className="h-4 w-4" />
                                    苦手単語だけを復習したい人向け
                                </div>
                                <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                    全部やり直さない。
                                    <span className="block text-rose-600">間違えた単語だけ、最短で潰す</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                                    Mistapは、英単語テストをしながら苦手単語を残し、弱点だけを見直しやすくする無料学習ページです。
                                    覚えている単語まで毎回やり直す負担を減らして、復習をもっと軽くできます。
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/mistap/test-setup"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose-200 transition hover:scale-[1.02]"
                                    >
                                        苦手単語の復習を試す
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#benefits"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-lg font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-600"
                                    >
                                        どう役立つか見る
                                    </Link>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">弱点だけ見直せる</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">メモ不要で苦手管理</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">復習テストにつなげやすい</span>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-rose-300/30 blur-2xl" />
                                <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full bg-teal-300/25 blur-2xl" />
                                <div className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-100/70">
                                    <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Mistap</p>
                                            <p className="text-sm font-semibold text-slate-600">苦手単語に集中する学習</p>
                                        </div>
                                        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                            無料
                                        </div>
                                    </div>
                                    <Image
                                        src="/MistapLP.png"
                                        alt="Mistapの苦手単語復習イメージ"
                                        width={1200}
                                        height={630}
                                        className="rounded-2xl border border-slate-100"
                                    />
                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-2xl bg-rose-50 p-4">
                                            <p className="text-xs font-bold text-rose-600">STEP 1</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">テストする</p>
                                        </div>
                                        <div className="rounded-2xl bg-orange-50 p-4">
                                            <p className="text-xs font-bold text-orange-600">STEP 2</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">苦手を残す</p>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-50 p-4">
                                            <p className="text-xs font-bold text-emerald-600">STEP 3</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">弱点だけ復習</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="rounded-[32px] border border-slate-100 bg-slate-50 p-8 md:p-10">
                            <div className="max-w-3xl">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Problem</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    復習が重いと、苦手単語の見直しは続きにくくなります
                                </h2>
                            </div>
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {problems.map((problem) => (
                                    <div key={problem} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <p className="text-base leading-7 text-slate-700">{problem}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="benefits" className="py-4 pb-16 md:pb-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Benefits</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Mistapなら、苦手単語の復習が「やりやすい形」になります
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                大事なのは、苦手を見つけることより、そのあとに回しやすいことです。
                                Mistapは弱点を残して、次の復習につなげやすい流れを作れます。
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {benefits.map((item) => {
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

                <section className="py-16 md:py-20 bg-[linear-gradient(180deg,#fff_0%,#fff1f2_100%)]">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-300">Flow</p>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                                    苦手単語の復習まで、流れで進められます
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-300">
                                    最初から完璧に管理する必要はなくて、テストしながら自然に苦手を残せるだけでも復習の質はかなり変わります。
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {flow.map((step, index) => (
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

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Routes</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                次の一歩を、そのまま選べます
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                「まず使う」「学習の考え方も見直す」「中学生向け導線へ進む」など、近い目的のページへすぐ移れます。
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 lg:grid-cols-3">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    prefetch={false}
                                    className="group overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-lg shadow-rose-100/40 transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className={`bg-gradient-to-r ${route.accent} px-6 py-5 text-white`}>
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-90">Mistap Route</p>
                                        <h3 className="mt-2 text-2xl font-extrabold">{route.title}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-base leading-7 text-slate-600">{route.description}</p>
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                                            この導線で進む
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-slate-50">
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
                        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#f43f5e_0%,#fb7185_100%)] p-8 md:p-12 text-white shadow-2xl shadow-rose-200">
                            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-100">Final CTA</p>
                                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                                        苦手単語だけの復習に、切り替えてみる
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-rose-50">
                                        復習が重いままだと、見直しそのものが続きにくくなります。
                                        Mistapで、弱点だけを回しやすい形にしてみてください。
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <Link
                                        href="/mistap/test-setup"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-rose-50"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Sparkles className="h-5 w-5 text-rose-500" />
                                            まずはテストを始める
                                        </span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/english-words-not-sticking"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-rose-50"
                                    >
                                        <span className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-rose-500" />
                                            覚えられない悩みのページへ
                                        </span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/chugaku-teiki-test"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-left font-bold text-white transition hover:bg-white/20"
                                    >
                                        <span className="flex items-center gap-3">
                                            <BookOpen className="h-5 w-5" />
                                            中学生向けページへ
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
