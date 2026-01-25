import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ニュークラウン 中1 英単語テスト（NEW CROWN）Lesson別・無料',
    description: '中学1年生の英語教科書「ニュークラウン（NEW CROWN）」対応の英単語テスト。Lessonごとの単語を無料でテストできます。定期テスト対策に最適。',
    keywords: [
        'ニュークラウン 中1',
        '中1 英単語 テスト',
        'NEW CROWN 中1',
        'ニュークラウン 単語テスト 中1',
        'Lesson 英単語 テスト',
        '中学1年生 英語 単語',
        '英単語 アプリ 無料'
    ],
    openGraph: {
        title: 'ニュークラウン 中1 英単語テスト（NEW CROWN）｜無料・Unit別',
        description: '中学1年生の英語教科書ニュークラウンの単語テスト。Lesson別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/new-crown/grade1',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ニュークラウン 中1 英単語テスト（NEW CROWN）｜無料・Unit別',
        description: '中学1年生の英語教科書ニュークラウンの単語テスト。Lesson別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/new-crown/grade1'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function NewCrownGrade1Page() {
    return (
        <TextbookLPTemplate
            textbookName="NEW CROWN"
            textbookNameJa="ニュークラウン"
            publisherName="三省堂"
            themeColor="blue"
            presetTextbook="New Crown"
            canonicalUrl="https://edulens.jp/mistap/textbook/new-crown/grade1"
            unitLabel="Lesson"
            initialGrade="中1"
        />
    );
}
