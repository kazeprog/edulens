import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ニューホライズン 中2 英単語テスト（NEW HORIZON）Unit別・無料',
    description: '中学2年生の英語教科書「ニューホライズン（NEW HORIZON）」対応の英単語テスト。Unitごとの単語を無料でテストできます。定期テスト対策に最適。',
    keywords: [
        'ニューホライズン 中2',
        '中2 英単語 テスト',
        'NEW HORIZON 中2',
        'ニューホライズン 単語テスト 中2',
        'Unit 英単語 テスト',
        '中学2年生 英語 単語',
        '英単語 アプリ 無料'
    ],
    openGraph: {
        title: 'ニューホライズン 中2 英単語テスト（NEW HORIZON）｜無料・Unit別',
        description: '中学2年生の英語教科書ニューホライズンの単語テスト。Unit別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/new-horizon/grade2',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ニューホライズン 中2 英単語テスト（NEW HORIZON）｜無料・Unit別',
        description: '中学2年生の英語教科書ニューホライズンの単語テスト。Unit別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/new-horizon/grade2'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function NewHorizonGrade2Page() {
    return (
        <TextbookLPTemplate
            textbookName="NEW HORIZON"
            textbookNameJa="ニューホライズン"
            publisherName="東京書籍"
            themeColor="orange"
            presetTextbook="New Horizon"
            canonicalUrl="https://edulens.jp/mistap/textbook/new-horizon/grade2"
            unitLabel="Unit"
            initialGrade="中2"
        />
    );
}
