import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";
export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['leap'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ part: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ part: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { part } = await params;
    const title = `LEAP Part ${part} 英単語テスト｜大学受験対応 無料`;
    return {
        title: title,
        description: `英単語帳LEAP Part ${part} の英単語テスト。無料で即座にテストできます。語源学習・4技能対応。`,
        keywords: [
            `LEAP Part${part}`,
            `LEAP パート${part}`,
            '英単語テスト 無料',
            '大学受験 英語'
        ],
        openGraph: {
            title: title,
            description: `LEAP Part ${part} の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/leap/${part}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/leap/${part}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { part } = await params;
    const config = WORDBOOK_CONFIG['leap'];
    const partNum = parseInt(part, 10);
    const range = config.getRange(partNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="LEAP"
            textbookNameJa="LEAP"
            publisherName="数研出版"
            themeColor="blue"
            presetTextbook="LEAP"
            unitLabel="Part"
            unitValue={part}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
        />
    );
}
