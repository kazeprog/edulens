import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ニュークラウン（NEW CROWN）英単語テスト｜中1・中2・中3 教科書対応 無料',
    description: '中学英語教科書「ニュークラウン（NEW CROWN）」対応の英単語テスト。中1・中2・中3のLesson別単語を無料で確認できます。定期テスト対策・高校受験対策に最適。',
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
        '英単語 テスト 無料'
    ],
    openGraph: {
        title: 'ニュークラウン（NEW CROWN）英単語テスト｜中1〜中3 教科書対応',
        description: '中学英語教科書ニュークラウンの単語テスト。Lesson別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/new-crown',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ニュークラウン（NEW CROWN）英単語テスト｜中1〜中3 教科書対応',
        description: '中学英語教科書ニュークラウンの単語テスト。Lesson別に無料で練習できます。',
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
