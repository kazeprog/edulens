import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';
import { notFound, permanentRedirect } from 'next/navigation';

export const dynamic = "force-static";
export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['system-words'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ chapter: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ chapter: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { chapter } = await params;
    const config = WORDBOOK_CONFIG['system-words'];
    const chapNum = parseInt(chapter, 10);

    if (chapNum < 1 || chapNum > config.totalUnits) {
        return {
            title: 'システム英単語 英単語テスト｜大学受験対応 無料',
            robots: { index: false, follow: true },
        };
    }

    const range = config.getRange(chapNum);
    const title = `システム英単語 Chapter ${chapter} 英単語テスト｜No. ${range.start}-${range.end} 無料`;
    return {
        title: title,
        description: `システム英単語（System English Word）Chapter ${chapter} No. ${range.start}-${range.end} の英単語テスト。無料で即座にテストできます。共通テスト・難関大受験対策に。`,
        keywords: [
            `システム英単語 Chapter${chapter}`,
            `System English Word Chapter${chapter}`,
            `システム英単語 チャプター${chapter}`,
            '英単語テスト 無料',
            '大学受験 英語'
        ],
        openGraph: {
            title: title,
            description: `システム英単語 Chapter ${chapter} No. ${range.start}-${range.end} の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/system-words/${chapter}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/system-words/${chapter}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { chapter } = await params;
    const config = WORDBOOK_CONFIG['system-words'];
    const chapNum = parseInt(chapter, 10);

    if (chapNum === 5) {
        permanentRedirect('/mistap/textbook/system-words-stage5');
    }

    if (chapNum < 1 || chapNum > config.totalUnits) {
        notFound();
    }

    const range = config.getRange(chapNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="System English Word"
            textbookNameJa="システム英単語"
            publisherName="駿台文庫"
            themeColor="blue"
            presetTextbook="システム英単語"
            unitLabel="Chapter"
            unitValue={chapter}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="senior"
            description={`システム英単語 Chapter ${chapter} No. ${range.start}-${range.end} の英単語テストを無料で実施できます。アプリのインストール不要で、共通テスト・大学受験に向けた語彙確認をすぐに始められます。`}
            parentHref="/mistap/textbook/system-words"
        />
    );
}
