import type { Metadata } from 'next';
import Link from 'next/link';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'システム英単語 学習アプリ｜単語帳・無料テスト - Mistap',
    description: 'システム英単語（シス単）対応の学習アプリ感覚ページ。単語帳としてChapter別に範囲を確認し、そのまま無料小テストで反復できます。共通テスト・大学受験対策に。',
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
        'システム英単語 小テスト',
        'システム英単語 小テスト アプリ',
        'システム英単語 小テスト メーカー',
        'システム英単語 小テスト ジェネレーター',
        'シス単 アプリ',
        'シス単 小テスト',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: 'システム英単語 学習アプリ｜単語帳・無料テスト - Mistap',
        description: 'システム英単語をChapter別に確認し、そのまま無料小テストで反復できます。',
        url: 'https://edulens.jp/mistap/textbook/system-words',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'システム英単語 学習アプリ｜単語帳・無料テスト - Mistap',
        description: 'システム英単語をChapter別に確認し、そのまま無料小テストで反復できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/system-words'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function SystemWordsPage() {
    return (
        <TextbookLPTemplate
            textbookName="システム英単語"
            textbookNameJa="システム英単語"
            publisherName="駿台文庫"
            themeColor="sky"
            presetTextbook="システム英単語"
            canonicalUrl="https://edulens.jp/mistap/textbook/system-words"
            unitLabel="Chapter"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">システム英単語（シス単）の学習アプリ・単語帳ページ</span>
                        収録英単語を<br />
                        <span className="text-sky-500">Chapter別小テストで反復</span>
                    </h1>
                ),
                heroDescription: "大学受験のバイブル「システム英単語（シス単）」を、単語帳として範囲確認しながら無料テストで反復できる学習アプリ感覚ページです。Chapter/Stageごとに小テストを作成でき、共通テストや難関大の英単語対策に登録不要ですぐ使えます。",
                testSectionTitle: "システム英単語（シス単）のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Chapterを選ぶだけで、誰でも無料でシス単の小テストが作れます。<br />
                        <strong>システム英単語</strong>を選択してテストを作成してください。
                    </p>
                ),
                featuresTitle: "システム英単語（シス単）の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        大学受験・共通テストで確実な点数を取るための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "Chapter・Stage別小テスト",
                    description: "システム英単語の目次通りの順番でテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレットに対応。通学中の電車やスキマ時間に、アプリ感覚でシス単を復習できます。"
                },
                extraContent: <SystemWordsStudyAppSection />,
                extraFaqs: [
                    {
                        question: "システム英単語を単語帳として確認できますか？",
                        answer: "はい。Chapter別の範囲を確認しながら、そのまま小テストに進めます。単語帳で覚えた範囲の確認や、学校の小テスト前の総復習に使えます。",
                    },
                    {
                        question: "システム英単語のChapter別テストは作れますか？",
                        answer: "はい。Chapter 1からChapter 5まで、範囲を指定して無料で小テストを作成できます。単語から意味、意味から単語の両方に対応しています。",
                    },
                ],
            }}
        />
    );
}

function SystemWordsStudyAppSection() {
    const chapters = [
        { label: 'Chapter 1', range: '1-600', href: '/mistap/textbook/system-words/1' },
        { label: 'Chapter 2', range: '601-1200', href: '/mistap/textbook/system-words/2' },
        { label: 'Chapter 3', range: '1201-1685', href: '/mistap/textbook/system-words/3' },
        { label: 'Chapter 4', range: '1686-2027', href: '/mistap/textbook/system-words/4' },
        { label: 'Chapter 5', range: '2028-2200', href: '/mistap/textbook/system-words/5' },
    ];

    return (
        <section className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
                    <div>
                        <p className="text-sm font-bold text-sky-600 mb-3">システム英単語 学習アプリとして使える</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-5">
                            単語帳で覚えるだけで終わらせず、<br className="hidden md:inline" />
                            Chapter別に確認テストまで進めます。
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Mistapでは、システム英単語の学習範囲を選んで、その場で小テストを作成できます。
                            「単語帳で確認する」「出題範囲を決める」「間違えた単語を復習する」流れを1つのページで完結できます。
                        </p>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {['範囲指定', '苦手単語復習', 'スマホ対応'].map((label) => (
                                <div key={label} className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-center text-sm font-bold text-sky-700">
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Chapter別に学習する</h3>
                        <div className="space-y-3">
                            {chapters.map((chapter) => (
                                <Link
                                    key={chapter.href}
                                    href={chapter.href}
                                    className="flex items-center justify-between gap-4 rounded-lg bg-white border border-slate-200 px-4 py-3 hover:border-sky-300 hover:text-sky-700 transition-colors"
                                >
                                    <span className="font-bold">{chapter.label}</span>
                                    <span className="text-sm text-slate-500">No. {chapter.range}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
