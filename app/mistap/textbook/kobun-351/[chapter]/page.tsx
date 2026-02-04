import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";
export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['kobun-351'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ chapter: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ chapter: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { chapter } = await params;
    const title = `核心古文単語351 第${chapter}章 テスト｜共通テスト対応 無料`;
    return {
        title: title,
        description: `理解を深める核心古文単語351 第${chapter}章 の確認テスト。無料で即座にテストできます。`,
        keywords: [
            `核心古文単語351 第${chapter}章`,
            `古文単語351 ${chapter}章`,
            '古文単語テスト 無料'
        ],
        openGraph: {
            title: title,
            description: `核心古文単語351 第${chapter}章 の単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/kobun-351/${chapter}`,
            type: 'website',
            siteName: 'Mistap 古文単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/kobun-351/${chapter}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { chapter } = await params;
    const config = WORDBOOK_CONFIG['kobun-351'];
    const chapNum = parseInt(chapter, 10);
    const range = config.getRange(chapNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="理解を深める核心古文単語351"
            textbookNameJa="核心古文単語351"
            publisherName="尚文出版"
            themeColor="blue"
            presetTextbook="理解を深める核心古文単語351"
            unitLabel="第"
            unitValue={`${chapter}章`}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
        />
    );
}
