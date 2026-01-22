import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const metadata: Metadata = {
    title: '古文単語325（ベストセレクション/マドンナ）対応テスト｜大学受験 無料',
    description: '「ベストセレクション 古文単語325」対応の古文単語テスト。人気講師監修の単語帳の内容を無料でテストできます。共通テスト・大学受験の古文対策に。',
    keywords: [
        '古文単語325',
        'ベストセレクション',
        'マドンナ古文',
        'いいずな書店 古文',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '古文単語325 無料',
        '古文単語325 一覧',
        '古文単語 クイズ'
    ],
    openGraph: {
        title: '古文単語325（ベストセレクション）対応テスト｜大学受験・無料',
        description: '「ベストセレクション 古文単語325」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/kobun-325',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '古文単語325（ベストセレクション）対応テスト｜大学受験・無料',
        description: '「ベストセレクション 古文単語325」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/kobun-325'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Kobun325Page() {
    return (
        <TextbookLPTemplate
            textbookName="Best Selection 325"
            textbookNameJa="ベストセレクション 古文単語325"
            publisherName="いいずな書店"
            themeColor="emerald"
            presetTextbook="ベストセレクション古文単語325"
            canonicalUrl="https://edulens.jp/mistap/textbook/kobun-325"
            unitLabel="章"
            audience="senior"
            bookType="wordbook"
        />
    );
}
