import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronRight, ClipboardList, School, Zap } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: '中学生の定期テスト向け英単語テスト',
    description: '中学生の英語定期テスト対策に使えるMistapの無料英単語テストページ。New Horizon・New Crownなどの教科書単語を、範囲指定と苦手復習で効率よく確認できます。',
    keywords: [
        '中学 英語 定期テスト 単語',
        '中学生 英単語 テスト',
        '中学 英単語 アプリ',
        '英語 定期テスト 対策 中学生',
        'New Horizon 単語テスト',
        'New Crown 単語テスト',
        '中学 教科書 英単語',
        '英単語 テスト 無料 中学生',
        '高校受験 英単語 基礎',
        '中学英語 単語 暗記'
    ],
    alternates: {
        canonical: 'https://edulens.jp/mistap/chugaku-teiki-test'
    },
    openGraph: {
        title: '中学生の定期テスト向け英単語テスト | Mistap',
        description: '教科書対応の無料英単語テストで、中学英語の定期テスト対策を効率化。間違えた単語だけを復習できます。',
        url: 'https://edulens.jp/mistap/chugaku-teiki-test',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: [
            {
                url: 'https://edulens.jp/MistapLP.png',
                width: 1200,
                height: 630,
                alt: 'Mistap 中学生の定期テスト対策ページ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '中学生の定期テスト向け英単語テスト | Mistap',
        description: '中学英語の教科書単語を、無料の英単語テストで効率よく確認。',
        images: ['https://edulens.jp/MistapLP.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const painPoints = [
    'テスト範囲の単語だけを、短時間で確認したい',
    '覚えた単語まで毎回やり直してしまい、時間が足りない',
    '教科書準拠で練習したいのに、ちょうどいい単語テストがない',
];

const features = [
    {
        icon: ClipboardList,
        title: '教科書に合わせて範囲指定',
        description: 'New Horizon や New Crown など、中学英語の学習進度に合わせてテスト範囲を選べます。',
    },
    {
        icon: CheckCircle,
        title: '間違えた単語だけを自動で復習',
        description: '分からなかった単語をタップするだけで苦手が残るので、テスト前の見直しが一気に楽になります。',
    },
    {
        icon: Zap,
        title: 'スマホですぐ始められる',
        description: '登録なしでもすぐ試せるので、授業のあとや前日の夜にもサッと確認できます。',
    },
];

const textbookLinks = [
    {
        href: '/mistap/textbook/new-horizon',
        label: 'New Horizon',
        subtitle: '東京書籍の教科書で勉強している人向け',
        accent: 'from-orange-500 to-amber-600',
        note: 'Unitごとに確認',
    },
    {
        href: '/mistap/textbook/new-crown',
        label: 'New Crown',
        subtitle: '三省堂の教科書で勉強している人向け',
        accent: 'from-blue-500 to-indigo-600',
        note: 'Lessonごとに確認',
    },
    {
        href: '/mistap/textbook/target-1800',
        label: 'ターゲット1800',
        subtitle: '高校入試も見据えて基礎単語を固めたい人向け',
        accent: 'from-emerald-500 to-teal-600',
        note: '中学重要単語を総復習',
    },
];

const steps = [
    '使っている教材を選ぶ',
    'テスト範囲を選んですぐ開始',
    '分からない単語だけをタップ',
    '苦手リストで直前復習する',
];

const faqs = [
    {
        q: '会員登録しなくても使えますか？',
        a: 'はい。まずは登録なしでテストを試せます。苦手単語の保存や学習履歴の活用まで使いたい場合は無料登録がおすすめです。',
    },
    {
        q: '定期テストの直前だけでも使えますか？',
        a: '使えます。範囲を絞って短時間で確認できるので、前日や当日の最終チェックにも向いています。',
    },
    {
        q: '高校受験の基礎固めにも使えますか？',
        a: 'はい。教科書の確認だけでなく、ターゲット1800のような基礎単語の復習にもつなげられます。',
    },
];

export default function ChugakuTeikiTestPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '中学生の定期テスト向け英単語テスト | Mistap',
        url: 'https://edulens.jp/mistap/chugaku-teiki-test',
        description: '中学生の英語定期テスト対策に使える、教科書対応の無料英単語テストページ。',
        about: [
            '中学英語 定期テスト対策',
            '教科書対応 英単語テスト',
            'New Horizon 単語テスト',
            'New Crown 単語テスト'
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
                <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_32%),linear-gradient(180deg,#fff7ed_0%,#ffffff_58%)] pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-orange-100/50 to-transparent pointer-events-none" />
                    <div className="mx-auto max-w-6xl px-4 relative z-10">
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                                    <School className="h-4 w-4" />
                                    中学生の定期テスト対策に
                                </div>
                                <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                    教科書の単語を、
                                    <span className="block text-orange-600">テスト前に最短で固める</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                                    Mistapは、New Horizon や New Crown などの中学英語教材に対応した無料の英単語テストです。
                                    範囲を選んで確認し、間違えた単語だけを残せるので、定期テスト前の見直しがぐっと早くなります。
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="#textbook-links"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-7 py-4 text-lg font-bold text-white shadow-xl shadow-orange-200 transition hover:scale-[1.02]"
                                    >
                                        教材を選んですぐ始める
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/test-setup"
                                        prefetch={false}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-lg font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
                                    >
                                        汎用テスト作成へ
                                    </Link>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">登録不要で試せる</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">教科書進度に合わせやすい</span>
                                    <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">苦手単語だけ復習</span>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-orange-300/30 blur-2xl" />
                                <div className="absolute -right-6 bottom-8 h-28 w-28 rounded-full bg-red-300/20 blur-2xl" />
                                <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-100/70">
                                    <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Mistap</p>
                                            <p className="text-sm font-semibold text-slate-600">中学生の定期テスト向け英単語テスト</p>
                                        </div>
                                        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                            無料
                                        </div>
                                    </div>
                                    <Image
                                        src="/MistapLP.png"
                                        alt="Mistapの学習画面"
                                        width={1200}
                                        height={630}
                                        className="rounded-2xl border border-slate-100"
                                    />
                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-2xl bg-orange-50 p-4">
                                            <p className="text-xs font-bold text-orange-600">STEP 1</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">教科書を選ぶ</p>
                                        </div>
                                        <div className="rounded-2xl bg-sky-50 p-4">
                                            <p className="text-xs font-bold text-sky-600">STEP 2</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">範囲を確認</p>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-50 p-4">
                                            <p className="text-xs font-bold text-emerald-600">STEP 3</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">苦手だけ復習</p>
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
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Before The Test</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    定期テスト前、こんな状態になりがちではありませんか？
                                </h2>
                            </div>
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {painPoints.map((item) => (
                                    <div key={item} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                                            <ClipboardList className="h-5 w-5" />
                                        </div>
                                        <p className="text-base leading-7 text-slate-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-4 pb-16 md:pb-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Why Mistap</p>
                            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Mistapは、定期テスト直前の「確認しづらさ」を減らします
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                単語帳を最初から見返すのではなく、今必要な範囲だけテストし、間違えた単語だけを残す。
                                それが中学生のテスト対策と相性のいい使い方です。
                            </p>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            {features.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={feature.title} className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3>
                                        <p className="mt-3 text-base leading-7 text-slate-600">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section id="textbook-links" className="py-16 md:py-20 bg-[linear-gradient(180deg,#fff_0%,#fff7ed_100%)]">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-3xl">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Choose Your Book</p>
                                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                    使っている教材から、そのまま始める
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-slate-600">
                                    学校で使っている教科書に近い導線をここに集めました。迷ったらまず教科書名から入るのがいちばん早いです。
                                </p>
                            </div>
                            <Link
                                href="/mistap/test-setup"
                                prefetch={false}
                                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700"
                            >
                                ほかの教材もまとめて見る
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-5 lg:grid-cols-3">
                            {textbookLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={false}
                                    className="group overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-lg shadow-orange-100/40 transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className={`bg-gradient-to-r ${item.accent} px-6 py-5 text-white`}>
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-90">{item.note}</p>
                                        <h3 className="mt-2 text-2xl font-extrabold">{item.label}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-base leading-7 text-slate-600">{item.subtitle}</p>
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                                            この教材で始める
                                            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">4 Steps</p>
                                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                                    テスト前の使い方はシンプルです
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-300">
                                    毎日長く続けるというより、授業の復習や定期テスト前の確認に気持ちよく使える流れを意識しています。
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
                        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#f97316_0%,#ef4444_100%)] p-8 md:p-12 text-white shadow-2xl shadow-orange-200">
                            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">Final CTA</p>
                                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
                                        定期テスト前の単語確認を、もっと手早く
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-orange-50">
                                        教科書に沿って確認し、間違えた単語だけを残せば、見直しの効率はかなり変わります。
                                        まずは今使っている教材から試してみてください。
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <Link
                                        href="/mistap/textbook/new-horizon"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-orange-50"
                                    >
                                        <span className="flex items-center gap-3">
                                            <BookOpen className="h-5 w-5 text-orange-500" />
                                            New Horizonで始める
                                        </span>
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/textbook/new-crown"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-left font-bold text-slate-800 transition hover:bg-orange-50"
                                    >
                                        <span className="flex items-center gap-3">
                                            <BookOpen className="h-5 w-5 text-orange-500" />
                                            New Crownで始める
                                        </span>
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/mistap/test-setup"
                                        prefetch={false}
                                        className="inline-flex items-center justify-between rounded-2xl border border-white/30 bg-white/10 px-5 py-4 text-left font-bold text-white transition hover:bg-white/20"
                                    >
                                        <span className="flex items-center gap-3">
                                            <ChevronRight className="h-5 w-5" />
                                            汎用テスト作成ページへ
                                        </span>
                                        <ChevronRight className="h-5 w-5" />
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
