import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, SearchCheck, ShoppingCart, Sparkles } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';
import TextbookDiagnosisClient from '@/components/mistap/TextbookDiagnosisClient';

const pageTitle = '英単語帳診断｜あなたに合う単語帳をおすすめ - Mistap';
const pageDescription =
    '学年・目的・単語力・覚え方から、大学受験、英検、TOEIC、定期テストに合う英単語帳を診断。Amazonで教材を確認し、Mistapでそのまま小テストを始められます。';
const canonicalUrl = 'https://edulens.jp/mistap/textbook-diagnosis';

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        siteName: 'EduLens',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
    },
};

const useSteps = [
    {
        title: '診断する',
        description: '学年、目的、今の単語力、覚え方の好みを選びます。',
        icon: Sparkles,
    },
    {
        title: 'Amazonで確認する',
        description: '候補の単語帳をAmazonで確認できます。価格・在庫はAmazonの商品ページをご覧ください。',
        icon: ShoppingCart,
    },
    {
        title: 'Mistapでテストする',
        description: '購入済み・手元の教材は、対応ページから範囲指定テストに進めます。',
        icon: SearchCheck,
    },
];

const featuredTextbooks = [
    { name: 'システム英単語', href: '/mistap/textbook/system-words' },
    { name: 'ターゲット1900', href: '/mistap/textbook/target-1900' },
    { name: 'LEAP', href: '/mistap/textbook/leap' },
    { name: '速読英単語 必修編', href: '/mistap/textbook/sokutan-hisshu-8th' },
    { name: '英検2級 でる順パス単', href: '/mistap/textbook/eiken-2-passtan-5th' },
    { name: 'TOEIC 銀のフレーズ', href: '/mistap/textbook/toeic-silver' },
    { name: 'TOEIC 金のフレーズ', href: '/mistap/textbook/toeic-gold' },
];

const faqItems = [
    {
        question: '診断結果の単語帳はMistapでテストできますか？',
        answer: 'はい。診断で表示される主な英単語帳は、Mistapの教材ページから範囲指定テストを作成できます。',
    },
    {
        question: 'Amazonリンクには価格や在庫が表示されますか？',
        answer: 'このページでは価格・在庫は表示していません。最新情報はAmazonの商品ページでご確認ください。',
    },
    {
        question: 'まだ単語帳を持っていなくても使えますか？',
        answer: '使えます。目的に合う候補を診断し、Amazonで教材を確認してから、Mistapで小テスト学習を始められます。',
    },
];

export default function TextbookDiagnosisPage() {
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'EduLens',
                item: 'https://edulens.jp',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Mistap',
                item: 'https://edulens.jp/mistap',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: '英単語帳診断',
                item: canonicalUrl,
            },
        ],
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    const webPageJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '英単語帳診断',
        description: pageDescription,
        url: canonicalUrl,
        isPartOf: {
            '@type': 'WebSite',
            name: 'EduLens',
            url: 'https://edulens.jp',
        },
        about: ['英単語帳', '英単語帳診断', '大学受験英語', '英検', 'TOEIC'],
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd, webPageJsonLd]) }}
            />
            <main>
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-14 lg:py-16">
                        <div className="flex flex-col justify-center">
                            <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="breadcrumb">
                                <Link href="/mistap" className="hover:text-blue-600">
                                    Mistap
                                </Link>
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                <Link href="/mistap/textbook" className="hover:text-blue-600">
                                    対応教材一覧
                                </Link>
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                <span className="font-semibold text-slate-700">英単語帳診断</span>
                            </nav>

                            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700">
                                <Sparkles className="h-4 w-4" aria-hidden="true" />
                                目的別に選べる単語帳診断
                            </div>
                            <h1 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
                                あなたに合う英単語帳を診断
                            </h1>
                            <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
                                定期テスト、大学受験、英検、TOEICまで。今の単語力と覚え方に合わせて、候補の単語帳とMistapでの進め方を提案します。
                            </p>
                            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                                このページのAmazonリンクはアソシエイトリンクを含みます。価格・在庫はAmazonの商品ページでご確認ください。
                            </p>
                        </div>

                        <TextbookDiagnosisClient />
                    </div>
                </section>

                <section className="bg-slate-50 py-12 md:py-16">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="grid gap-6 md:grid-cols-3">
                            {useSteps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.title} className="border-t-4 border-rose-500 bg-white px-5 py-6 shadow-sm">
                                        <Icon className="h-7 w-7 text-rose-500" aria-hidden="true" />
                                        <h2 className="mt-4 text-lg font-bold text-slate-900">{step.title}</h2>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-12 md:py-16">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                                    対応教材
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                                    診断後は教材ページで小テストへ
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                                    主要な英単語帳は、教材ごとの範囲指定テストに対応しています。単語帳を選んだあとも、覚えた範囲をすぐ確認できます。
                                </p>
                            </div>
                            <Link
                                href="/mistap/textbook"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700"
                            >
                                対応教材一覧を見る
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredTextbooks.map((textbook) => (
                                <Link
                                    key={textbook.href}
                                    href={textbook.href}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <span>{textbook.name}</span>
                                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-slate-50 py-12 md:py-16">
                    <div className="mx-auto max-w-4xl px-4">
                        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">よくある質問</h2>
                        <div className="mt-6 space-y-4">
                            {faqItems.map((item) => (
                                <div key={item.question} className="rounded-lg border border-slate-200 bg-white p-5">
                                    <h3 className="flex items-start gap-2 text-base font-bold text-slate-900">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                                        {item.question}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <MistapFooter />
        </div>
    );
}
