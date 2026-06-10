import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'New Horizon テスト｜無料小テストアプリ - Mistap',
    description: 'ニューホライズン（NEW HORIZON）の英単語を無料で学習。学年・Unit・問題数・回答方式を選んで小テストを開始し、苦手単語、学習履歴、正答率まで確認できます。',
    keywords: [
        'ニューホライズン 英単語',
        'ニューホライズン 単語テスト',
        'NEW HORIZON 英単語',
        'NEW HORIZON 単語一覧',
        'NEW HORIZON 英単語 テスト',
        'Unit 英単語 テスト',
        '中1 英単語 テスト',
        '中2 英単語 テスト',
        '中3 英単語 テスト',
        '中学 英単語 クイズ',
        '英単語 暗記 中学生',
        '定期テスト 英語 単語',
        '高校受験 英単語 基礎',
        '英語 教科書 単語',
        '東京書籍 英語 単語',
        '英単語 アプリ 中学生',
        '英単語 テスト 無料',
        'ニューホライズン アプリ',
        'ニューホライズン 単語テスト アプリ',
        'ニューホライズン テスト アプリ',
        'ニューホライズン 小テスト',
        'ニューホライズン 小テスト アプリ',
        'ニューホライズン 小テスト メーカー',
        'ニューホライズン 小テスト ジェネレーター',
        'NEW HORIZON アプリ',
        'NEW HORIZON 単語テスト アプリ',
        'NEW HORIZON テスト アプリ',
        'NEW HORIZON 小テスト',
        'NEW HORIZON 小テスト アプリ',
        'NEW HORIZON 小テスト メーカー',
        'NEW HORIZON 小テスト ジェネレーター'
    ],
    openGraph: {
        title: 'New Horizon テスト｜無料小テストアプリ - Mistap',
        description: 'ニューホライズン（NEW HORIZON）の英単語を無料で学習。学年・Unit・問題数・回答方式を選んで小テストを開始し、苦手単語、学習履歴、正答率まで確認できます。',
        url: 'https://edulens.jp/mistap/textbook/new-horizon',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'New Horizon テスト｜無料小テストアプリ - Mistap',
        description: 'ニューホライズン（NEW HORIZON）の英単語を無料で学習。学年・Unit・問題数・回答方式を選んで小テストを開始し、苦手単語、学習履歴、正答率まで確認できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/new-horizon'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function NewHorizonPage() {
    return (
        <TextbookLPTemplate
            textbookName="NEW HORIZON"
            textbookNameJa="ニューホライズン"
            publisherName="東京書籍"
            themeColor="orange"
            presetTextbook="New Horizon"
            canonicalUrl="https://edulens.jp/mistap/textbook/new-horizon"
            unitLabel="Unit"
        />
    );
}
