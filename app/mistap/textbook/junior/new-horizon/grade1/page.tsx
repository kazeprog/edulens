import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ニューホライズン 中1 英単語テスト（NEW HORIZON）Unit別・無料',
    description: '中学1年生の英語教科書「ニューホライズン（NEW HORIZON）」対応の英単語テスト。Unitごとの単語を無料でテストできます。定期テスト対策に最適。',
    keywords: [
        'ニューホライズン 中1',
        '中1 英単語 テスト',
        'NEW HORIZON 中1',
        'ニューホライズン 単語テスト 中1',
        'Unit 英単語 テスト',
        '中学1年生 英語 単語',
        '英単語 アプリ 無料',
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
        title: 'ニューホライズン 中1 英単語テスト（NEW HORIZON）｜無料・Unit別',
        description: '中学1年生の英語教科書ニューホライズンの単語テスト。Unit別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/new-horizon/grade1',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ニューホライズン 中1 英単語テスト（NEW HORIZON）｜無料・Unit別',
        description: '中学1年生の英語教科書ニューホライズンの単語テスト。Unit別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/new-horizon/grade1'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function NewHorizonGrade1Page() {
    return (
        <TextbookLPTemplate
            textbookName="NEW HORIZON"
            textbookNameJa="ニューホライズン"
            publisherName="東京書籍"
            themeColor="orange"
            presetTextbook="New Horizon"
            canonicalUrl="https://edulens.jp/mistap/textbook/new-horizon/grade1"
            unitLabel="Unit"
            initialGrade="中1"
        />
    );
}
