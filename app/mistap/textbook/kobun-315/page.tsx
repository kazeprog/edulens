import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '重要古文単語315（読んで見て聞いて覚える）対応テスト｜大学受験 無料',
    description: '「重要古文単語315」対応の古文単語テスト。イラスト付で人気の単語帳の内容を無料でテストできます。共通テスト・大学受験の古文対策に。',
    keywords: [
        '重要古文単語315',
        '古文単語 315',
        '読んで見て聞いて覚える',
        '桐原書店 古文',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '重要古文単語315 無料',
        '重要古文単語315 一覧',
        '古文単語 クイズ'
    ],
    openGraph: {
        title: '重要古文単語315 対応テスト｜大学受験・無料',
        description: '「重要古文単語315」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/kobun-315',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '重要古文単語315 対応テスト｜大学受験・無料',
        description: '「重要古文単語315」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/kobun-315'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Kobun315Page() {
    return (
        <TextbookLPTemplate
            textbookName="重要古文単語315"
            textbookNameJa="重要古文単語315"
            publisherName="桐原書店"
            themeColor="orange"
            presetTextbook="読んで見て聞いて覚える 重要古文単語315"
            canonicalUrl="https://edulens.jp/mistap/textbook/kobun-315"
            unitLabel="章"
            audience="senior"
            bookType="wordbook"
        />
    );
}
