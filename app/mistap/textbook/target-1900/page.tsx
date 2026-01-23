import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1900（Target 1900）英単語テスト｜大学受験・共通テスト 無料',
    description: '大学受験のバイブル「英単語ターゲット1900」対応の英単語テスト。Part/Sectionごとの頻出単語を無料でテストできます。共通テスト・難関大対策に最適。',
    keywords: [
        'ターゲット1900',
        '英単語ターゲット1900',
        'Target 1900',
        'ターゲット1900 テスト',
        '大学受験 英単語',
        '共通テスト 英単語',
        '旺文社 英単語',
        '英単語 アプリ 高校生',
        'ターゲット 練習',
        'ターゲット1900 一覧',
        'ターゲット1900 Section',
        'ターゲット1900 Part',
        'ターゲット1900 無料',
        '英単語 テスト 大学受験',
        '英単語 クイズ 高校生',
        '共通テスト 単語',
        '難関大 英単語',
        '英単語 テスト 作成',
        '英単語 テスト 無料',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: 'ターゲット1900 英単語テスト｜大学受験・無料',
        description: '大学受験の定番「英単語ターゲット1900」の単語テスト。Section別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1900',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1900 英単語テスト｜大学受験・無料',
        description: '大学受験の定番「英単語ターゲット1900」の単語テスト。Section別に無料で練習できます。',
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
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">ターゲット1900（Target1900）テスト完全対応</span>
                        頻出英単語を<br />
                        <span className="text-blue-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "大学受験の定番「英単語ターゲット1900」の無料テスト・クイズアプリ（サイト）。Part/Sectionごとに小テストを作成でき、共通テストや難関大の英単語対策に最適です。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "ターゲット1900のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。PartやSectionを選ぶだけで、誰でも無料でターゲット1900の小テストが作れます。<br />
                        選択肢から「教科書テスト」を選んで、<strong>英単語ターゲット1900</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "ターゲット1900の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        大学受験・共通テストで確実な点数を取るための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "Part・Section別小テスト",
                    description: "ターゲット1900の目次通りの順番でテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
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
