import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1400 英単語テスト｜共通テスト対策の単語を無料で小テスト',
    description: '英単語ターゲット1400対応の無料英単語テスト。Sectionごとに重要単語を確認でき、共通テストや中堅大対策の語彙定着に役立ちます。',
    keywords: [
        'ターゲット1400 単語テスト',
        '英単語ターゲット1400 単語テスト',
        'ターゲット1400 小テスト',
        'ターゲット1400 アプリ',
        '英単語ターゲット1400 アプリ',
        '大学受験 英単語 アプリ',
        'Target 1400',
        '大学受験 英単語',
        '共通テスト 英単語',
        'ターゲット1400 Section',
        'ターゲット1400 無料',
        '共通テスト 単語',
        '中堅大 英単語',
        '旺文社 ターゲット1400'
    ],
    openGraph: {
        title: 'ターゲット1400 英単語テスト｜共通テスト対策の単語を無料で小テスト',
        description: '英単語ターゲット1400の重要単語を、Sectionごとの無料小テストやアプリ感覚で復習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1400',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1400 英単語テスト｜共通テスト対策の単語を無料で小テスト',
        description: 'ターゲット1400の単語をSectionごとの小テストやアプリ感覚で復習できる無料英単語テストです。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1400'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Target1400Page() {
    return (
        <TextbookLPTemplate
            textbookName="Target 1400"
            textbookNameJa="英単語ターゲット1400"
            publisherName="旺文社"
            themeColor="green"
            presetTextbook="ターゲット1400"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1400"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-green-600 mb-4 tracking-normal">英単語ターゲット1400対応</span>
                        必須英単語を<br />
                        <span className="text-green-500">小テストで効率よく定着</span>
                    </h1>
                ),
                heroDescription: "共通テストや中堅大対策に使える「英単語ターゲット1400」対応の無料英単語テスト・学習アプリ感覚ページです。Sectionごとに重要単語を確認でき、登録不要ですぐ復習を始められます。",
                testSectionTitle: "ターゲット1400の英単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Sectionを選ぶだけで、誰でも無料でターゲット1400の小テストが作れます。<br />
                        <strong>英単語ターゲット1400</strong>を選択して英単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "ターゲット1400の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        大学受験・共通テストで確実な点数を取るための「英単語テスト作成サイト」です。アプリ感覚で反復しやすく作っています。
                    </p>
                ),
                feature1: {
                    title: "Section別小テスト",
                    description: "ターゲット1400のSection順でテストが可能。学校の小テスト対策から入試前の確認まで使えます。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、アプリ感覚でターゲットをマスターできます。"
                }
            }}
        />
    );
}
