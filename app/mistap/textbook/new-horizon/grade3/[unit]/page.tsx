import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { getAvailableLessons } from '@/lib/mistap/textbook-data';

export async function generateStaticParams() {
    const units = getAvailableLessons('New Horizon', '中3');
    if (units.length === 0) {
        return Array.from({ length: 10 }, (_, i) => ({ unit: (i + 1).toString() }));
    }
    return units.map(u => ({ unit: u.toString() }));
}

type PageProps = {
    params: Promise<{ unit: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { unit } = await params;
    const title = `ニューホライズン 中3 Unit ${unit} 英単語テスト｜教科書対応 無料`;
    return {
        title: title,
        description: `中学3年生英語教科書「ニューホライズン（NEW HORIZON）Unit ${unit}」の英単語テスト。無料で即座にテストできます。受験勉強・定期テスト対策に。`,
        keywords: [
            `ニューホライズン 中3 Unit${unit}`,
            `New Horizon 中3 Unit${unit}`,
            `中3 英語 教科書 Unit${unit}`,
            '英単語テスト 無料',
            '高校受験 英語'
        ],
        openGraph: {
            title: title,
            description: `ニューホライズン中3 Unit ${unit}の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/new-horizon/grade3/${unit}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/new-horizon/grade3/${unit}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { unit } = await params;
    return (
        <TextbookUnitLPTemplate
            textbookName="New Horizon"
            textbookNameJa="ニューホライズン"
            publisherName="東京書籍"
            themeColor="orange"
            presetTextbook="New Horizon"
            unitLabel="Unit"
            unitValue={unit}
            gradeLabel="中3"
            initialGrade="中3"
            initialLesson={parseInt(unit, 10)}
            audience="junior"
        />
    );
}
