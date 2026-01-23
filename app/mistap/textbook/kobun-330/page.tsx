import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '古文単語330（Key & Point）対応テスト｜大学受験 無料',
    description: '「Key & Point 古文単語330」対応の古文単語テスト。キーポイントで覚える単語帳の内容を無料でテストできます。共通テスト・大学受験の古文対策に。',
    keywords: [
        '古文単語330',
        'Key & Point',
        'キーアンドポイント',
        '尚文出版 古文',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '古文単語330 無料',
        '古文単語330 一覧',
        '古文単語 クイズ'
    ],
    openGraph: {
        title: '古文単語330（Key & Point）対応テスト｜大学受験・無料',
        description: '「Key & Point 古文単語330」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/kobun-330',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '古文単語330（Key & Point）対応テスト｜大学受験・無料',
        description: '「Key & Point 古文単語330」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/kobun-330'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Kobun330Page() {
    return (
        <TextbookLPTemplate
            textbookName="Key & Point 330"
            textbookNameJa="Key & Point 古文単語330"
            publisherName="尚文出版"
            themeColor="sky"
            presetTextbook="Key&Point古文単語330"
            canonicalUrl="https://edulens.jp/mistap/textbook/kobun-330"
            unitLabel="章"
            audience="senior"
            bookType="wordbook"
        />
    );
}
