import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";
export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['kobun-325'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ chapter: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ chapter: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { chapter } = await params;
    const title = `ベストセレクション古文単語325 第${chapter}章 テスト｜共通テスト対応 無料`;
    return {
        title: title,
        description: `ベストセレクション古文単語325 第${chapter}章 の確認テスト。無料で即座にテストできます。頻出古文単語を網羅。`,
        keywords: [
            `ベストセレクション古文単語325 第${chapter}章`,
            `古文単語325 ${chapter}章`,
            '古文単語テスト 無料'
        ],
        openGraph: {
            title: title,
            description: `ベストセレクション古文単語325 第${chapter}章 の単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/kobun-325/${chapter}`,
            type: 'website',
            siteName: 'Mistap 古文単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/kobun-325/${chapter}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { chapter } = await params;
    const config = WORDBOOK_CONFIG['kobun-325'];
    const chapNum = parseInt(chapter, 10);
    const range = config.getRange(chapNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="ベストセレクション古文単語325"
            textbookNameJa="ベストセレクション古文単語325"
            publisherName="いいずな書店"
            themeColor="emerald"
            presetTextbook="ベストセレクション古文単語325" // データベース上の名前に合わせる
            unitLabel="第"
            unitValue={`${chapter}章`}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
        />
    );
}
