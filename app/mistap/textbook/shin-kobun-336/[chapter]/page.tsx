import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export const dynamic = "force-static";

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['shin-kobun-336'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ chapter: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ chapter: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { chapter } = await params;
    const title = `新古文単語336 第${chapter}章 テスト｜大学受験対応 無料`;
    return {
        title,
        description: `大学入試 新古文単語336 第${chapter}章の確認テスト。無料で即座にテストできます。`,
        keywords: [
            `新古文単語336 第${chapter}章`,
            `古文単語336 ${chapter}章`,
            '大学入試 新古文単語336',
            '古文単語テスト 無料',
        ],
        openGraph: {
            title,
            description: `新古文単語336 第${chapter}章の単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/shin-kobun-336/${chapter}`,
            type: 'website',
            siteName: 'Mistap 古文単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/shin-kobun-336/${chapter}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { chapter } = await params;
    const config = WORDBOOK_CONFIG['shin-kobun-336'];
    const chapterNumber = parseInt(chapter, 10);
    const range = config.getRange(chapterNumber);

    return (
        <TextbookUnitLPTemplate
            textbookName="大学入試 新古文単語336"
            textbookNameJa="新古文単語336"
            publisherName="文英堂"
            themeColor="emerald"
            presetTextbook="大学入試 新古文単語336"
            unitLabel="第"
            unitValue={`${chapter}章`}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
            description={`大学入試 新古文単語336 第${chapter}章の古文単語テストを無料で作成できます。単語番号${range.start}から${range.end}までを小さく区切って復習できます。`}
            parentHref="/mistap/textbook/shin-kobun-336"
        />
    );
}
