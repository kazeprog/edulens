import { Metadata } from 'next';
import Link from 'next/link';
import Background from "@/components/mistap/Background";
import MistapFooter from "@/components/mistap/Footer";
import TestSetupContent from "@/components/mistap/TestSetupContent";
import HeroSection from "@/components/mistap/HeroSection";
import FeaturesSection from "@/components/mistap/FeaturesSection";
import React from 'react';

// ---------------------------------------------
// 1. 教材データの定義（カテゴリ追加）
// ---------------------------------------------
type BookData = {
    title: string;
    subTitle: string;
    desc: string;
    keywords: string[];
    selectedText: string;
    category: 'english' | 'kobun';
};

const BOOKS: Record<string, BookData> = {
    'target-1900': {
        title: 'ターゲット1900対応 Webテスト',
        subTitle: 'Webで即・実力診断。',
        desc: 'ターゲット1900対応の無料単語テスト。範囲を指定してテストを作成し、間違えた単語だけを効率よく復習できます。',
        keywords: ['ターゲット1900', '単語テスト', 'アプリ', '小テスト', '確認', '大学受験', '英語'],
        selectedText: 'ターゲット1900',
        category: 'english',
    },
    'target-1200': {
        title: 'ターゲット1200対応 Webテスト',
        subTitle: '基礎から固める英単語。',
        desc: 'ターゲット1200の定着度をテスト。高校初級レベルの英単語を効率よく復習し、英語の基礎力を盤石にします。',
        keywords: ['ターゲット1200', '単語テスト', 'アプリ', '基礎', '英語', '高校生'],
        selectedText: 'ターゲット1200',
        category: 'english',
    },
    'systan': {
        title: 'システム英単語対応 確認テスト',
        subTitle: '通学中に「シス単」全範囲をテスト。',
        desc: 'システム英単語（シス単）対応の無料テストアプリ。赤シートで隠すよりも速く、正確に。間違えた単語だけを自動で集めて「復習テスト」が作れます。',
        keywords: ['システム英単語', 'シス単', 'テスト', 'アプリ', 'Webテスト', '大学受験'],
        selectedText: 'システム英単語',
        category: 'english',
    },
    'leap': {
        title: 'LEAP対応 単語テスト',
        subTitle: 'LEAPの暗記状況をすぐチェック。',
        desc: 'LEAP（リープ）対応の無料単語テスト。範囲を指定してテストを作成し、間違えた単語だけを効率よく復習できます。',
        keywords: ['LEAP', 'リープ', '単語テスト', 'アプリ', '英語', '竹岡広信'],
        selectedText: 'LEAP',
        category: 'english',
    },
    'duo-30': {
        title: 'DUO 3.0対応 暗記テスト',
        subTitle: '例文の単語、本当に覚えてる？',
        desc: 'DUO 3.0掲載語彙の定着度テスト。通勤・通学のスキマ時間を使って、自分の記憶漏れをWebアプリで診断できます。',
        keywords: ['DUO3.0', 'テスト', 'アプリ', '復習', '英語', '例文'],
        selectedText: 'DUO 3.0例文',
        category: 'english',
    },
    'toeic-gold': {
        title: 'TOEIC L&R 金のフレーズ対応 テスト',
        subTitle: 'TOEICスコアアップの近道。',
        desc: '金のフレーズ対応の無料テスト。TOEIC頻出単語の暗記状況を瞬時にチェックし、弱点を効率的に克服しましょう。',
        keywords: ['TOEIC', '金のフレーズ', 'テスト', 'アプリ', '英語', '資格'],
        selectedText: 'TOEIC金のフレーズ',
        category: 'english',
    },
    'kobun-315': {
        title: '読んで見て聞いて覚える 重要古文単語315対応 テスト',
        subTitle: '古文単語の「小テスト」対策に。',
        desc: '重要古文単語315の見出し語をWebでテスト。意味が出てこない単語をタップするだけで、試験直前の総チェックが完了します。',
        keywords: ['重要古文単語315', '古文単語', 'テスト', '確認', 'アプリ', '古文'],
        selectedText: '読んで見て聞いて覚える 重要古文単語315',
        category: 'kobun',
    },
    'kobun-330': {
        title: 'Key & Point古文単語330対応 テスト',
        subTitle: 'ポイントを押さえて古文攻略。',
        desc: 'Key & Point古文単語330の見出し語をWebでテスト。入試頻出の古文単語を効率的にチェックできます。',
        keywords: ['Key&Point古文単語330', '古文単語', 'テスト', 'アプリ', '330', '古文'],
        selectedText: 'Key&Point古文単語330',
        category: 'kobun',
    },
    'kobun-325': {
        title: 'ベストセレクション古文単語325対応 テスト',
        subTitle: '厳選された古文単語を制覇。',
        desc: 'ベストセレクション古文単語325対応の無料テスト。入試に必要な重要単語の定着度を確認し、得点力をアップさせましょう。',
        keywords: ['ベストセレクション古文単語325', '古文単語', 'テスト', 'アプリ', '古文'],
        selectedText: 'ベストセレクション古文単語325',
        category: 'kobun',
    },
};

// ---------------------------------------------
// 2. 静的パスの生成 (SSG)
// ---------------------------------------------
export async function generateStaticParams() {
    return Object.keys(BOOKS).map((slug) => ({
        slug: slug,
    }));
}

// ---------------------------------------------
// 3. メタデータの動的生成 (SEO強化)
// ---------------------------------------------
type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const book = BOOKS[slug];

    if (!book) return { title: 'ページが見つかりません | Mistap' };

    const siteUrl = 'https://edulens.jp/mistap';
    const pageUrl = `${siteUrl}/books/${slug}`;

    return {
        title: `${book.title} | 無料Webテストアプリ - Mistap`,
        description: `【無料・インストール不要】${book.title}。${book.desc} アプリのインストールなしで、今すぐブラウザから単語テストを開始できます。間違えた単語のみを効率的に復習可能です。`,
        keywords: [...book.keywords, 'Mistap', 'ミスタップ', 'EduLens', '無料'],
        openGraph: {
            title: `${book.title} | 無料Webテストアプリ`,
            description: book.desc,
            url: pageUrl,
            siteName: 'Mistap (ミスタップ)',
            locale: 'ja_JP',
            type: 'website',
            images: [
                {
                    url: '/MistapLP.png',
                    width: 1200,
                    height: 630,
                    alt: `${book.title} イメージ`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: book.title,
            description: book.subTitle,
            images: ['/MistapLP.png'],
        },
        alternates: {
            canonical: pageUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

// ---------------------------------------------
// 4. ページコンポーネント本体
// ---------------------------------------------
export default async function BookLP({ params }: PageProps) {
    const { slug } = await params;
    const book = BOOKS[slug];

    if (!book) {
        return <div className="p-10 text-center text-white">教材データが見つかりません。</div>;
    }

    const siteUrl = 'https://edulens.jp/mistap';
    const pageUrl = `${siteUrl}/books/${slug}`;

    // 構造化データ (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            // アプリケーション情報
            {
                '@type': 'SoftwareApplication',
                name: book.title,
                operatingSystem: 'Web',
                applicationCategory: 'EducationalApplication',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'JPY',
                },
                description: book.desc,
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '120',
                },
                featureList: '間違えた単語の自動記録, 分散学習法に基づく復習, 市販の単語帳に対応',
                screenshot: 'https://edulens.jp/MistapLP.png',
            },
            // パンくずリスト
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Mistap ホーム',
                        item: siteUrl,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: book.title,
                        item: pageUrl,
                    },
                ],
            },
        ],
    };

    // HeroSectionのカスタムタイトルと説明
    const heroTitle = (
        <>
            {book.title}<br />
            <span className="text-gray-900 mt-2 block md:inline text-lg md:text-2xl">{book.subTitle}</span>
        </>
    );

    const heroDescription = book.desc;

    return (
        <Background>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen flex flex-col">



                <main className="flex-grow">
                    {/* 統一されたHeroSectionを使用 */}
                    <HeroSection
                        title={heroTitle}
                        description={heroDescription}
                        showButtons={false}
                    />

                    {/* テスト作成コンポーネント */}
                    <section className="py-6 px-4">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">📚 今すぐテストする</h2>
                            <TestSetupContent embedMode={true} presetTextbook={book.selectedText} />
                        </div>
                    </section>

                    {/* 統一されたFeaturesSectionを使用 */}
                    <FeaturesSection />

                    {/* SEO対策テキスト・機能解説 */}
                    <section className="py-12 bg-white/95 backdrop-blur-sm rounded-t-3xl text-gray-800 mt-8">
                        <div className="max-w-4xl mx-auto px-4">

                            {/* SEO対策テキスト */}
                            <div className="prose prose-red mx-auto bg-red-50 p-6 rounded-lg text-sm text-gray-700 mb-12 shadow-sm border border-red-100">
                                <h3 className="text-base font-bold text-red-800 mb-2">{book.title}の学習に最適</h3>
                                <p className="mb-2">
                                    <strong>Mistap（ミスタップ）</strong>は、学校の小テストや定期テスト対策、大学受験の基礎固めに使える無料のWebテストアプリです。
                                    特に<strong>{book.selectedText}</strong>を使用している学生に最適化されており、
                                    アプリのインストールなしで、ブラウザからすぐにテストを開始できます。
                                </p>
                                <p>
                                    通学中の電車やバスの中、試験直前の休み時間など、スキマ時間を使って{book.category === 'english' ? '英単語' : '古文単語'}の実力を効率的にチェックしましょう。
                                    間違えた単語は自動的にリスト化され、苦手な部分だけを重点的に復習することができます。
                                </p>
                            </div>

                            {/* 他の教材へのリンク */}
                            <div className="mt-12 text-center">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">
                                    {book.category === 'english' ? '他の英単語帳もテストできます' : '他の古文単語帳もテストできます'}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {Object.entries(BOOKS)
                                        .filter(([key, val]) => key !== slug && val.category === book.category)
                                        .map(([key, value]) => (
                                            <Link
                                                key={key}
                                                href={`/mistap/books/${key}`}
                                                className="px-5 py-3 bg-white border border-gray-200 hover:border-red-400 hover:text-red-500 hover:shadow-md rounded-full text-sm text-gray-700 transition duration-300 font-medium"
                                            >
                                                {value.title.split('対応')[0]}
                                            </Link>
                                        ))}
                                </div>

                                {/* カテゴリ違いの教材リンク（控えめに表示） */}
                                <div className="mt-8">
                                    <p className="text-sm text-gray-500 mb-3">{book.category === 'english' ? '古文単語のテストはこちら' : '英単語のテストはこちら'}</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {Object.entries(BOOKS)
                                            .filter(([key, val]) => val.category !== book.category)
                                            .map(([key, value]) => (
                                                <Link
                                                    key={key}
                                                    href={`/mistap/books/${key}`}
                                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded text-xs text-gray-500 transition"
                                                >
                                                    {value.title.split('対応')[0]}
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <MistapFooter />
            </div>
        </Background>
    );
}

