import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";
export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['target-1200'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ section: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ section: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { section } = await params;
    const title = `ターゲット1200 Section ${section} 英単語テスト｜大学受験対応 無料`;
    return {
        title: title,
        description: `英単語ターゲット1200 Section ${section} の英単語テスト。無料で即座にテストできます。基礎固め・共通テスト対策に。`,
        keywords: [
            `ターゲット1200 Section${section}`,
            `Target 1200 Section${section}`,
            `ターゲット1200 セクション${section}`,
            '英単語テスト 無料',
            '大学受験 英語 基礎'
        ],
        openGraph: {
            title: title,
            description: `ターゲット1200 Section ${section} の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/target-1200/${section}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/target-1200/${section}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { section } = await params;
    const config = WORDBOOK_CONFIG['target-1200'];
    const secNum = parseInt(section, 10);
    const range = config.getRange(secNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="Target 1200"
            textbookNameJa="英単語ターゲット1200"
            publisherName="旺文社"
            themeColor="emerald"
            presetTextbook="ターゲット1200"
            unitLabel="Section"
            unitValue={section}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
        />
    );
}
