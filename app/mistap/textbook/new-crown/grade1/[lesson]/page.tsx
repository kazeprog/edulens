import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { getAvailableLessons } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";
// SSGパラメータ生成
export async function generateStaticParams() {
    const lessons = getAvailableLessons('New Crown', '中1');
    if (lessons.length === 0) {
        // Fallback: 1-10
        return Array.from({ length: 10 }, (_, i) => ({ lesson: (i + 1).toString() }));
    }
    return lessons.map(l => ({ lesson: l.toString() }));
}

type PageProps = {
    params: Promise<{ lesson: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lesson } = await params;
    const title = `ニュークラウン 中1 Lesson ${lesson} 英単語テスト｜教科書対応 無料`;
    return {
        title: title,
        description: `中学1年生英語教科書「ニュークラウン（NEW CROWN）Lesson ${lesson}」の英単語テスト。無料で即座にテストできます。定期テスト対策に最適。`,
        keywords: [
            `ニュークラウン 中1 Lesson${lesson}`,
            `New Crown 中1 Lesson${lesson}`,
            `中1 英語 教科書 Lesson${lesson}`,
            '英単語テスト 無料',
            '定期テスト対策'
        ],
        openGraph: {
            title: title,
            description: `ニュークラウン中1 Lesson ${lesson}の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/new-crown/grade1/${lesson}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/new-crown/grade1/${lesson}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { lesson } = await params;
    return (
        <TextbookUnitLPTemplate
            textbookName="New Crown"
            textbookNameJa="ニュークラウン"
            publisherName="三省堂"
            themeColor="blue"
            presetTextbook="New Crown"
            unitLabel="Lesson"
            unitValue={lesson}
            gradeLabel="中1"
            initialGrade="中1"
            initialLesson={parseInt(lesson, 10)}
            audience="junior"
        />
    );
}
