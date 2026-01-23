import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1900（Target 1900）英単語テスト｜大学受験・共通テスト 無料',
    description: '大学受験のバイブル「英単語ターゲット1900」対応の英単語テスト。Part/Sectionごとの頻出単語を無料でテストできます。共通テスト・難関大対策に最適。',
    keywords: [
        'ターゲット1900',
        '英単語ターゲット1900',
        'Target 1900',
        'ターゲット1900 テスト',
        '大学受験 英単語',
        '共通テスト 英単語',
        '旺文社 英単語',
        '英単語 アプリ 高校生',
        'ターゲット 練習',
        'ターゲット1900 一覧',
        'ターゲット1900 Section',
        'ターゲット1900 Part',
        'ターゲット1900 無料',
        '英単語 テスト 大学受験',
        '英単語 クイズ 高校生',
        '共通テスト 単語',
        '難関大 英単語'
    ],
    openGraph: {
        title: 'ターゲット1900 英単語テスト｜大学受験・無料',
        description: '大学受験の定番「英単語ターゲット1900」の単語テスト。Section別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1900',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1900 英単語テスト｜大学受験・無料',
        description: '大学受験の定番「英単語ターゲット1900」の単語テスト。Section別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1900'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Target1900Page() {
    return (
        <TextbookLPTemplate
            textbookName="Target 1900"
            textbookNameJa="英単語ターゲット1900"
            publisherName="旺文社"
            themeColor="blue"
            presetTextbook="ターゲット1900"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1900"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
        />
    );
}
