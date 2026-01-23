import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1200（Target 1200）英単語テスト｜高校基礎・共通テスト 無料',
    description: '高校英語の基礎固め「英単語ターゲット1200」対応の英単語テスト。Part/Sectionごとの頻出単語を無料でテストできます。高校入学〜共通テスト対策に最適。',
    keywords: [
        'ターゲット1200',
        '英単語ターゲット1200',
        'Target 1200',
        'ターゲット1200 テスト',
        '高校基礎 英単語',
        '共通テスト 英単語',
        '旺文社 英単語',
        '英単語 アプリ 高校生',
        'ターゲット 練習',
        'ターゲット1200 一覧',
        'ターゲット1200 Section',
        'ターゲット1200 Part',
        'ターゲット1200 無料',
        '英単語 テスト 高校1年生',
        '英単語 クイズ 基礎'
    ],
    openGraph: {
        title: 'ターゲット1200 英単語テスト｜高校基礎・無料',
        description: '高校基礎の定番「英単語ターゲット1200」の単語テスト。Section別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1200',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1200 英単語テスト｜高校基礎・無料',
        description: '高校基礎の定番「英単語ターゲット1200」の単語テスト。Section別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1200'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Target1200Page() {
    return (
        <TextbookLPTemplate
            textbookName="Target 1200"
            textbookNameJa="英単語ターゲット1200"
            publisherName="旺文社"
            themeColor="emerald"
            presetTextbook="ターゲット1200"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1200"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
        />
    );
}
