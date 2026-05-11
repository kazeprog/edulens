import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '新古文単語336 テスト｜無料小テストアプリ - Mistap',
    description: '大学入試 新古文単語336対応の無料古文単語テスト。入試頻出の古文単語336語を、範囲指定の小テストやアプリ感覚で効率よく復習できます。',
    keywords: [
        '大学入試 新古文単語336',
        '新古文単語336',
        '古文単語336',
        '新古文単語336 単語テスト',
        '新古文単語336 アプリ',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '新古文単語336 無料',
        '新古文単語336 小テスト',
        '古文単語 クイズ',
        '文英堂 新古文単語336',
    ],
    openGraph: {
        title: '新古文単語336 テスト｜無料小テストアプリ - Mistap',
        description: '新古文単語336の入試頻出語を、無料の古文単語テストやアプリ感覚で復習できます。',
        url: 'https://edulens.jp/mistap/textbook/shin-kobun-336',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '新古文単語336 テスト｜無料小テストアプリ - Mistap',
        description: '新古文単語336の入試頻出語を、無料の古文単語テストやアプリ感覚で復習できます。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/shin-kobun-336'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function ShinKobun336Page() {
    return (
        <TextbookLPTemplate
            textbookName="大学入試 新古文単語336"
            textbookNameJa="大学入試 新古文単語336"
            publisherName="文英堂"
            themeColor="emerald"
            presetTextbook="大学入試 新古文単語336"
            canonicalUrl="https://edulens.jp/mistap/textbook/shin-kobun-336"
            unitLabel="章"
            audience="senior"
            bookType="wordbook"
            overrideCoverTitle="新古文単語336"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-emerald-600 mb-4 tracking-normal">新古文単語336対応</span>
                        入試古文単語を<br />
                        <span className="text-emerald-500">小テストで定着</span>
                    </h1>
                ),
                heroDescription: "大学受験の古文対策に使える「大学入試 新古文単語336」対応の無料古文単語テスト・学習アプリ感覚ページです。単語番号ごとに重要語を確認でき、登録不要ですぐ復習を始められます。",
                testSectionTitle: "新古文単語336の古文単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。範囲を選ぶだけで、誰でも無料で古文単語の小テストが作れます。<br />
                        <strong>大学入試 新古文単語336</strong>を選択して古文単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "古文単語の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        336語を範囲指定のテストとアプリ感覚の復習で、入試本番まで使える知識として定着させます。
                    </p>
                ),
                feature1: {
                    title: "範囲別小テスト",
                    description: "新古文単語336の番号順にテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
                },
                feature2: {
                    title: "苦手単語を自動リスト化",
                    description: "間違えた単語は自動的に保存。あなただけの苦手な古文単語帳が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "スマホで毎日続けやすい",
                    description: "スマホ・タブレット完全対応。通学中やスキマ時間に、アプリ感覚で古文単語を復習できます。"
                }
            }}
        />
    );
}
