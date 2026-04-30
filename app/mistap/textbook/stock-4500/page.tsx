import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'Stock4500 テスト｜無料小テストアプリ - Mistap',
    description: 'Stock4500対応の英単語テスト。範囲を指定して小テスト化できるので、日々の復習から大学受験の総仕上げまで効率よく使えます。',
    keywords: [
        'Stock4500',
        'STOCK 4500',
        'Stock 4500',
        'Stock4500 英単語',
        'Stock4500 単語テスト',
        'Stock4500 小テスト',
        'Stock4500 アプリ',
        'Stock4500 無料',
        '大学受験 英単語',
        '英単語 テスト 無料',
        '英単語 小テスト 作成',
        '英単語 範囲指定',
    ],
    openGraph: {
        title: 'Stock4500 テスト｜無料小テストアプリ - Mistap',
        description: 'Stock4500の英単語を無料でテスト化。範囲指定と反復で、受験英語の語彙を着実に定着させられます。',
        url: 'https://edulens.jp/mistap/textbook/stock-4500',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Stock4500 テスト｜無料小テストアプリ - Mistap',
        description: 'Stock4500をそのまま小テスト化。覚えたい範囲だけ切り出して、スマホでも手早く復習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/stock-4500'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Stock4500Page() {
    return (
        <TextbookLPTemplate
            textbookName="Stock4500"
            textbookNameJa="Stock4500"
            publisherName="文英堂"
            themeColor="sky"
            presetTextbook="Stock4500"
            canonicalUrl="https://edulens.jp/mistap/textbook/stock-4500"
            unitLabel="Range"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">Stock4500 に対応した無料テスト</span>
                        頻出語から発展語まで<br />
                        <span className="text-sky-500">小テストで着実に定着</span>
                    </h1>
                ),
                heroDescription: "Stock4500の単語データを使って、そのまま範囲指定テストを作成できます。毎日の暗記確認、学校配布教材の復習、大学受験の総仕上げまで、登録不要ですぐに使えます。",
                testSectionTitle: "Stock4500のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        1-100、101-200のように必要な範囲だけ切り出して出題できます。<br />
                        <strong>Stock4500</strong> を選んで、覚えるべき語をテンポよく確認してください。
                    </p>
                ),
                featuresTitle: "Stock4500を反復しやすくする",
                featuresDescription: (
                    <p>
                        Mistapなら、見て終わるだけでなく、<br className="hidden md:inline" />
                        Stock4500の語彙をテスト形式で何度も回せます。
                    </p>
                ),
                feature1: {
                    title: "範囲指定で区切って復習",
                    description: "進度に合わせて50語、100語単位で小分けに出題可能。長い単語帳でも負担を抑えて継続できます。"
                },
                feature2: {
                    title: "間違えた語を後で重点確認",
                    description: "その場で覚え切れなかった単語も、テスト形式で繰り返すことで抜け漏れを減らせます。"
                },
                feature3: {
                    title: "スマホで素早く確認できる",
                    description: "通学中やスキマ時間でも使いやすいので、Stock4500の反復回数を無理なく増やせます。"
                }
            }}
        />
    );
}
