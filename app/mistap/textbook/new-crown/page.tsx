import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'New Crown テスト｜無料小テストアプリ - Mistap',
    description: 'ニュークラウン（NEW CROWN）の英単語を無料で学習。学年・Lesson・問題数・回答方式を選んで小テストを開始し、苦手単語、学習履歴、正答率まで確認できます。',
    keywords: [
        'ニュークラウン 英単語',
        'ニュークラウン 単語テスト',
        'NEW CROWN 英単語',
        'NEW CROWN 単語一覧',
        'NEW CROWN 英単語 テスト',
        'Lesson 英単語 テスト',
        '中1 英単語 テスト',
        '中2 英単語 テスト',
        '中3 英単語 テスト',
        '中学 英単語 クイズ',
        '英単語 暗記 中学生',
        '定期テスト 英語 単語',
        '高校受験 英単語 基礎',
        '英語 教科書 単語',
        '三省堂 英語 単語',
        '英単語 アプリ 中学生',
        '英単語 テスト 無料',
        'ニュークラウン アプリ',
        'ニュークラウン 単語テスト アプリ',
        'ニュークラウン テスト アプリ',
        'ニュークラウン 小テスト',
        'ニュークラウン 小テスト アプリ',
        'ニュークラウン 小テスト メーカー',
        'ニュークラウン 小テスト ジェネレーター',
        'NEW CROWN アプリ',
        'NEW CROWN 単語テスト アプリ',
        'NEW CROWN テスト アプリ',
        'NEW CROWN 小テスト',
        'NEW CROWN 小テスト アプリ',
        'NEW CROWN 小テスト メーカー',
        'NEW CROWN 小テスト ジェネレーター'
    ],
    openGraph: {
        title: 'New Crown テスト｜無料小テストアプリ - Mistap',
        description: 'ニュークラウン（NEW CROWN）の英単語を無料で学習。学年・Lesson・問題数・回答方式を選んで小テストを開始し、苦手単語、学習履歴、正答率まで確認できます。',
        url: 'https://edulens.jp/mistap/textbook/new-crown',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'New Crown テスト｜無料小テストアプリ - Mistap',
        description: 'ニュークラウン（NEW CROWN）の英単語を無料で学習。学年・Lesson・問題数・回答方式を選んで小テストを開始し、苦手単語、学習履歴、正答率まで確認できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/new-crown'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function NewCrownPage() {
    return (
        <TextbookLPTemplate
            textbookName="NEW CROWN"
            textbookNameJa="ニュークラウン"
            publisherName="三省堂"
            themeColor="blue"
            presetTextbook="New Crown"
            canonicalUrl="https://edulens.jp/mistap/textbook/new-crown"
            unitLabel="Lesson"
        />
    );
}
