import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1400（Target 1400）英単語テスト｜大学受験・共通テスト 無料',
    description: '旺文社「英単語ターゲット1400」の無料テスト・暗記カード。セクション・パートごとに小テストを作成でき、間違えた単語は自動でリスト化。共通テストや大学受験の英単語を効率よくマスターできる学習ツールです。',
    keywords: [
        'ターゲット1400',
        '英単語ターゲット1400',
        'Target 1400',
        'ターゲット1400 テスト',
        '大学受験 英単語',
        '共通テスト 英単語',
        '旺文社 英単語',
        '英単語 アプリ 高校生',
        'ターゲット 練習',
        'ターゲット1400 一覧',
        'ターゲット1400 Section',
        'ターゲット1400 Part',
        'ターゲット1400 無料',
        '英単語 テスト 大学受験',
        '単語カード',
        '共通テスト 単語',
        '中堅大 英単語',
        '英単語 テスト 作成',
        '英単語 テスト 無料',
        'ターゲット1400 アプリ',
        'ターゲット1400 テスト アプリ',
        'ターゲット1400 単語テスト',
        'ターゲット1400 単語テスト アプリ',
        'ターゲット1400 小テスト',
        'ターゲット1400 小テスト アプリ',
        'ターゲット1400 小テスト メーカー',
        'ターゲット1400 小テスト ジェネレーター',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: 'ターゲット1400 英単語テスト｜大学受験・無料',
        description: '大学受験の必須単語「英単語ターゲット1400」の単語テスト。Section別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1400',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1400 英単語テスト｜大学受験・無料',
        description: '大学受験の必須単語「英単語ターゲット1400」の単語テスト。Section別に無料で練習できます。',
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
                        <span className="block text-xl md:text-2xl font-bold text-green-600 mb-4 tracking-normal">ターゲット1400（Target1400）テスト完全対応</span>
                        必須英単語を<br />
                        <span className="text-green-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "大学受験の必須単語「英単語ターゲット1400」の無料テスト・単語カード形式アプリ（サイト）。Part/Sectionごとに小テストを作成でき、共通テストや中堅大の英単語対策に最適です。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "ターゲット1400のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。PartやSectionを選ぶだけで、誰でも無料でターゲット1400の小テストが作れます。<br />
                        <strong>英単語ターゲット1400</strong>を選択してテストを作成してください。
                    </p>
                ),
                featuresTitle: "ターゲット1400の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        大学受験・共通テストで確実な点数を取るための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "Part・Section別小テスト",
                    description: "ターゲット1400の目次通りの順番でテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、ゲーム感覚でターゲットをマスターできます。"
                }
            }}
        />
    );
}
