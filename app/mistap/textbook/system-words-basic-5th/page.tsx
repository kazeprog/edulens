import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: 'システム英単語Basic〈5訂版〉テスト｜無料小テストアプリ - Mistap',
    description: 'システム英単語Basic〈5訂版〉を無料で学習。範囲・問題数・回答方式を選んで小テストを開始し、単語帳確認、苦手単語、学習履歴、正答率まで確認できます。',
    keywords: [
        'システム英単語Basic〈5訂版〉',
        'システム英単語Basic',
        'システム英単語 Basic',
        'システム英単語Basic 5訂版',
        'シス単Basic',
        'シス単 Basic',
        'シスタンベーシック',
        'System English Word Basic',
        'システム英単語Basic アプリ',
        'システム英単語Basic テスト アプリ',
        'システム英単語Basic 単語テスト',
        'システム英単語Basic 単語テスト アプリ',
        'システム英単語Basic 小テスト',
        'システム英単語Basic 小テスト アプリ',
        'システム英単語Basic 小テスト メーカー',
        'システム英単語Basic 小テスト ジェネレーター',
        '高校英語 基礎 単語テスト',
        '大学受験 英単語 基礎',
        '英単語 テスト 無料',
    ],
    openGraph: {
        title: 'システム英単語Basic〈5訂版〉テスト｜無料小テストアプリ - Mistap',
        description: 'システム英単語Basic〈5訂版〉を無料で学習。範囲・問題数・回答方式を選んで小テストを開始し、単語帳確認、苦手単語、学習履歴、正答率まで確認できます。',
        url: 'https://edulens.jp/mistap/textbook/system-words-basic-5th',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'システム英単語Basic〈5訂版〉テスト｜無料小テストアプリ - Mistap',
        description: 'システム英単語Basic〈5訂版〉を無料で学習。範囲・問題数・回答方式を選んで小テストを開始し、単語帳確認、苦手単語、学習履歴、正答率まで確認できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/system-words-basic-5th'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function SystemWordsBasic5thPage() {
    return (
        <TextbookLPTemplate
            textbookName="システム英単語Basic〈5訂版〉"
            textbookNameJa="システム英単語Basic〈5訂版〉"
            publisherName="駿台文庫"
            themeColor="emerald"
            presetTextbook="システム英単語Basic〈5訂版〉"
            canonicalUrl="https://edulens.jp/mistap/textbook/system-words-basic-5th"
            unitLabel="番号"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-emerald-600 mb-4 tracking-normal">システム英単語Basic〈5訂版〉に対応</span>
                        高校英語の基礎を<br />
                        <span className="text-emerald-500">小テストで確実に定着</span>
                    </h1>
                ),
                heroDescription: "システム英単語Basic〈5訂版〉の無料テスト・クイズアプリ。番号範囲を指定して小テストを作成できるので、高校英語の土台固めや共通テスト前の基礎確認をテンポよく進められます。",
                testSectionTitle: "システム英単語Basic〈5訂版〉のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        会員登録なしで、必要な番号範囲だけすぐにテスト化できます。<br />
                        <strong>システム英単語Basic〈5訂版〉</strong> を選んで、基礎語彙を着実に固めてください。
                    </p>
                ),
                featuresTitle: "シス単Basicで受験英語の土台を作る",
                featuresDescription: (
                    <p>
                        Mistapなら、単語帳を眺めるだけで終わらず、<br className="hidden md:inline" />
                        システム英単語Basic〈5訂版〉の語彙をテスト形式で反復できます。
                    </p>
                ),
                feature1: {
                    title: "番号範囲で細かく確認",
                    description: "1-100、101-200のように区切って出題可能。学校の進度や自分の復習計画に合わせて無理なく回せます。"
                },
                feature2: {
                    title: "基礎語彙の抜けを見つける",
                    description: "間違えた単語は自動で蓄積。覚えたつもりの基本語を、あとから重点的に復習できます。"
                },
                feature3: {
                    title: "スマホで短時間復習",
                    description: "通学中や寝る前の数分でも扱いやすい設計。毎日の小さな確認を続けやすくします。"
                }
            }}
        />
    );
}
