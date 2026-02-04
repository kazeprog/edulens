import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'DUO 3.0（デュオ）英単語テスト｜大学受験・ビジネス英語 無料',
    description: '現代英語の重要単語・熟語を網羅した「DUO 3.0」対応の英単語テスト。Sectionごとの例文頻出単語を無料でテストできます。',
    keywords: [
        'DUO 3.0',
        'DUO3.0',
        'デュオ 3.0',
        'DUO 単語テスト',
        'DUO 例文',
        '大学受験 英単語',
        'ビジネス英語 単語',
        'TOEIC 単語',
        '英単語 アプリ 社会人',
        'DUO 3.0 無料',
        'DUO 3.0 Section',
        'DUO 3.0 一覧',
        '英単語 テスト 作成',
        '英単語 テスト 無料',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: 'DUO 3.0（デュオ）英単語テスト｜大学受験・ビジネス英語',
        description: '現代英語の重要単語・熟語「DUO 3.0」の単語テスト。Section別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/duo-30',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DUO 3.0（デュオ）英単語テスト｜大学受験・ビジネス英語',
        description: '現代英語の重要単語・熟語「DUO 3.0」の単語テスト。Section別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/duo-30'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Duo30Page() {
    return (
        <TextbookLPTemplate
            textbookName="DUO 3.0"
            textbookNameJa="DUO 3.0"
            publisherName="アイシーピー"
            themeColor="blue"
            presetTextbook="DUO 3.0例文"
            canonicalUrl="https://edulens.jp/mistap/textbook/duo-30"
            unitLabel="Section"
            audience="general"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">DUO 3.0（デュオ）テスト完全対応</span>
                        重要単語・熟語を<br />
                        <span className="text-blue-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "現代英語の重要単語1600+熟語1000を凝縮した「DUO 3.0」の無料テスト・クイズアプリ（サイト）。Sectionごとに小テストを作成でき、例文を通じて効率的に語彙をマスターできます。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "DUO 3.0のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Sectionを選ぶだけで、誰でも無料でDUO 3.0の小テストが作れます。<br />
                        <strong>DUO 3.0例文</strong>を選択してテストを作成してください。
                    </p>
                ),
                featuresTitle: "DUO 3.0の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        560本の例文で重複なしに単語・熟語を覚えるDUO 3.0の学習効果を、さらに高めるための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "Section別小テスト",
                    description: "DUO 3.0のSection通りの順番でテストが可能。1つのSectionに含まれる単語・熟語をまとめて確認できます。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通勤・通学中の電車やスキマ時間に、ゲーム感覚でDUOをマスターできます。"
                }
            }}
        />
    );
}
