import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1800 5訂版 テスト｜無料小テストアプリ - Mistap',
    description: 'ターゲット1800(5訂版)対応の無料英単語テスト。高校入試に向けて中学重要単語を小テスト形式で確認でき、苦手語彙の復習にも使えます。',
    keywords: [
        'ターゲット1800(5訂版)',
        'ターゲット1800 5訂版',
        '中学英単語 ターゲット1800(5訂版)',
        '英単語 ターゲット1800(5訂版)',
        'ターゲット1800(5訂版) テスト',
        'ターゲット1800(5訂版) アプリ',
        '中学 英単語 アプリ',
        '高校入試 英単語',
        '中学 英語 暗記',
        'ターゲット1800(5訂版) 無料',
        'ターゲット1800(5訂版) 単語テスト',
        'ターゲット1800(5訂版) 小テスト',
        'ターゲット1800(5訂版) 一覧'
    ],
    openGraph: {
        title: 'ターゲット1800 5訂版 テスト｜無料小テストアプリ - Mistap',
        description: 'ターゲット1800(5訂版)の単語を無料の小テストやアプリ感覚で復習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1800-v5',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1800 5訂版 テスト｜無料小テストアプリ - Mistap',
        description: 'ターゲット1800(5訂版)の単語を無料の小テストやアプリ感覚で復習できる英単語テストです。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1800-v5'
    }
};

export default function Target1800V5Page() {
    return (
        <TextbookLPTemplate
            textbookName="ターゲット1800(5訂版)"
            textbookNameJa="ターゲット1800(5訂版)"
            publisherName="旺文社"
            themeColor="blue"
            presetTextbook="ターゲット1800(5訂版)"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1800-v5"
            audience="junior"
            bookType="wordbook"
            overrideCoverTitle="ターゲット1800(5訂版)"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">ターゲット1800(5訂版)対応</span>
                        中学英単語を<br />
                        <span className="text-blue-500">小テストで着実に定着</span>
                    </h1>
                ),
                heroDescription: "高校入試対策に使える「ターゲット1800(5訂版)」対応の無料英単語テスト・学習アプリ感覚ページです。中学重要単語を小テスト形式で確認でき、登録不要ですぐ復習を始められます。",
                testSectionTitle: "ターゲット1800(5訂版)の英単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。範囲を選ぶだけで、誰でも無料で英単語の小テストが作れます。<br />
                        <strong>ターゲット1800(5訂版)</strong>を選択して英単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "高校入試突破を強力サポート",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        「ターゲット1800(5訂版)」の内容を確実に定着させるための機能を備えています。アプリ感覚で毎日の復習に使えます。
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
                    description: "スマホ・タブレット完全対応。バスの待ち時間や寝る前の5分を、アプリ感覚で得点アップのための時間に変えられます。"
                }
            }}
        />
    );
}
