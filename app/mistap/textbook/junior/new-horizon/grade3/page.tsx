import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ニューホライズン 中3 英単語テスト（NEW HORIZON）Unit別・無料',
    description: '中学3年生の英語教科書「ニューホライズン（NEW HORIZON）」対応の英単語テスト。Unitごとの単語を無料でテストできます。定期テスト・高校受験対策に最適。',
    keywords: [
        'ニューホライズン 中3',
        '中3 英単語 テスト',
        'NEW HORIZON 中3',
        'ニューホライズン 単語テスト 中3',
        'Unit 英単語 テスト',
        '中学3年生 英語 単語',
        '英単語 アプリ 無料',
        '高校受験 英単語',
        'ニューホライズン アプリ',
        'ニューホライズン 単語テスト アプリ',
        'ニューホライズン テスト アプリ',
        'ニューホライズン 小テスト',
        'ニューホライズン 小テスト アプリ',
        'ニューホライズン 小テスト メーカー',
        'ニューホライズン 小テスト ジェネレーター',
        'NEW HORIZON アプリ',
        'NEW HORIZON 単語テスト アプリ',
        'NEW HORIZON テスト アプリ',
        'NEW HORIZON 小テスト',
        'NEW HORIZON 小テスト アプリ',
        'NEW HORIZON 小テスト メーカー',
        'NEW HORIZON 小テスト ジェネレーター'
    ],
    openGraph: {
        title: 'ニューホライズン 中3 英単語テスト（NEW HORIZON）｜無料・Unit別',
        description: '中学3年生の英語教科書ニューホライズンの単語テスト。Unit別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/new-horizon/grade3',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ニューホライズン 中3 英単語テスト（NEW HORIZON）｜無料・Unit別',
        description: '中学3年生の英語教科書ニューホライズンの単語テスト。Unit別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/new-horizon/grade3'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function NewHorizonGrade3Page() {
    return (
        <TextbookLPTemplate
            textbookName="NEW HORIZON"
            textbookNameJa="ニューホライズン"
            publisherName="東京書籍"
            themeColor="orange"
            presetTextbook="New Horizon"
            canonicalUrl="https://edulens.jp/mistap/textbook/new-horizon/grade3"
            unitLabel="Unit"
            initialGrade="中3"
        />
    );
}
