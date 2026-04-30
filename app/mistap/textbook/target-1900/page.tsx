import type { Metadata } from 'next';
import Link from 'next/link';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1900 テスト｜無料小テストアプリ - Mistap',
    description: '英単語ターゲット1900対応の無料テストページ。Sectionや番号範囲を指定して小テストを作成でき、プリント代わりの確認テストや大学受験前の反復に使えます。',
    keywords: [
        'ターゲット1900 テスト',
        'ターゲット1900 単語テスト',
        '英単語ターゲット1900 単語テスト',
        'ターゲット1900 小テスト',
        'ターゲット1900 テスト 無料',
        'ターゲット1900 テストプリント 無料',
        'ターゲット1900 確認テスト',
        'ターゲット1900 アプリ',
        'ターゲット1900 アプリ 無料',
        '大学受験 英単語 アプリ',
        'Target 1900',
        '大学受験 英単語',
        '共通テスト 英単語',
        'ターゲット1900 Section',
        'ターゲット1900 無料',
        '共通テスト 単語',
        '難関大 英単語',
        '旺文社 ターゲット1900'
    ],
    openGraph: {
        title: 'ターゲット1900 テスト｜無料小テストアプリ - Mistap',
        description: '英単語ターゲット1900の重要単語を、Sectionや番号範囲ごとの無料小テストで復習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1900',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1900 テスト｜無料小テストアプリ - Mistap',
        description: 'ターゲット1900の単語をSectionや番号範囲ごとの小テストで復習できる無料ページです。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1900'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Target1900Page() {
    return (
        <TextbookLPTemplate
            textbookName="Target 1900"
            textbookNameJa="英単語ターゲット1900"
            publisherName="旺文社"
            themeColor="blue"
            presetTextbook="ターゲット1900"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1900"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">英単語ターゲット1900対応の無料テスト</span>
                        Section別・範囲指定で<br />
                        <span className="text-blue-500">小テストをすぐ作成</span>
                    </h1>
                ),
                heroDescription: "大学受験の定番「英単語ターゲット1900」対応の無料テストページです。Sectionや番号範囲を指定して、学校の小テスト対策、プリント代わりの確認、入試前の総復習まで登録不要ですぐ始められます。",
                heroSecondaryCta: (
                    <Link
                        href="/mistap/textbook/target-1900/print"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 border-2 border-blue-200 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        テストプリント代わりに使う
                    </Link>
                ),
                testSectionTitle: "ターゲット1900のテストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Sectionや番号範囲を選ぶだけで、誰でも無料でターゲット1900の小テストが作れます。<br />
                        <strong>英単語ターゲット1900</strong>を選択して、確認テストを始めてください。
                    </p>
                ),
                featuresTitle: "ターゲット1900のテスト対策を回しやすくする",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        ターゲット1900を「読むだけ」で終わらせず、無料の小テストとして反復できる英単語テスト作成サイトです。
                    </p>
                ),
                feature1: {
                    title: "Section別・範囲指定テスト",
                    description: "ターゲット1900のSection順や番号範囲でテストが可能。学校の小テスト対策から入試前の総確認まで使えます。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、アプリ感覚でターゲットをマスターできます。"
                },
                extraFaqs: [
                    {
                        question: "ターゲット1900のテストプリント代わりに使えますか？",
                        answer: "はい、Sectionや番号範囲を指定して小テストを作れるため、学校の確認テストや自習用プリントの代わりとして使えます。ブラウザ上でそのまま解けるので、スマホでもPCでもすぐ復習できます。",
                    },
                    {
                        question: "ターゲット1900を番号範囲で指定できますか？",
                        answer: "はい、1-100、101-200のように範囲を区切って出題できます。授業や自分の進度に合わせて、必要な範囲だけを反復できます。",
                    },
                ],
            }}
        />
    );
}
