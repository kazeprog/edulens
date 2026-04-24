import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, CheckCircle, Layers3, Sparkles, Zap } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: '英単語が覚えられない人向けの学習ページ',
    description: '英単語が覚えられない、覚えてもすぐ忘れる人向けのMistap紹介ページ。間違えた単語だけを残して復習できる無料英単語テストで、暗記のやり直しを減らせます。',
    keywords: [
        '英単語 覚えられない',
        '英単語 すぐ忘れる',
        '単語 暗記 苦手',
        '英単語 復習 アプリ',
        '英単語 暗記 効率',
        '間違えた単語 復習',
        '英単語テスト 無料',
        '英単語 アプリ 高校生',
        '英単語 アプリ 中学生',
        '苦手単語 管理'
    ],
    alternates: {
        canonical: 'https://edulens.jp/mistap/english-words-not-sticking'
    },
    openGraph: {
        title: '英単語が覚えられない人向けの学習ページ | Mistap',
        description: '全部を何度もやり直すのではなく、間違えた単語だけを復習する学習へ。Mistapで英単語の定着を効率化。',
        url: 'https://edulens.jp/mistap/english-words-not-sticking',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: [
            {
                url: 'https://edulens.jp/MistapLP.png',
                width: 1200,
                height: 630,
                alt: 'Mistap 英単語が覚えられない人向けページ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '英単語が覚えられない人向けの学習ページ | Mistap',
        description: '間違えた単語だけを残して復習できる無料英単語テスト。',
        images: ['https://edulens.jp/MistapLP.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const reasons = [
    '覚えた単語と覚えていない単語が混ざったまま、毎回ぜんぶ見直している',
    '何を復習すべきかが曖昧で、勉強時間のわりに定着しない',
    '復習が面倒で、結局「見たつもり」で終わってしまう',
];

const solutions = [
    {
        icon: CheckCircle,
        title: '間違えた単語だけを残せる',
        description: 'テスト中に分からなかった単語をタップするだけで、次に見返すべき単語が自然に絞られます。',
    },
    {
        icon: Layers3,
        title: 'やり直しを最小限にできる',
        description: '全部を繰り返すのではなく、自分の穴だけを埋める学習に切り替えられます。',
    },
    {
        icon: Zap,
        title: '復習のハードルが低い',
        description: 'スマホで短時間に回せるので、復習を後回しにしにくくなります。',
    },
];

const audienceCards = [
    {
        href: '/mistap/chugaku-teiki-test',
        title: '中学生の定期テスト対策',
        description: '教科書単語の確認やテスト直前の見直しをしたい人へ。',
        accent: 'from-orange-500 to-red-500',
    },
    {
        href: '/mistap/textbook/system-words',
        title: '大学受験の英単語対策',
        description: 'システム英単語やターゲットで、受験用の語彙を固めたい人へ。',
        accent: 'from-sky-500 to-indigo-600',
    },
    {
        href: '/mistap/test-setup',
        title: 'まずはそのまま試す',
        description: '教材を選んで、Mistapの英単語テストをすぐ使いたい人へ。',
        accent: 'from-emerald-500 to-teal-600',
    },
];

const steps = [
    '教材と範囲を選ぶ',
    '分からない単語だけをタップする',
    '苦手リストから復習する',
    '定着したら次の範囲へ進む',
];

const faqs = [
    {
        q: '英単語が覚えられない人でも使いやすいですか？',
        a: 'はい。Mistapは「何を覚えていないのか」を見えるようにするのが得意なので、単語暗記が苦手な人ほど使いやすい設計です。',
    },
    {
        q: '全部の単語を何度もやる勉強と何が違いますか？',
        a: 'Mistapでは間違えた単語に絞って見直せるので、覚えている単語に時間をかけすぎず、苦手な部分に集中できます。',
    },
    {
        q: '無料で使えますか？',
        a: 'はい。登録なしでもテストは試せます。苦手単語の保存や学習履歴を使うなら無料登録がおすすめです。',
    },
];

export default function EnglishWordsNotStickingPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '英単語が覚えられない人向けの学習ページ | Mistap',
        url: 'https://edulens.jp/mistap/english-words-not-sticking',
        description: '英単語が覚えられない、覚えてもすぐ忘れる人向けに、Mistapの学習体験を紹介するページ。',
        about: [
            '英単語が覚えられない',
            '英単語 復習',
            '苦手単語 管理',
            '英単語 暗記 効率化'
        ],
        isPartOf: {
            '@type': 'WebSite',
            name: 'Mistap',
            url: 'https://edulens.jp/mistap'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-white">
                <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_28%),linear-gradient(180deg,#fff1f2_0%,#ffffff_62%)] pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="mx-auto max-w-6xl px-4 relative z-10">
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700">
                                    <Brain className="h-4 w-4" />
                                    英単語が覚えられない人向け
                                </div>
                                <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                    英単語が覚えられないのは、
                                    <span className="block text-rose-600">復習する単語を絞れていないから</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                                    覚えている単語まで何度もやり直していると、時間をかけても定着しづらくなります。
                                    Mistapは、間違えた単語だけを残して復習できる無料の英単語テストです。
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/mistap/test-setup"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose-200 transition hover:scale-[1.02]"
                                    >
                                        いますぐ試す
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#why"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-lg font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-600"
                                    >
                                        理由を見る
                                    </Link>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">間違えた単語だけ残る</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">登録なしでも試せる</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">中学・高校教材に対応</span>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-4 top-6 h-24 w-24 rounded-full bg-rose-300/30 blur-2xl" />
                                <div className="absolute -right-4 bottom-6 h-28 w-28 rounded-full bg-sky-300/30 blur-2xl" />
                                <div className="relative overflow-hidden rounded-[30px] border border-rose-100 bg-white p-4 shadow-2xl shadow-rose-100/70">
                                    <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Mistap</p>
                                            <p className="text-sm font-semibold text-slate-600">英単語の復習を絞る学習</p>
                                        </div>
                                        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                            無料
                                        </div>
                                    </div>
                                    <Image
                                        src="/MistapLP.png"
                                        alt="Mistapの英単語テスト画面"
                                        width={1200}
                                        height={630}
                                        className="rounded-2xl border border-slate-100"
                                    />
                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-2xl bg-rose-50 p-4">
                                            <p className="text-xs font-bold text-rose-600">POINT 1</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">苦手が見える</p>
                                        </div>
                                        <div className="rounded-2xl bg-sky-50 p-4">
                                            <p className="text-xs font-bold text-sky-600">POINT 2</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">復習が軽い</p>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-50 p-4">
                                            <p className="text-xs font-bold text-emerald-600">POINT 3</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">続けやすい</p>
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
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Why It Happens</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    覚えられない原因は、「暗記力不足」だけではありません
                                </h2>
                            </div>
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {reasons.map((reason) => (
                                    <div key={reason} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                                            <Brain className="h-5 w-5" />
                                        </div>
                                        <p className="text-base leading-7 text-slate-700">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="why" className="py-4 pb-16 md:pb-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">How Mistap Helps</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Mistapは、「全部やり直す復習」から抜け出すためのページです
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                重要なのは、今の自分に必要な復習を軽く回せることです。
                                Mistapでは、テストしながら苦手だけを残せるので、復習の密度を上げやすくなります。
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {solutions.map((item) => {
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

                <section className="py-16 md:py-20 bg-[linear-gradient(180deg,#fff_0%,#fdf2f8_100%)]">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-300">Study Flow</p>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                                    やることは、かなりシンプルです
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-300">
                                    「覚えられない」を減らすために、まずは復習を軽く回せる形にする。Mistapはその入口として使いやすく作っています。
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

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-3xl">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Where To Start</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    あなたの状況に近いところから始める
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    悩みは同じでも、今使っている教材や目的は人によって違います。ここから近い導線へそのまま進めます。
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-5 lg:grid-cols-3">
                            {audienceCards.map((card) => (
                                <Link
                                    key={card.href}
                                    href={card.href}
                                    prefetch={false}
                                    className="group overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-lg shadow-rose-100/40 transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className={`bg-gradient-to-r ${card.accent} px-6 py-5 text-white`}>
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-90">Mistap Route</p>
                                        <h3 className="mt-2 text-2xl font-extrabold">{card.title}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-base leading-7 text-slate-600">{card.description}</p>
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                                            この導線で始める
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
                        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#f43f5e_0%,#ec4899_100%)] p-8 md:p-12 text-white shadow-2xl shadow-rose-200">
                            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-100">Final CTA</p>
                                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                                        英単語の復習を、もっと軽く、もっと絞る
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-rose-50">
                                        「覚えられない」を減らすには、全部を気合で回すより、苦手だけを回しやすくするほうが近道です。
                                        まずは一度、Mistapのテストを試してみてください。
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
                                            まずはテストを試す
                                        </span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/textbook/system-words"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-rose-50"
                                    >
                                        <span className="flex items-center gap-3">
                                            <BookOpen className="h-5 w-5 text-rose-500" />
                                            シス単向けページを見る
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
