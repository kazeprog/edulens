import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '金のフレーズ（金フレ）英単語テスト｜TOEIC単語を無料で小テスト',
    description: 'TOEIC L&R TEST 出る単特急 金のフレーズ（金フレ）対応の無料英単語テスト。TOEIC頻出単語を小テスト形式で効率よく復習できます。',
    keywords: [
        '金のフレーズ 単語テスト',
        '金フレ 単語テスト',
        '金のフレーズ 小テスト',
        '金フレ 小テスト',
        'TOEIC 金のフレーズ',
        'TOEIC 単語 テスト',
        'TOEIC 頻出単語',
        '出る単特急 金のフレーズ',
        'TEX加藤 金のフレーズ'
    ],
    openGraph: {
        title: '金のフレーズ（金フレ）英単語テスト｜TOEIC単語を無料で小テスト',
        description: 'TOEIC L&R TEST 出る単特急 金のフレーズ（金フレ）の単語を、無料の小テスト形式で復習できます。',
        url: 'https://edulens.jp/mistap/textbook/toeic-gold',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/MistapLP.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '金のフレーズ（金フレ）英単語テスト｜TOEIC単語を無料で小テスト',
        description: '金フレの単語を無料の小テスト形式で復習できるTOEIC英単語テストです。',
        images: ['/MistapLP.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/toeic-gold'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function ToeicGoldPage() {
    return (
        <TextbookLPTemplate
            textbookName="金のフレーズ"
            textbookNameJa="TOEIC L&R 金のフレーズ"
            publisherName="朝日新聞出版"
            themeColor="orange"
            presetTextbook="TOEIC金のフレーズ"
            canonicalUrl="https://edulens.jp/mistap/textbook/toeic-gold"
            unitLabel="Level"
            audience="general"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-orange-600 mb-4 tracking-normal">TOEIC L&R 金のフレーズ（金フレ）対応</span>
                        金フレの英単語テストで<br />
                        <span className="text-orange-500">TOEIC頻出語を効率よく定着</span>
                    </h1>
                ),
                heroDescription: "TOEIC L&R TEST 出る単特急 金のフレーズ（金フレ）に対応した無料の英単語テストページです。TOEIC頻出単語を小テスト形式で、登録不要ですぐ復習できます。",
                testSectionTitle: "金フレの英単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。誰でも無料で金フレの小テストを作れます。<br />
                        <strong>TOEIC金のフレーズ</strong>を選択して、英単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "金フレの暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        TOEICスコアアップに直結する語彙力を、小テスト形式で効率よく身につけるための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "金フレ対応の小テスト",
                    description: "金のフレーズに対応した英単語テストをすぐに作成可能。TOEIC頻出単語の定着確認に使えます。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通勤・通学中の電車やスキマ時間に、ゲーム感覚で金フレをマスターできます。"
                }
            }}
        />
    );
}
