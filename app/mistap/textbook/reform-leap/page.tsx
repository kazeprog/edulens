import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '改訂版 必携英単語LEAPテスト｜大学受験・共通テスト 無料',
    description: '改訂版 必携英単語LEAP対応の英単語テスト。Part/Sectionごとの頻出単語を無料でテストできます。竹岡広信先生監修の単語学習に最適。',
    keywords: [
        '改訂版 必携英単語LEAP',
        'LEAP 改訂版',
        '必携英単語LEAP',
        '竹岡広信 英単語',
        'LEAP 単語テスト',
        '数研出版 英単語',
        '大学受験 英単語',
        '共通テスト 英単語',
        '英単語 アプリ 高校生',
        'LEAP 一覧',
        'LEAP Part',
        'LEAP 無料 テスト',
        '難関大 英単語',
        '英単語 テスト 作成',
        '英単語 テスト 無料',
        'LEAP アプリ',
        'LEAP テスト アプリ',
        'LEAP 単語テスト',
        'LEAP 単語テスト アプリ',
        'LEAP 小テスト',
        'LEAP 小テスト アプリ',
        'LEAP 小テスト メーカー',
        'LEAP 小テスト ジェネレーター',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: '改訂版 必携英単語LEAPテスト｜大学受験・無料',
        description: '改訂版 必携英単語LEAPの単語テスト。Part別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/reform-leap',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '改訂版 必携英単語LEAPテスト｜大学受験・無料',
        description: '改訂版 必携英単語LEAPの単語テスト。Part別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/reform-leap'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function ReformLeapPage() {
    return (
        <TextbookLPTemplate
            textbookName="改訂版 必携英単語LEAP"
            textbookNameJa="改訂版 必携英単語LEAP"
            publisherName="数研出版"
            themeColor="sky"
            presetTextbook="改訂版 必携英単語LEAP"
            canonicalUrl="https://edulens.jp/mistap/textbook/reform-leap"
            unitLabel="Part"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">改訂版 必携英単語LEAPテスト完全対応</span>
                        竹岡広信先生のメソッドを<br />
                        <span className="text-sky-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "改訂版 必携英単語LEAPの無料テスト・クイズアプリ（サイト）。Partごとに小テストを作成でき、SpeakingやWritingにつながる実践的な語彙力が身につきます。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "LEAPのテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Partを選ぶだけで、誰でも無料で改訂版 LEAPの小テストが作れます。<br />
                        <strong>改訂版 必携英単語LEAP</strong>を選択してテストを作成してください。
                    </p>
                ),
                featuresTitle: "LEAPの学習効果を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        Active Vocabulary（発信語彙）とPassive Vocabulary（受信語彙）を効率よく習得するための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "Part別小テスト",
                    description: "LEAPの目次通りの順番でテストが可能。Part 1（重要語）から着実にステップアップできます。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、ゲーム感覚でLEAPをマスターできます。"
                }
            }}
        />
    );
}
