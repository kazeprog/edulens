import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['kobun-315'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ chapter: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ chapter: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { chapter } = await params;
    const title = `重要古文単語315 第${chapter}章 テスト｜共通テスト対応 無料`;
    return {
        title: title,
        description: `読んで見て聞いて覚える 重要古文単語315 第${chapter}章 の確認テスト。無料で即座にテストできます。`,
        keywords: [
            `重要古文単語315 第${chapter}章`,
            `古文単語315 ${chapter}章`,
            '古文単語テスト 無料'
        ],
        openGraph: {
            title: title,
            description: `重要古文単語315 第${chapter}章 の単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/kobun-315/${chapter}`,
            type: 'website',
            siteName: 'Mistap 古文単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/kobun-315/${chapter}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { chapter } = await params;
    const config = WORDBOOK_CONFIG['kobun-315'];
    const chapNum = parseInt(chapter, 10);
    const range = config.getRange(chapNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="重要古文単語315"
            textbookNameJa="重要古文単語315"
            publisherName="桐原書店"
            themeColor="emerald"
            presetTextbook="重要古文単語315"
            unitLabel="第"
            unitValue={`${chapter}章`}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
        />
    );
}
