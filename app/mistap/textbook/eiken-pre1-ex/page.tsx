import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '英検準1級単熟語EX テスト｜語彙と熟語を無料で反復',
    description: '英検準1級単熟語EX対応の無料テストページです。単語・熟語を範囲指定で確認でき、英検準1級の語彙対策をテンポよく進められます。',
    keywords: [
        '英検準1級単熟語EX',
        '英検準1級 単熟語EX',
        '英検準1級単熟語EX アプリ',
        '英検準1級単熟語EX テスト アプリ',
        '英検準1級単熟語EX 単語テスト',
        '英検準1級単熟語EX 単語テスト アプリ',
        '英検準1級単熟語EX 小テスト',
        '英検準1級単熟語EX 小テスト アプリ',
        '英検準1級単熟語EX 小テスト メーカー',
        '英検準1級単熟語EX 小テスト ジェネレーター',
        '英検準1級 単語 アプリ',
        '英検準1級 熟語 アプリ',
        '英検準1級 語彙 テスト',
        'Eiken Pre-1',
    ],
    openGraph: {
        title: '英検準1級単熟語EX テスト｜語彙と熟語を無料で反復',
        description: '英検準1級単熟語EXの範囲指定テストをすぐ作成。一次試験の語彙対策に使いやすい無料ページです。',
        url: 'https://edulens.jp/mistap/textbook/eiken-pre1-ex',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '英検準1級単熟語EX テスト｜語彙と熟語を無料で反復',
        description: '英検準1級単熟語EXの単語・熟語を範囲指定でテスト化。スキマ時間の反復に向いた無料ページです。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/eiken-pre1-ex'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function EikenPre1ExPage() {
    return (
        <TextbookLPTemplate
            textbookName="英検準1級単熟語EX"
            textbookNameJa="英検準1級単熟語EX"
            publisherName="ジャパンタイムズ出版"
            themeColor="orange"
            presetTextbook="英検準1級単熟語EX"
            canonicalUrl="https://edulens.jp/mistap/textbook/eiken-pre1-ex"
            unitLabel="Range"
            audience="university"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-orange-600 mb-4 tracking-normal">英検準1級単熟語EX に対応</span>
                        語彙と熟語を<br />
                        <span className="text-orange-500">範囲指定テストで着実に定着</span>
                    </h1>
                ),
                heroDescription: "英検準1級単熟語EXの単語データをもとに、必要な範囲だけを小テスト化できます。一次試験の語彙確認、熟語の反復、試験直前の総復習まで、登録不要ですぐ使えます。",
                testSectionTitle: "英検準1級単熟語EX のテストを無料で作成",
                testSectionDescription: (
                    <p>
                        1-50、51-100 のように細かく区切って確認できます。<br />
                        <strong>英検準1級単熟語EX</strong> を選んで、語彙と熟語の定着を進めてください。
                    </p>
                ),
                featuresTitle: "英検準1級の語彙対策を回しやすくする",
                featuresDescription: (
                    <p>
                        Mistapなら、読み流しで終わらず、<br className="hidden md:inline" />
                        英検準1級単熟語EXの単語・熟語をテスト形式で反復できます。
                    </p>
                ),
                feature1: {
                    title: "範囲指定で小さく回せる",
                    description: "進んだところだけ、苦手なところだけを切り出して確認できるので、日々の学習量を調整しやすくなります。"
                },
                feature2: {
                    title: "語彙と熟語をまとめて復習",
                    description: "単語だけでなく熟語も同じ流れで反復できるため、英検準1級で問われやすい表現をまとめて固められます。"
                },
                feature3: {
                    title: "スキマ時間でも進めやすい",
                    description: "スマホでも扱いやすく、通学・通勤中や休み時間に少しずつ復習を積み上げられます。"
                }
            }}
        />
    );
}
