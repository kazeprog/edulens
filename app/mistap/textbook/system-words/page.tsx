import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'システム英単語（System English Word）英単語テスト｜大学受験・共通テスト 無料',
    description: '大学受験対策の決定版「システム英単語（シスタン）」対応の英単語テスト。Chapter/Stageごとの頻出単語を無料でテストできます。共通テスト・難関大対策に最適。',
    keywords: [
        'システム英単語',
        'シスタン',
        'System English Word',
        'シス単 テスト',
        'システム英単語 無料',
        '大学受験 英単語',
        '共通テスト 英単語',
        '駿台文庫 英単語',
        '英単語 アプリ 高校生',
        'システム英単語 一覧',
        'システム英単語 Chapter',
        'システム英単語 Stage',
        'シスタン 単語テスト',
        'シス単 一覧 無料',
        '英単語 テスト 大学受験',
        '英単語 クイズ 高校生',
        '共通テスト 単語',
        '難関大 英単語'
    ],
    openGraph: {
        title: 'システム英単語（シスタン）英単語テスト｜大学受験・無料',
        description: '大学受験必須の英単語帳「システム英単語」の単語テスト。Chapter別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/system-words',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'システム英単語（シスタン）英単語テスト｜大学受験・無料',
        description: '大学受験必須の英単語帳「システム英単語」の単語テスト。Chapter別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/system-words'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function SystemWordsPage() {
    return (
        <TextbookLPTemplate
            textbookName="System English Word"
            textbookNameJa="システム英単語"
            publisherName="駿台文庫"
            themeColor="sky"
            presetTextbook="システム英単語"
            canonicalUrl="https://edulens.jp/mistap/textbook/system-words"
            unitLabel="Chapter"
            audience="senior"
            bookType="wordbook"
        />
    );
}
