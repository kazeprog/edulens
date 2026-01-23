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
        'DUO 3.0 一覧'
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
        />
    );
}
