import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '重要古文単語315（読んで見て聞いて覚える）単語テスト｜大学受験 無料',
    description: '「重要古文単語315」対応の古文単語テスト。イラスト付で人気の単語帳の内容を無料でテストできます。共通テスト・大学受験の古文対策に。',
    keywords: [
        '重要古文単語315',
        '古文単語 315',
        '読んで見て聞いて覚える',
        '桐原書店 古文',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        '重要古文単語315 無料',
        '重要古文単語315 一覧',
        '古文単語 クイズ',
        '古文単語 テスト 作成',
        '古文単語 無料',
        '古文単語 学習 アプリ',
        '重要古文単語315 アプリ',
        '重要古文単語315 単語テスト',
        '重要古文単語315 単語テスト アプリ',
        '重要古文単語315 テスト アプリ',
        '重要古文単語315 小テスト',
        '重要古文単語315 小テスト アプリ',
        '重要古文単語315 小テスト メーカー',
        '重要古文単語315 小テスト ジェネレーター',
    ],
    openGraph: {
        title: '重要古文単語315 対応テスト｜大学受験・無料',
        description: '「重要古文単語315」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/kobun-315',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '重要古文単語315 対応テスト｜大学受験・無料',
        description: '「重要古文単語315」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/kobun-315'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Kobun315Page() {
    return (
        <TextbookLPTemplate
            textbookName="重要古文単語315"
            textbookNameJa="重要古文単語315"
            publisherName="桐原書店"
            themeColor="orange"
            presetTextbook="読んで見て聞いて覚える 重要古文単語315"
            canonicalUrl="https://edulens.jp/mistap/textbook/kobun-315"
            unitLabel="章"
            audience="senior"
            bookType="wordbook"
            overrideCoverTitle="重要古文単語315"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-orange-600 mb-4 tracking-normal">重要古文単語315（読んで見て覚える）完全対応</span>
                        古文単語を<br />
                        <span className="text-orange-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "大学受験の古文対策「重要古文単語315」の無料テスト・クイズアプリ（サイト）。章ごとに小テストを作成でき、共通テストや二次試験の古文単語対策に最適です。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "重要古文単語315のテスト作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。章を選ぶだけで、誰でも無料で古文単語の小テストが作れます。<br />
                        選択肢から「単語帳テスト」を選んで、<strong>重要古文単語315</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "古文単語の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        古文が苦手な人でも、イラストで覚える315の単語を確実に定着させる「古文単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "章別小テスト",
                    description: "重要古文単語315の目次通りの順番でテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
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
