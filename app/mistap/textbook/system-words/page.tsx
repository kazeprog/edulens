import type { Metadata } from 'next';
import Link from 'next/link';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";

const SYSTEM_WORDS_CANONICAL_URL = 'https://edulens.jp/mistap/textbook/system-words';
const SYSTEM_WORDS_TOTAL = 2027;
const SYSTEM_WORDS_CHAPTERS = [
    { label: 'Chapter 1', range: 'No. 1-600', href: '/mistap/textbook/system-words/1' },
    { label: 'Chapter 2', range: 'No. 601-1200', href: '/mistap/textbook/system-words/2' },
    { label: 'Chapter 3', range: 'No. 1201-1685', href: '/mistap/textbook/system-words/3' },
    { label: 'Chapter 4', range: 'No. 1686-2027', href: '/mistap/textbook/system-words/4' },
] as const;
const SYSTEM_WORDS_STAGE5_LINK = {
    label: 'Stage5 多義語',
    range: '多義語184語',
    href: '/mistap/textbook/system-words-stage5',
} as const;
const SYSTEM_WORDS_DESCRIPTION = `システム英単語（シス単）全${SYSTEM_WORDS_TOTAL}語を無料で学習。範囲・問題数・回答方式を選んでテストを開始し、単語帳確認、苦手単語、学習履歴、正答率の確認までブラウザで使えます。`;

export const metadata: Metadata = {
    title: `システム英単語 学習アプリ｜全${SYSTEM_WORDS_TOTAL}語の無料テスト・単語帳 - Mistap`,
    description: SYSTEM_WORDS_DESCRIPTION,
    keywords: [
        'システム英単語',
        'シスタン',
        'System English Word',
        'シス単 テスト',
        'システム英単語 無料',
        '大学受験 英単語',
        '共通テスト 英単語',
        '駿台文庫 英単語',
        '英単語 アプリ 高校生',
        'システム英単語 一覧',
        'システム英単語 Chapter',
        'システム英単語 Stage',
        'シスタン 単語テスト',
        'シス単 一覧 無料',
        '英単語 テスト 大学受験',
        '英単語 クイズ 高校生',
        '共通テスト 単語',
        '難関大 英単語',
        '英単語 テスト 作成',
        '英単語 テスト 無料',
        'システム英単語 アプリ',
        'システム英単語 テスト アプリ',
        'システム英単語 単語テスト',
        'システム英単語 単語テスト アプリ',
        'システム英単語 2027語',
        'システム英単語 学習履歴',
        'システム英単語 進捗',
        'システム英単語 Webアプリ',
        'システム英単語 小テスト',
        'システム英単語 小テスト アプリ',
        'システム英単語 小テスト メーカー',
        'システム英単語 小テスト ジェネレーター',
        'シス単 アプリ',
        'シス単 小テスト',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: `システム英単語 学習アプリ｜全${SYSTEM_WORDS_TOTAL}語の無料テスト・単語帳 - Mistap`,
        description: SYSTEM_WORDS_DESCRIPTION,
        url: SYSTEM_WORDS_CANONICAL_URL,
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: `システム英単語 学習アプリ｜全${SYSTEM_WORDS_TOTAL}語の無料テスト・単語帳 - Mistap`,
        description: SYSTEM_WORDS_DESCRIPTION,
    },
    alternates: {
        canonical: SYSTEM_WORDS_CANONICAL_URL
    },
    robots: {
        index: true,
        follow: true,
    }
};

const systemWordsStructuredData = [
    {
        id: 'system-words-web-app',
        data: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'システム英単語 学習アプリ - Mistap',
            alternateName: ['シス単 学習アプリ', 'システム英単語 無料テスト'],
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            url: SYSTEM_WORDS_CANONICAL_URL,
            inLanguage: 'ja-JP',
            isAccessibleForFree: true,
            description: SYSTEM_WORDS_DESCRIPTION,
            featureList: [
                '範囲・問題数・回答方式を選んでテスト開始',
                `システム英単語全${SYSTEM_WORDS_TOTAL}語の範囲指定テスト`,
                'Chapter別の単語帳確認',
                '間違えた単語の苦手リスト化',
                '無料登録による学習履歴と正答率の確認',
                'スマートフォン・タブレット・PC対応',
            ],
            educationalLevel: 'HighSchool',
            audience: {
                '@type': 'EducationalAudience',
                educationalRole: 'student',
                educationalLevel: 'HighSchool',
            },
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'JPY',
            },
        },
    },
    {
        id: 'system-words-breadcrumb',
        data: {
            '@context': 'https://schema.org',
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
                    name: '対応教材一覧',
                    item: 'https://edulens.jp/mistap/textbook',
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'システム英単語 学習アプリ',
                    item: SYSTEM_WORDS_CANONICAL_URL,
                },
            ],
        },
    },
    {
        id: 'system-words-chapter-list',
        data: {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'システム英単語 Chapter別無料テスト',
            numberOfItems: SYSTEM_WORDS_CHAPTERS.length,
            itemListElement: SYSTEM_WORDS_CHAPTERS.map((chapter, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: `システム英単語 ${chapter.label}`,
                description: `${chapter.range} の英単語を無料で小テストできます。`,
                url: `https://edulens.jp${chapter.href}`,
            })),
        },
    },
];

export default function SystemWordsPage() {
    return (
        <>
            {systemWordsStructuredData.map(({ id, data }) => (
                <script
                    key={id}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
                />
            ))}
            <TextbookLPTemplate
                textbookName="システム英単語"
                textbookNameJa="システム英単語"
                publisherName="駿台文庫"
                themeColor="sky"
                presetTextbook="システム英単語"
                canonicalUrl={SYSTEM_WORDS_CANONICAL_URL}
                unitLabel="Chapter"
                audience="senior"
                bookType="wordbook"
                seoSettings={{
                    heroTitle: (
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                            <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">システム英単語 学習アプリ</span>
                            全{SYSTEM_WORDS_TOTAL}語を<br />
                            <span className="text-sky-500">Chapter別無料テストで反復</span>
                        </h1>
                    ),
                    heroDescription: `大学受験の定番「システム英単語（シス単）」全${SYSTEM_WORDS_TOTAL}語を、単語帳として確認しながら無料テストで反復できるWebアプリです。範囲・問題数・回答方式を選んで開始でき、苦手単語の復習や学習履歴、正答率の確認にも対応。インストール不要で共通テスト・難関大対策を始められます。`,
                    testSectionTitle: "システム英単語（シス単）の無料テストを今すぐ作成",
                    testSectionDescription: (
                        <p>
                            面倒な会員登録は不要。Chapterや番号範囲、問題数、回答方式を選ぶだけで、誰でも無料でシス単の小テストが作れます。<br />
                            <strong>システム英単語</strong>を選択してテストを作成してください。
                        </p>
                    ),
                    featuresTitle: "システム英単語（シス単）の暗記効率を最大化",
                    featuresDescription: (
                        <p>
                            Mistapは、ただ単語を眺めるだけの単語帳アプリではありません。<br className="hidden md:inline" />
                            「覚えたつもり」をテストで確認し、間違えた単語だけを戻せる英単語学習アプリです。
                        </p>
                    ),
                    feature1: {
                        title: `全${SYSTEM_WORDS_TOTAL}語をChapter別小テスト`,
                        description: "システム英単語のNo. 1-2027をChapter別にテスト可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
                    },
                    feature2: {
                        title: "苦手単語を自動でリスト化",
                        description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                    },
                    feature3: {
                        title: "学習履歴と進捗を保存",
                        description: "無料登録をすると学習履歴を残せます。スマホ・タブレット・PCから、ブラウザでシス単を継続できます。"
                    },
                    extraContent: <SystemWordsStudyAppSection />,
                    extraFaqs: [
                        {
                            question: "システム英単語は全何語に対応していますか？",
                            answer: `Mistapではシステム英単語のNo. 1からNo. ${SYSTEM_WORDS_TOTAL}までをChapter別に学習できます。Stage5の多義語は専用ページで184語を確認できます。`,
                        },
                        {
                            question: "システム英単語を単語帳として確認できますか？",
                            answer: "はい。Chapter別の範囲を確認しながら、そのまま小テストに進めます。単語帳で覚えた範囲の確認や、学校の小テスト前の総復習に使えます。",
                        },
                        {
                            question: "システム英単語のChapter別テストは作れますか？",
                            answer: "はい。Chapter 1からChapter 4まで、範囲を指定して無料で小テストを作成できます。単語から意味、意味から単語の両方に対応しています。",
                        },
                        {
                            question: "アプリのインストールは必要ですか？",
                            answer: "不要です。ブラウザでそのまま使えるWebアプリなので、スマートフォン、タブレット、PCからすぐに学習できます。",
                        },
                    ],
                }}
            />
        </>
    );
}

function SystemWordsStudyAppSection() {
    const summaryStats = [
        { value: `${SYSTEM_WORDS_TOTAL}語`, label: '収録英単語' },
        { value: 'Chapter別', label: '範囲指定' },
        { value: '無料', label: '小テスト作成' },
        { value: '履歴保存', label: '無料登録で対応' },
    ];
    const learningFlow = [
        {
            title: '学習を始める',
            description: 'Chapterや番号範囲、問題数、回答方式を選んで、すぐにシステム英単語の小テストを開始できます。',
        },
        {
            title: '単語帳',
            description: `全${SYSTEM_WORDS_TOTAL}語をChapter別に確認。覚えた範囲だけを指定して、定着度をその場でチェックできます。`,
        },
        {
            title: '学習履歴',
            description: '無料登録すると、正答率や過去のテスト結果、間違えた苦手単語をあとから確認できます。',
        },
    ];

    return (
        <section className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
                    <div>
                        <p className="text-sm font-bold text-sky-600 mb-3">システム英単語 学習アプリとして使える</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-5">
                            全{SYSTEM_WORDS_TOTAL}語を覚えっぱなしにせず、<br className="hidden md:inline" />
                            Chapter別に確認テストまで進めます。
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Mistapでは、システム英単語の学習範囲を選んで、その場で小テストを作成できます。
                            「単語帳で確認する」「出題範囲を決める」「間違えた単語を復習する」「学習履歴を残す」流れを1つのページで進められます。
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {summaryStats.map((stat) => (
                                <div key={stat.label} className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-center">
                                    <div className="text-lg font-black text-sky-700">{stat.value}</div>
                                    <div className="mt-1 text-xs font-bold text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 grid sm:grid-cols-3 gap-3">
                            {['範囲指定', '苦手単語復習', 'スマホ対応'].map((label) => (
                                <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700">
                                    {label}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {learningFlow.map((item) => (
                                <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
                                    <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Chapter別に学習する</h3>
                        <div className="space-y-3">
                            {SYSTEM_WORDS_CHAPTERS.map((chapter) => (
                                <Link
                                    key={chapter.href}
                                    href={chapter.href}
                                    className="flex items-center justify-between gap-4 rounded-lg bg-white border border-slate-200 px-4 py-3 hover:border-sky-300 hover:text-sky-700 transition-colors"
                                >
                                    <span className="font-bold">{chapter.label}</span>
                                    <span className="text-sm text-slate-500">{chapter.range}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-5 border-t border-slate-200 pt-5">
                            <p className="mb-3 text-sm font-bold text-slate-600">多義語だけを集中したい場合</p>
                            <Link
                                href={SYSTEM_WORDS_STAGE5_LINK.href}
                                className="flex items-center justify-between gap-4 rounded-lg bg-sky-600 px-4 py-3 text-white hover:bg-sky-700 transition-colors"
                            >
                                <span className="font-bold">{SYSTEM_WORDS_STAGE5_LINK.label}</span>
                                <span className="text-sm text-sky-100">{SYSTEM_WORDS_STAGE5_LINK.range}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
