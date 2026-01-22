import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const metadata: Metadata = {
    title: 'TOEIC L&R 金のフレーズ（金フレ）英単語テスト｜TOEIC対策 無料',
    description: 'TOEIC対策のバイブル「出る単特急 金のフレーズ（金フレ）」対応の英単語テスト。スコアレベル別の頻出単語を無料でテストできます。',
    keywords: [
        '金のフレーズ',
        '金フレ',
        'TOEIC 単語',
        '金のフレーズ テスト',
        '金フレ アプリ',
        'TOEIC 頻出単語',
        'TEX加藤',
        '朝日新聞出版',
        'TOEIC 無料 アプリ',
        '金フレ 一覧',
        '金フレ 無料',
        'ビジネス英語'
    ],
    openGraph: {
        title: 'TOEIC L&R 金のフレーズ（金フレ）英単語テスト｜TOEIC対策',
        description: 'TOEIC対策の決定版「金のフレーズ（金フレ）」の単語テスト。レベル別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/toeic-gold',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TOEIC L&R 金のフレーズ（金フレ）英単語テスト｜TOEIC対策',
        description: 'TOEIC対策の決定版「金のフレーズ（金フレ）」の単語テスト。レベル別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/toeic-gold'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function ToeicGoldPage() {
    return (
        <TextbookLPTemplate
            textbookName="金のフレーズ"
            textbookNameJa="TOEIC L&R 金のフレーズ"
            publisherName="朝日新聞出版"
            themeColor="orange"
            presetTextbook="TOEIC金のフレーズ"
            canonicalUrl="https://edulens.jp/mistap/textbook/toeic-gold"
            unitLabel="Level"
            audience="general"
            bookType="wordbook"
        />
    );
}
