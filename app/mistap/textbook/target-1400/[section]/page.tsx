import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";
export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['target-1400'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ section: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ section: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { section } = await params;
    const title = `ターゲット1400 Section ${section} 英単語テスト｜大学受験対応 無料`;
    return {
        title: title,
        description: `英単語ターゲット1400（Target 1400）Section ${section} の英単語テスト。無料で即座にテスト・単語カード形式で学習できます。共通テスト・中堅大受験対策に。`,
        keywords: [
            `ターゲット1400 Section${section}`,
            `Target 1400 Section${section}`,
            `ターゲット1400 セクション${section}`,
            'ターゲット1400',
            '英単語ターゲット1400',
            'Target 1400',
            'ターゲット1400 テスト',
            '大学受験 英単語',
            '共通テスト 英単語',
            '旺文社 英単語',
            '英単語 アプリ 高校生',
            'ターゲット 練習',
            'ターゲット1400 一覧',
            'ターゲット1400 Section',
            'ターゲット1400 Part',
            'ターゲット1400 無料',
            '英単語 テスト 大学受験',
            '単語カード',
            '共通テスト 単語',
            '中堅大 英単語',
            '英単語 テスト 作成',
            '英単語 テスト 無料',
            '英単語 クイズ サイト',
            '英単語テスト 無料',
            '単語カード',
            '大学受験 英語'
        ],
        openGraph: {
            title: title,
            description: `ターゲット1400 Section ${section} の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/target-1400/${section}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/target-1400/${section}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { section } = await params;
    const config = WORDBOOK_CONFIG['target-1400'];
    const secNum = parseInt(section, 10);
    const range = config.getRange(secNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="Target 1400"
            textbookNameJa="英単語ターゲット1400"
            publisherName="旺文社"
            themeColor="green"
            presetTextbook="ターゲット1400"
            unitLabel="Section"
            unitValue={section}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
        />
    );
}
