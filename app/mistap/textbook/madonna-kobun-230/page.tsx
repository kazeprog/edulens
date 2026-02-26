import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'マドンナ古文単語230 単語テスト｜大学受験 無料',
    description: '「マドンナ古文単語230」対応の古文単語テスト。イラストと分かりやすい解説で人気の単語帳の内容を無料でテストできます。共通テスト・大学受験の古文対策に。',
    keywords: [
        'マドンナ古文単語230',
        'マドンナ古文単語',
        '古文単語 230',
        '学研プラス',
        '古文単語 テスト',
        '古文単語 アプリ',
        '大学受験 古文',
        '共通テスト 古文',
        'マドンナ古文単語230 無料',
        'マドンナ古文単語230 一覧',
        'マドンナ古文単語230 アプリ',
        'マドンナ古文単語230 単語テスト',
        'マドンナ古文単語230 単語テスト アプリ',
        'マドンナ古文単語230 テスト アプリ',
        'マドンナ古文単語230 小テスト',
        'マドンナ古文単語230 小テスト アプリ',
        'マドンナ古文単語230 小テスト メーカー',
        'マドンナ古文単語230 小テスト ジェネレーター',
        '古文単語 クイズ',
        '古文単語 テスト 作成',
    ],
    openGraph: {
        title: 'マドンナ古文単語230 対応テスト｜大学受験・無料',
        description: '「マドンナ古文単語230」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/madonna-kobun-230',
        type: 'website',
        siteName: 'Mistap 古文単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'マドンナ古文単語230 対応テスト｜大学受験・無料',
        description: '「マドンナ古文単語230」対応の古文単語テスト。頻出古文単語を無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/madonna-kobun-230'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function MadonnaKobun230Page() {
    return (
        <TextbookLPTemplate
            textbookName="マドンナ古文単語230"
            textbookNameJa="マドンナ古文単語"
            publisherName="学研プラス"
            themeColor="rose"
            presetTextbook="マドンナ古文単語230"
            canonicalUrl="https://edulens.jp/mistap/textbook/madonna-kobun-230"
            unitLabel="単語番号"
            audience="senior"
            bookType="wordbook"
            overrideCoverTitle="マドンナ古文単語230"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-rose-600 mb-4 tracking-normal">マドンナ古文単語230 完全対応</span>
                        古文単語を<br />
                        <span className="text-rose-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "大学受験の古文対策「マドンナ古文単語230」の無料テスト・クイズアプリ（サイト）。単語番号を選ぶだけで小テストを作成でき、共通テストや二次試験の古文単語対策に最適です。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "マドンナ古文単語230のテスト作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。範囲を選ぶだけで、誰でも無料で古文単語の小テストが作れます。<br />
                        選択肢から「単語帳テスト」を選んで、<strong>マドンナ古文単語230</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "古文単語の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        古文が苦手な人でも、厳選された230の単語を確実に定着させる「古文単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "範囲別小テスト",
                    description: "マドンナ古文単語230の番号順にテストが可能。学校の小テスト対策から、入試直前の総確認まで対応しています。"
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
