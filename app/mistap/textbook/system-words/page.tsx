import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'システム英単語（シスタン）英単語テスト｜大学受験・共通テスト 無料',
    description: '大学受験対策の決定版「システム英単語（シスタン）」対応の英単語テスト。Chapter/Stageごとの頻出単語を無料でテストできます。共通テスト・難関大対策に最適。',
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
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: 'システム英単語（シスタン）英単語テスト｜大学受験・無料',
        description: '大学受験必須の英単語帳「システム英単語」の単語テスト。Chapter別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/system-words',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'システム英単語（シスタン）英単語テスト｜大学受験・無料',
        description: '大学受験必須の英単語帳「システム英単語」の単語テスト。Chapter別に無料で練習できます。',
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
                        <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">システム英単語（シス単）テスト完全対応</span>
                        収録英単語を<br />
                        <span className="text-sky-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "大学受験のバイブル「システム英単語（シス単）」の無料テスト・クイズアプリ（サイト）。Chapter/Stageごとに小テストを作成でき、共通テストや難関大の英単語対策に最適です。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "システム英単語（シス単）のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Chapterを選ぶだけで、誰でも無料でシス単の小テストが作れます。<br />
                        選択肢から「教科書テスト」を選んで、<strong>システム英単語</strong>を選択してください。
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
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、ゲーム感覚でシス単をマスターできます。"
                }
            }}
        />
    );
}
