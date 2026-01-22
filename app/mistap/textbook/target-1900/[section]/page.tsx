import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['target-1900'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ section: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ section: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { section } = await params;
    const title = `ターゲット1900 Section ${section} 英単語テスト｜大学受験対応 無料`;
    return {
        title: title,
        description: `英単語ターゲット1900（Target 1900）Section ${section} の英単語テスト。無料で即座にテストできます。共通テスト・難関大受験対策に。`,
        keywords: [
            `ターゲット1900 Section${section}`,
            `Target 1900 Section${section}`,
            `ターゲット1900 セクション${section}`,
            '英単語テスト 無料',
            '大学受験 英語'
        ],
        openGraph: {
            title: title,
            description: `ターゲット1900 Section ${section} の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/target-1900/${section}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/target-1900/${section}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { section } = await params;
    const config = WORDBOOK_CONFIG['target-1900'];
    const secNum = parseInt(section, 10);
    const range = config.getRange(secNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="Target 1900"
            textbookNameJa="英単語ターゲット1900"
            publisherName="旺文社"
            themeColor="blue"
            presetTextbook="ターゲット1900"
            unitLabel="Section"
            unitValue={section}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
        />
    );
}
