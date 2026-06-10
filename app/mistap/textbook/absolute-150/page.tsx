import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '絶対覚える英単語150 テスト｜無料小テストアプリ - Mistap',
    description: '絶対覚える英単語150の基礎150語を無料で学習。Part・問題数・回答方式を選んで小テストを開始し、単語帳確認、苦手単語、学習履歴、正答率までブラウザで確認できます。',
    keywords: [
        '絶対覚える英単語150',
        '中学英単語 基礎',
        '英単語 150',
        '中学1年 英単語',
        '絶対覚える英単語150 テスト',
        '絶対覚える英単語150 単語テスト',
        '絶対覚える英単語150 アプリ',
        '中学 英単語 アプリ',
        '絶対覚える英単語150 小テスト',
        '絶対覚える英単語150 無料',
    ],
    openGraph: {
        title: '絶対覚える英単語150 テスト｜無料小テストアプリ - Mistap',
        description: '絶対覚える英単語150の基礎150語を無料で学習。Part・問題数・回答方式を選んで小テストを開始し、単語帳確認、苦手単語、学習履歴、正答率までブラウザで確認できます。',
        url: 'https://edulens.jp/mistap/textbook/absolute-150',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '絶対覚える英単語150 テスト｜無料小テストアプリ - Mistap',
        description: '絶対覚える英単語150の基礎150語を無料で学習。Part・問題数・回答方式を選んで小テストを開始し、単語帳確認、苦手単語、学習履歴、正答率までブラウザで確認できます。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/absolute-150'
    }
};

export default function Absolute150Page() {
    return (
        <TextbookLPTemplate
            textbookName="絶対覚える英単語150"
            textbookNameJa="絶対覚える英単語150"
            publisherName="基礎"
            themeColor="emerald"
            presetTextbook="絶対覚える英単語150"
            canonicalUrl="https://edulens.jp/mistap/textbook/absolute-150"
            audience="junior"
            bookType="wordbook"
            overrideCoverTitle="英単語150"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-emerald-600 mb-4 tracking-normal">絶対覚える英単語150対応</span>
                        中学英語の<br />
                        <span className="text-emerald-500">土台を着実に固める</span>
                    </h1>
                ),
                heroDescription: "中学英語で最初につまずかないための「絶対覚える英単語150」対応の無料英単語テストページです。基本の数字、月、曜日から最重要動詞まで、登録不要ですぐ復習できます。",
                testSectionTitle: "絶対覚える英単語150の英単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        会員登録なしで、基本単語のテストがすぐに行えます。<br />
                        <strong>絶対覚える英単語150</strong>を選択して英単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "基礎固めを徹底サポート",
                featuresDescription: "アルファベットを覚えた後の最初のステップに向いた、短時間で続けやすい設計です。",
                feature1: {
                    title: "Part別テスト",
                    description: "50語ずつのPart分けで、無理なく学習を続けられます。"
                },
                feature2: {
                    title: "音声で確認",
                    description: "単語カードモードを使えば、発音を確認しながら暗記が進められます。"
                },
                feature3: {
                    title: "スマホで手軽に",
                    description: "通学中や家でのちょっとした時間に、スマホのブラウザで単語力を確認できます。"
                }
            }}
        />
    );
}
