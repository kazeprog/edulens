import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'Stock3000英単語テスト｜基礎から受験頻出語まで無料で演習',
    description: 'Stock3000対応の英単語テスト。覚えたい範囲だけ小テスト化できるので、日々の確認から受験対策までテンポよく進められます。',
    keywords: [
        'Stock3000',
        'STOCK 3000',
        'Stock 3000',
        'Stock3000 英単語',
        'Stock3000 単語テスト',
        'Stock3000 小テスト',
        'Stock3000 アプリ',
        'Stock3000 無料',
        '受験英単語',
        '英単語 テスト 無料',
        '英単語 小テスト 作成',
        '英単語 範囲指定',
    ],
    openGraph: {
        title: 'Stock3000英単語テスト｜基礎から受験頻出語まで無料で演習',
        description: 'Stock3000の単語を無料でテスト化。必要な範囲だけを切り出して、スキマ時間でも反復できます。',
        url: 'https://edulens.jp/mistap/textbook/stock-3000',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Stock3000英単語テスト｜基礎から受験頻出語まで無料で演習',
        description: 'Stock3000をそのまま小テスト化。短い範囲で区切りながら、着実に定着を進められます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/stock-3000'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Stock3000Page() {
    return (
        <TextbookLPTemplate
            textbookName="Stock3000"
            textbookNameJa="Stock3000"
            publisherName="文英堂"
            themeColor="blue"
            presetTextbook="Stock3000"
            canonicalUrl="https://edulens.jp/mistap/textbook/stock-3000"
            unitLabel="Range"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">Stock3000 に対応した無料テスト</span>
                        基礎から頻出語まで<br />
                        <span className="text-blue-500">小テストで無理なく定着</span>
                    </h1>
                ),
                heroDescription: "Stock3000の単語データをもとに、そのまま範囲指定テストを作成できます。授業進度の確認、毎日の復習、大学受験に向けた語彙固めまで、登録不要で今すぐ使えます。",
                testSectionTitle: "Stock3000のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        1-50、51-100のように細かく区切って出題できます。<br />
                        <strong>Stock3000</strong> を選んで、覚えるべき語を着実に確認してください。
                    </p>
                ),
                featuresTitle: "Stock3000を反復しやすくする",
                featuresDescription: (
                    <p>
                        Mistapなら、ただ読むだけで終わらず、<br className="hidden md:inline" />
                        Stock3000の語彙をテスト形式でテンポよく回せます。
                    </p>
                ),
                feature1: {
                    title: "短い範囲で区切って学習",
                    description: "覚えたい範囲だけ指定して小テスト化できるので、1日の学習量を調整しながら続けやすくなります。"
                },
                feature2: {
                    title: "重要語の抜け漏れを減らす",
                    description: "うろ覚えの単語もテスト形式で何度も確認できるため、読んだつもりで終わるのを防げます。"
                },
                feature3: {
                    title: "スキマ時間でも回しやすい",
                    description: "スマホでも扱いやすく、通学中や休み時間にStock3000を少しずつ反復できます。"
                }
            }}
        />
    );
}
