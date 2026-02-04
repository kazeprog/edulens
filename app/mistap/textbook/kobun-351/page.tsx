import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '理解を深める核心古文単語351 単語テスト｜大学受験 無料',
    description: '「理解を深める核心古文単語351」対応の古文単語テスト。尚文出版の入試必修・頻出古文単語を無料でテスト・単語カード形式で学習できます。',
    keywords: [
        '核心古文単語351',
        '理解を深める核心古文単語351',
        '古文単語 351',
        '尚文出版 古文',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '核心古文単語351 無料',
        '核心古文単語351 一覧',
        '古文単語 クイズ',
        '核心古文単語351 アプリ',
        '核心古文単語351 単語テスト',
        '核心古文単語351 単語テスト アプリ',
        '核心古文単語351 テスト アプリ',
        '核心古文単語351 小テスト',
        '核心古文単語351 小テスト アプリ',
        '核心古文単語351 小テスト メーカー',
        '核心古文単語351 小テスト ジェネレーター',
    ],
    openGraph: {
        title: '理解を深める核心古文単語351 対応テスト｜大学受験・無料',
        description: '「核心古文単語351」対応の古文単語テスト。入試必修・頻出語を効率よく練習できます。',
        url: 'https://edulens.jp/mistap/textbook/kobun-351',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '理解を深める核心古文単語351 対応テスト｜大学受験・無料',
        description: '「核心古文単語351」対応の古文単語テスト。入試必修・頻出古文単語を無料で練習できます。',
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
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">核心古文単語351 完全対応</span>
                        古文単語を<br />
                        <span className="text-blue-500">意味のつながりで攻略</span>
                    </h1>
                ),
                heroDescription: "大学受験の古文対策「理解を深める核心古文単語351」の無料テスト・クイズアプリ（サイト）。章（Chapter）ごとに小テストを作成でき、共通テストや二次試験の古文単語対策に最適です。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "核心古文単語351のテスト作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。範囲を選ぶだけで、誰でも無料で古文単語の小テストが作れます。<br />
                        選択肢から「単語帳テスト」を選んで、<strong>核心古文単語351</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "論理的な単語学習をサポート",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        「理解を深める」というコンセプトに合わせ、テストを通して確実に意味を定着させるお手伝いをします。
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
                    description: "スマホ・タブレット完全対応。移動中や寝る前のスキマ時間を、有効な古文単語学習の時間に変えられます。"
                }
            }}
        />
    );
}
