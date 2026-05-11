import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['toeic-silver'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ level: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ level: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { level } = await params;
    const levelLabel = ['1-200', '201-400', '401-600', '601-800', '801-1000'][parseInt(level, 10) - 1] || `Level ${level}`;
    const title = `TOEIC L&R 銀のフレーズ ${levelLabel} 英単語テスト｜無料`;

    return {
        title,
        description: `TOEIC L&R TEST 出る単特急 銀のフレーズ ${levelLabel} の英単語テスト。無料で即座にテストできます。`,
        keywords: [
            `銀のフレーズ ${levelLabel}`,
            `銀フレ ${levelLabel}`,
            'TOEIC 単語 テスト 無料'
        ],
        openGraph: {
            title,
            description: `銀のフレーズ ${levelLabel} の英単語をテスト。基礎語彙を効率よく固められます。`,
            url: `https://edulens.jp/mistap/textbook/toeic-silver/${level}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/toeic-silver/${level}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { level } = await params;
    const config = WORDBOOK_CONFIG['toeic-silver'];
    const levelNumber = parseInt(level, 10);
    const range = config.getRange(levelNumber);
    const levelLabel = `${range.start}-${range.end}`;

    return (
        <TextbookUnitLPTemplate
            textbookName="TOEIC銀のフレーズ"
            textbookNameJa="TOEIC L&R TEST 出る単特急 銀のフレーズ"
            publisherName="朝日新聞出版"
            themeColor="silver"
            presetTextbook="TOEIC銀のフレーズ"
            unitLabel="Level"
            unitValue={levelLabel}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="general"
            parentHref="/mistap/textbook/toeic-silver"
        />
    );
}
