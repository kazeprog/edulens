import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'GROUP30古文単語600 テスト｜無料小テストアプリ - Mistap',
    description: 'GROUP30で覚える古文単語600を無料で学習。グループ・番号範囲・問題数・回答方式を選んで古文単語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
    keywords: [
        'GROUP30で覚える古文単語600',
        'GROUP30',
        '古文単語 600',
        'GROUP30で覚える古文単語600 単語テスト',
        'GROUP30で覚える古文単語600 アプリ',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        'GROUP30 無料',
        '古文単語 クイズ',
        '語学春秋社 古文単語600',
    ],
    openGraph: {
        title: 'GROUP30古文単語600 テスト｜無料小テストアプリ - Mistap',
        description: 'GROUP30で覚える古文単語600を無料で学習。グループ・番号範囲・問題数・回答方式を選んで古文単語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
        url: 'https://edulens.jp/mistap/textbook/group30-kobun-600',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'GROUP30古文単語600 テスト｜無料小テストアプリ - Mistap',
        description: 'GROUP30で覚える古文単語600を無料で学習。グループ・番号範囲・問題数・回答方式を選んで古文単語テストを開始し、苦手語、学習履歴、正答率まで確認できます。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/group30-kobun-600'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Group30Kobun600Page() {
    return (
        <TextbookLPTemplate
            textbookName="GROUP30で覚える古文単語600"
            textbookNameJa="GROUP30で覚える古文単語600"
            publisherName="語学春秋社"
            themeColor="emerald"
            presetTextbook="GROUP30で覚える古文単語600"
            canonicalUrl="https://edulens.jp/mistap/textbook/group30-kobun-600"
            unitLabel="単語番号"
            audience="senior"
            bookType="wordbook"
            overrideCoverTitle="GROUP30古文単語600"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-emerald-600 mb-4 tracking-normal">GROUP30で覚える古文単語600対応</span>
                        古文単語を<br />
                        <span className="text-emerald-500">グループ別テストで定着確認</span>
                    </h1>
                ),
                heroDescription: "大学受験の古文対策に使える「GROUP30で覚える古文単語600」対応の無料古文単語テストページです。単語番号ごとに重要語を確認でき、登録不要ですぐ復習を始められます。",
                testSectionTitle: "GROUP30で覚える古文単語600の古文単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。範囲を選ぶだけで、誰でも無料で古文単語の小テストが作れます。<br />
                        <strong>GROUP30で覚える古文単語600</strong>を選択して古文単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "古文単語の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        古文が苦手な人でも、語源や関連語で覚える600語をグループ別の小テストで定着させる「古文単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "範囲別小テスト",
                    description: "GROUP30で覚える古文単語600の番号順にテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な古文単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "スマホで手軽に復習",
                    description: "スマホ・タブレットに対応。通学中の電車やスキマ時間に、ブラウザで古文単語を復習できます。"
                }
            }}
        />
    );
}
