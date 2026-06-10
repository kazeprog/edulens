import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '核心古文単語351 テスト｜無料小テストアプリ - Mistap',
    description: '理解を深める核心古文単語351を無料で学習。章・番号範囲・問題数・回答方式を選んで古文単語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
    keywords: [
        '核心古文単語351',
        '理解を深める核心古文単語351',
        '古文単語 351',
        '核心古文単語351 単語テスト',
        '核心古文単語351 アプリ',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '核心古文単語351 無料',
        '核心古文単語351 小テスト',
        '古文単語 クイズ',
        '尚文出版 核心古文単語351',
    ],
    openGraph: {
        title: '核心古文単語351 テスト｜無料小テストアプリ - Mistap',
        description: '理解を深める核心古文単語351を無料で学習。章・番号範囲・問題数・回答方式を選んで古文単語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
        url: 'https://edulens.jp/mistap/textbook/kobun-351',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '核心古文単語351 テスト｜無料小テストアプリ - Mistap',
        description: '理解を深める核心古文単語351を無料で学習。章・番号範囲・問題数・回答方式を選んで古文単語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/kobun-351'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Kobun351Page() {
    return (
        <TextbookLPTemplate
            textbookName="理解を深める核心古文単語351"
            textbookNameJa="理解を深める核心古文単語351"
            publisherName="尚文出版"
            themeColor="blue"
            presetTextbook="理解を深める核心古文単語351"
            canonicalUrl="https://edulens.jp/mistap/textbook/kobun-351"
            unitLabel="章"
            audience="senior"
            bookType="wordbook"
            overrideCoverTitle="核心古文単語351"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">核心古文単語351対応</span>
                        古文単語を<br />
                        <span className="text-blue-500">意味のつながりで確認</span>
                    </h1>
                ),
                heroDescription: "大学受験の古文対策に使える「理解を深める核心古文単語351」対応の無料古文単語テストページです。章ごとに重要語を確認でき、登録不要ですぐ復習を始められます。",
                testSectionTitle: "核心古文単語351の古文単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。範囲を選ぶだけで、誰でも無料で古文単語の小テストが作れます。<br />
                        <strong>核心古文単語351</strong>を選択して古文単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "論理的な単語学習をサポート",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        「理解を深める」というコンセプトに合わせ、章別テストの反復で確実に意味を定着させるお手伝いをします。
                    </p>
                ),
                feature1: {
                    title: "範囲別小テスト",
                    description: "50単語ごとの区切りでテストが可能。日々の学習ペースに合わせて、細かく確認テストが実施できます。"
                },
                feature2: {
                    title: "苦手単語を自動リスト化",
                    description: "間違えた単語は自動的に保存。「核心」となる重要語句の抜け漏れを防ぎ、効率的に復習できます。"
                },
                feature3: {
                    title: "いつでもどこでも復習",
                    description: "スマホ・タブレットに対応。移動中や寝る前のスキマ時間に、ブラウザで古文単語を復習できます。"
                }
            }}
        />
    );
}
