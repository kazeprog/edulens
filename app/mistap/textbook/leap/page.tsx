import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'LEAP（リープ）英単語テスト｜大学受験・共通テスト 無料',
    description: '4技能対応英単語帳「LEAP」対応の英単語テスト。Part/Sectionごとの頻出単語を無料でテストできます。竹岡広信先生監修の単語学習に最適。',
    keywords: [
        'LEAP 英単語',
        'リープ 英単語',
        '竹岡広信 英単語',
        'LEAP 単語テスト',
        '数研出版 英単語',
        'LEAP Basic',
        '大学受験 英単語',
        '共通テスト 英単語',
        '英単語 アプリ 高校生',
        'LEAP 一覧',
        'LEAP Part',
        'LEAP 無料 テスト',
        '難関大 英単語'
    ],
    openGraph: {
        title: 'LEAP（リープ）英単語テスト｜大学受験・無料',
        description: '4技能対応英単語帳「LEAP」の単語テスト。Part別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/leap',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LEAP（リープ）英単語テスト｜大学受験・無料',
        description: '4技能対応英単語帳「LEAP」の単語テスト。Part別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/leap'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function LeapPage() {
    return (
        <TextbookLPTemplate
            textbookName="LEAP"
            textbookNameJa="LEAP"
            publisherName="数研出版"
            themeColor="sky"
            presetTextbook="LEAP"
            canonicalUrl="https://edulens.jp/mistap/textbook/leap"
            unitLabel="Part"
            audience="senior"
            bookType="wordbook"
        />
    );
}
