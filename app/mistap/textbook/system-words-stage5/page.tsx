import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'システム英単語 Stage5 テスト｜無料小テストアプリ - Mistap',
    description: 'システム英単語（シス単）Stage5の多義語184語を無料で学習。範囲・問題数・回答方式を選んで多義語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
    keywords: [
        'システム英単語 Stage5',
        'シスタン 多義語',
        'システム英単語 多義語',
        'System English Word Stage5',
        'シス単 多義語 テスト',
        'システム英単語 Stage5 無料',
        '大学受験 多義語',
        '共通テスト 多義語',
        '英単語 多義語 テスト',
        'システム英単語 Stage5 アプリ',
        'システム英単語 Stage5 テスト アプリ',
        'システム英単語 Stage5 単語テスト',
        'システム英単語 Stage5 小テスト',
        'システム英単語 Stage5 小テスト アプリ',
        'システム英単語 Stage5 小テスト メーカー',
        'システム英単語 Stage5 小テスト ジェネレーター',
        'シス単 Stage5 アプリ',
        'シス単 Stage5 小テスト',
    ],
    openGraph: {
        title: 'システム英単語 Stage5 テスト｜無料小テストアプリ - Mistap',
        description: 'システム英単語（シス単）Stage5の多義語184語を無料で学習。範囲・問題数・回答方式を選んで多義語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
        url: 'https://edulens.jp/mistap/textbook/system-words-stage5',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'システム英単語 Stage5 テスト｜無料小テストアプリ - Mistap',
        description: 'システム英単語（シス単）Stage5の多義語184語を無料で学習。範囲・問題数・回答方式を選んで多義語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/system-words-stage5'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function SystemWordsStage5Page() {
    return (
        <TextbookLPTemplate
            textbookName="システム英単語 Stage5"
            textbookNameJa="システム英単語 Stage5"
            publisherName="駿台文庫"
            themeColor="sky"
            presetTextbook="システム英単語 Stage5"
            canonicalUrl="https://edulens.jp/mistap/textbook/system-words-stage5"
            unitLabel="番号"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">システム英単語 Stage5 多義語テスト</span>
                        多義語の裏の意味を<br />
                        <span className="text-sky-500">多義語テストで定着確認</span>
                    </h1>
                ),
                heroDescription: "システム英単語（シス単）Stage5の多義語184語を無料でテストできるページ。知っている単語でも見落としやすい別の意味を、共通テスト・難関大対策として確認できます。",
                testSectionTitle: "システム英単語 Stage5 多義語テストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。番号を選ぶだけで、誰でも無料でシス単多義語の小テストが作れます。<br />
                        <strong>システム英単語 Stage5</strong>を選択してテストを作成してください。
                    </p>
                ),
                featuresTitle: "多義語を制する者が入試を制す",
                featuresDescription: (
                    <p>
                        Stage5は、知っているつもりの単語の「もう一つの意味」を集中的に学べます。<br className="hidden md:inline" />
                        大学受験・共通テストで確実な点数を取るための「多義語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "184語の多義語を範囲別に確認",
                    description: "runは「走る」だけじゃない。「経営する」という意味も出題される。そんな裏の意味を集中的にテストできます。"
                },
                feature2: {
                    title: "苦手な多義語を自動でリスト化",
                    description: "間違えた多義語は自動的に保存。あなただけの「苦手な多義語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "スマホで手軽に復習",
                    description: "スマホ・タブレットに対応。通学中の電車やスキマ時間に、ブラウザで多義語の確認テストを進められます。"
                }
            }}
        />
    );
}
