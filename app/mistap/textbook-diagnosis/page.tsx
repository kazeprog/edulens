import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, SearchCheck, ShoppingCart, Sparkles } from 'lucide-react';
import MistapFooter from '@/components/mistap/Footer';
import TextbookDiagnosisClient from '@/components/mistap/TextbookDiagnosisClient';

const pageTitle = '英単語帳診断｜あなたに合う単語帳をおすすめ - Mistap';
const pageDescription =
    '学年・目的・単語力・覚え方から、大学受験、英検、TOEIC、定期テストに合う英単語帳を診断。Amazonで教材を確認し、Mistapでそのまま小テストを始められます。';
const canonicalUrl = 'https://edulens.jp/mistap/textbook-diagnosis';
const ogImageUrl = `${canonicalUrl}/opengraph-image`;

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
        images: [
            {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: '英単語帳診断 - Mistap',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: [ogImageUrl],
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
    { name: 'TOEIC 金のフレーズ', href: '/mistap/textbook/toeic-gold' },
];

const selectionPoints = [
    {
        title: '目的から選ぶ',
        description:
            '大学受験、英検、TOEIC、定期テストでは必要な語彙が違います。まずは試験の目的を決めると、単語帳の候補を絞りやすくなります。',
    },
    {
        title: '今の単語力に合わせる',
        description:
            '難しすぎる単語帳は続きにくく、簡単すぎる単語帳は伸びが小さくなります。正答率が6割から8割になるレベルを選ぶのが目安です。',
    },
    {
        title: '覚え方との相性を見る',
        description:
            '頻出順で短時間に回したい人、例文で文脈ごと覚えたい人、長文読解につなげたい人で向いている教材は変わります。',
    },
];

const audienceGuides = [
    {
        title: '大学受験向け',
        description:
            '共通テストから私大・国公立二次までを見据えるなら、頻出語の広さと復習しやすさを重視します。',
        textbooks: [
            { name: 'システム英単語', href: '/mistap/textbook/system-words', note: 'ミニマルフレーズで使い方まで確認しやすい定番。' },
            { name: 'ターゲット1900', href: '/mistap/textbook/target-1900', note: '頻出順でテンポよく受験語彙を固めたい人向け。' },
            { name: 'LEAP', href: '/mistap/textbook/leap', note: '語法やニュアンスも含めて受験英語を整理したい人向け。' },
        ],
    },
    {
        title: '英検向け',
        description:
            '級別に出やすい語彙を押さえることが大切です。受験級に合わせて過不足の少ない単語帳を選びます。',
        textbooks: [
            { name: '英検準2級 でる順パス単', href: '/mistap/textbook/eiken-pre2-passtan-5th', note: '高校初級から英検準2級の語彙を固めたい人向け。' },
            { name: '英検2級 でる順パス単', href: '/mistap/textbook/eiken-2-passtan-5th', note: '高校標準から英検2級の頻出語を確認したい人向け。' },
            { name: '英検準1級 EX', href: '/mistap/textbook/eiken-pre1-ex', note: '発展語彙を増やして準1級の読解・作文に備える人向け。' },
        ],
    },
    {
        title: 'TOEIC向け',
        description:
            'TOEICはビジネス・日常場面の頻出表現を素早く思い出せることが重要です。目標スコアで選ぶと迷いにくくなります。',
        textbooks: [
            { name: '銀のフレーズ', href: '/mistap/textbook/toeic-silver', note: '600点を目指して基礎語彙を固めたい人向け。' },
            { name: '金のフレーズ', href: '/mistap/textbook/toeic-gold', note: 'TOEIC頻出表現をスコアアップに直結させたい人向け。' },
        ],
    },
    {
        title: '定期テスト・基礎固め向け',
        description:
            '学校の進度や中学・高校初級の語彙に合わせて、短い範囲で反復しやすい教材から始めます。',
        textbooks: [
            { name: 'ターゲット1200', href: '/mistap/textbook/target-1200', note: '高校英語の基礎を最初から確認したい人向け。' },
            { name: 'ターゲット1400', href: '/mistap/textbook/target-1400', note: '基礎から標準語彙へ進みたい高1・高2向け。' },
            { name: '中学教科書対応教材', href: '/mistap/textbook', note: '学校の教科書に合わせて小テストを作りたい人向け。' },
        ],
    },
];

const comparisonRows = [
    {
        purpose: '高校英語の基礎',
        level: '中学語彙から高校初級に不安がある',
        textbook: 'ターゲット1200',
        point: '短い範囲で正答率を上げてから標準レベルへ進む',
    },
    {
        purpose: '共通テスト・中堅大',
        level: '学校レベルはある程度できる',
        textbook: 'ターゲット1400 / システム英単語 / LEAP',
        point: '頻出語を広く回し、間違えた単語を翌日に復習する',
    },
    {
        purpose: '難関大・発展語彙',
        level: '標準語彙は戦える',
        textbook: '鉄緑会 東大英単語熟語 鉄壁 / 速読英単語 上級編',
        point: '多義語・派生語・文脈での意味まで確認する',
    },
    {
        purpose: '英検',
        level: '受験級に合わせて語彙を増やしたい',
        textbook: 'でる順パス単シリーズ',
        point: '級別の頻出語を範囲指定テストで繰り返す',
    },
    {
        purpose: 'TOEIC',
        level: 'スコアに直結する表現を覚えたい',
        textbook: '銀のフレーズ / 金のフレーズ',
        point: '日本語から英語フレーズを素早く思い出せる状態にする',
    },
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

    const recommendationItems = audienceGuides.flatMap((guide) => guide.textbooks);
    const recommendationListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '目的別おすすめ英単語帳',
        itemListElement: recommendationItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: `https://edulens.jp${item.href}`,
        })),
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd, webPageJsonLd, recommendationListJsonLd]) }}
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
                        <div className="max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-rose-600">
                                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                英単語帳の選び方
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                                おすすめ単語帳は「目的・レベル・覚え方」で決める
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                                英単語帳は有名な1冊を選べば必ず合うわけではありません。大学受験、英検、TOEIC、定期テストのどれを優先するか、今の単語力がどこにあるか、どんな覚え方なら続けやすいかを分けて考えると失敗しにくくなります。
                            </p>
                        </div>

                        <div className="mt-8 grid gap-5 md:grid-cols-3">
                            {selectionPoints.map((point, index) => (
                                <div key={point.title} className="border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-sm font-extrabold text-rose-700">
                                        {index + 1}
                                    </div>
                                    <h3 className="mt-4 text-lg font-bold text-slate-900">{point.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{point.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-slate-50 py-12 md:py-16">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                                <BookOpen className="h-4 w-4" aria-hidden="true" />
                                目的別おすすめ
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                                目的別に見るおすすめ英単語帳
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                                診断前に全体像を知りたい人向けに、大学受験・英検・TOEIC・定期テストで選ばれやすい単語帳を整理しました。各教材ページでは、そのまま範囲指定テストを作れます。
                            </p>
                        </div>

                        <div className="mt-8 grid gap-5 lg:grid-cols-2">
                            {audienceGuides.map((guide) => (
                                <div key={guide.title} className="border border-slate-200 bg-white p-5 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-900">{guide.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.description}</p>
                                    <div className="mt-5 space-y-3">
                                        {guide.textbooks.map((textbook) => (
                                            <Link
                                                key={`${guide.title}-${textbook.href}`}
                                                href={textbook.href}
                                                className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:border-blue-200 hover:bg-blue-50"
                                            >
                                                <span>
                                                    <span className="block text-sm font-bold text-slate-900">{textbook.name}</span>
                                                    <span className="mt-1 block text-xs leading-relaxed text-slate-600">{textbook.note}</span>
                                                </span>
                                                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-12 md:py-16">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
                                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                                比較表
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                                英単語帳おすすめ比較
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                                迷ったときは、目的と現在地を先に決めてから教材を選びます。買ったあとはMistapで小テスト化し、覚えたつもりの単語を定着まで確認できます。
                            </p>
                        </div>

                        <div className="mt-8 overflow-x-auto border border-slate-200">
                            <table className="min-w-[760px] w-full border-collapse bg-white text-left text-sm">
                                <thead className="bg-slate-100 text-slate-700">
                                    <tr>
                                        <th className="border-b border-slate-200 px-4 py-3 font-bold">目的</th>
                                        <th className="border-b border-slate-200 px-4 py-3 font-bold">今のレベル</th>
                                        <th className="border-b border-slate-200 px-4 py-3 font-bold">候補の単語帳</th>
                                        <th className="border-b border-slate-200 px-4 py-3 font-bold">進め方</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonRows.map((row) => (
                                        <tr key={row.purpose} className="border-b border-slate-100 last:border-b-0">
                                            <td className="px-4 py-4 font-bold text-slate-900">{row.purpose}</td>
                                            <td className="px-4 py-4 text-slate-600">{row.level}</td>
                                            <td className="px-4 py-4 text-slate-700">{row.textbook}</td>
                                            <td className="px-4 py-4 text-slate-600">{row.point}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-50 py-12 md:py-16">
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

                <section className="bg-white py-12 md:py-16">
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
