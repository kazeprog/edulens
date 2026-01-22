import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['toeic-gold'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ level: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ level: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { level } = await params;
    // level is 1,2,3,4 corresponding to 600, 730, 860, 990 score levels usually
    const levelLabel = ['600点レベル', '730点レベル', '860点レベル', '990点レベル'][parseInt(level) - 1] || `Level ${level}`;

    const title = `TOEIC L&R 金のフレーズ ${levelLabel} 英単語テスト｜無料`;
    return {
        title: title,
        description: `TOEIC L&R TEST 出る単特急 金のフレーズ ${levelLabel} の英単語テスト。無料で即座にテストできます。`,
        keywords: [
            `金のフレーズ ${levelLabel}`,
            `金フレ ${levelLabel}`,
            'TOEIC 単語 テスト 無料'
        ],
        openGraph: {
            title: title,
            description: `金のフレーズ ${levelLabel} の英単語をテスト。効率よくスコアアップを目指せます。`,
            url: `https://edulens.jp/mistap/textbook/toeic-gold/${level}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/toeic-gold/${level}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { level } = await params;
    const config = WORDBOOK_CONFIG['toeic-gold'];
    const lvNum = parseInt(level, 10);
    const range = config.getRange(lvNum);
    const levelLabel = ['600点レベル', '730点レベル', '860点レベル', '990点レベル'][lvNum - 1] || `Level ${level}`;

    return (
        <TextbookUnitLPTemplate
            textbookName="TOEIC金のフレーズ"
            textbookNameJa="TOEIC L&R TEST 出る単特急 金のフレーズ"
            publisherName="朝日新聞出版"
            themeColor="orange"
            presetTextbook="TOEIC金のフレーズ"
            unitLabel="Level"
            unitValue={levelLabel} // 表示用にラベルを渡す
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="general"
        />
    );
}
