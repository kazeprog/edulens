import type { Metadata } from 'next';
import TextbookUnitLPTemplate from '@/components/mistap/TextbookUnitLPTemplate';
import { WORDBOOK_CONFIG } from '@/lib/mistap/textbook-data';

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['duo-30'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ section: (i + 1).toString() }));
}

type PageProps = {
    params: Promise<{ section: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { section } = await params;
    const title = `DUO 3.0 Section ${section} 英単語テスト｜大学受験・TOEIC対応 無料`;
    return {
        title: title,
        description: `英単語帳DUO 3.0 Section ${section} の英単語テスト。無料で即座にテストできます。例文で覚える効率的学習。`,
        keywords: [
            `DUO 3.0 Section${section}`,
            `DUO Section${section}`,
            '英単語テスト 無料',
            'TOEIC対策'
        ],
        openGraph: {
            title: title,
            description: `DUO 3.0 Section ${section} の英単語をテスト。間違えた単語だけを効率よく復習できます。`,
            url: `https://edulens.jp/mistap/textbook/duo-30/${section}`,
            type: 'website',
            siteName: 'Mistap 英単語テスト',
        },
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/duo-30/${section}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { section } = await params;
    // DUOは基本Section単位だが、アプリ側の仕様に合わせて範囲指定が必要なら修正
    // getRangeは現在ダミーを返すが、TextbookUnitLPTemplateはinitialLesson等を受け取ることも可能
    // ここではword rangeでなくSection指定があればそれがベストだが、TestSetupContentはSection指定に対応しているか？
    // TestSetupContentのinitialLessonはnumberを受け取る。DUOもSection番号ならOK。

    return (
        <TextbookUnitLPTemplate
            textbookName="DUO 3.0"
            textbookNameJa="DUO 3.0"
            publisherName="アイシーピー"
            themeColor="blue"
            presetTextbook="DUO 3.0"
            unitLabel="Section"
            unitValue={section}
            initialLesson={parseInt(section, 10)}
            audience="general"
        />
    );
}
