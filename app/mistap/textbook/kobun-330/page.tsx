import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '古文単語330（Key & Point）対応テスト｜大学受験 無料',
    description: '「Key & Point 古文単語330」対応の古文単語テスト。キーポイントで覚える単語帳の内容を無料でテストできます。共通テスト・大学受験の古文対策に。',
    keywords: [
        '古文単語330',
        'Key & Point',
        'キーアンドポイント',
        '尚文出版 古文',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '古文単語330 無料',
        '古文単語330 一覧',
        '古文単語 クイズ',
        '古文単語 テスト 作成',
        '古文単語 無料',
        '古文単語 学習 アプリ'
    ],
    openGraph: {
        title: '古文単語330（Key & Point）対応テスト｜大学受験・無料',
        description: '「Key & Point 古文単語330」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/kobun-330',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '古文単語330（Key & Point）対応テスト｜大学受験・無料',
        description: '「Key & Point 古文単語330」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/kobun-330'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Kobun330Page() {
    return (
        <TextbookLPTemplate
            textbookName="Key & Point 330"
            textbookNameJa="Key & Point 古文単語330"
            publisherName="尚文出版"
            themeColor="sky"
            presetTextbook="Key&Point古文単語330"
            canonicalUrl="https://edulens.jp/mistap/textbook/kobun-330"
            unitLabel="章"
            audience="senior"
            bookType="wordbook"
            overrideCoverTitle="Key & Point 古文単語330"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">Key＆Point 古文単語330 完全対応</span>
                        重要古文単語を<br />
                        <span className="text-sky-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "大学受験の古文対策「Key & Point 古文単語330」の無料テスト・クイズアプリ（サイト）。章ごとに小テストを作成でき、キーポイントとなる古文単語を効率よく習得できます。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "古文単語330のテスト作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。章を選ぶだけで、誰でも無料で古文単語の小テストが作れます。<br />
                        選択肢から「単語帳テスト」を選んで、<strong>Key&Point古文単語330</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "古文単語の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        キーポイントを意識しながら、古文単語を確実に定着させる「古文単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "章別小テスト",
                    description: "古文単語330の目次通りの順番でテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な古文単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、ゲーム感覚で古文単語をマスターできます。"
                }
            }}
        />
    );
}
