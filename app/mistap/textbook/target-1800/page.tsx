import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1800 単語テスト｜中学生 英単語 無料',
    description: '「ターゲット1800」対応の英単語テスト。中学必修・頻出英単語を無料でテスト・単語カード形式で学習できます。高校入試対策に最適。',
    keywords: [
        'ターゲット1800',
        '中学英単語 ターゲット1800',
        '英単語 ターゲット1800',
        'ターゲット1800 テスト',
        'ターゲット1800 アプリ',
        '高校入試 英単語',
        '中学 英語 暗記',
        'ターゲット1800 無料',
        'ターゲット1800 単語テスト',
        'ターゲット1800 単語テスト アプリ',
        'ターゲット1800 テスト アプリ',
        'ターゲット1800 小テスト',
        'ターゲット1800 小テスト アプリ',
        'ターゲット1800 小テスト メーカー',
        'ターゲット1800 小テスト ジェネレーター',
        'ターゲット1800 一覧',
    ],
    openGraph: {
        title: 'ターゲット1800 対応テスト｜中学生・無料',
        description: '「ターゲット1800」対応の英単語テスト。中学から高校入試までの最重要語を効率よく練習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1800',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1800 対応テスト｜中学生・無料',
        description: '「ターゲット1800」対応の英単語テスト。中学・高校入試の重要英単語を無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1800'
    }
};

export default function Target1800Page() {
    return (
        <TextbookLPTemplate
            textbookName="ターゲット1800"
            textbookNameJa="ターゲット1800"
            publisherName="旺文社"
            themeColor="blue"
            presetTextbook="ターゲット1800"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1800"
            audience="junior"
            bookType="wordbook"
            overrideCoverTitle="ターゲット1800"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">ターゲット1800 完全対応</span>
                        中学英単語を<br />
                        <span className="text-blue-500">最速でマスター</span>
                    </h1>
                ),
                heroDescription: "高校入試対策の定番「ターゲット1800」の無料テスト・クイズアプリ（サイト）。中学レベルの最重要語を網羅。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "ターゲット1800のテスト作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。範囲を選ぶだけで、誰でも無料で英単語の小テストが作れます。<br />
                        選択肢から「単語帳テスト」を選んで、<strong>ターゲット1800</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "高校入試突破を強力サポート",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        「ターゲット1800」の内容を確実に定着させるための機能を備えています。
                    </p>
                ),
                feature1: {
                    title: "番号別小テスト",
                    description: "単語番号を指定してテストが可能。学校の宿題や塾のカリキュラムに合わせて、必要な範囲だけを確認できます。"
                },
                feature2: {
                    title: "苦手単語を自動記録",
                    description: "間違えた単語は自動的に保存。志望校合格に向けて、自分の弱点をピンポイントで強化できます。"
                },
                feature3: {
                    title: "スキマ時間を活用",
                    description: "スマホ・タブレット完全対応。バスの待ち時間や寝る前の5分を、得点アップのための時間に変えられます。"
                }
            }}
        />
    );
}
