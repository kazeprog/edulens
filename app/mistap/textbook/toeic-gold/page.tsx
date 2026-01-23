import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'TOEIC L&R 金のフレーズ（金フレ）英単語テスト｜TOEIC対策 無料',
    description: 'TOEIC対策のバイブル「出る単特急 金のフレーズ（金フレ）」対応の英単語テスト。スコアレベル別の頻出単語を無料でテストできます。',
    keywords: [
        '金のフレーズ',
        '金フレ',
        'TOEIC 単語',
        '金のフレーズ テスト',
        '金フレ アプリ',
        'TOEIC 頻出単語',
        'TEX加藤',
        '朝日新聞出版',
        'TOEIC 無料 アプリ',
        '金フレ 一覧',
        '金フレ 無料',
        'ビジネス英語',
        '英単語 テスト 作成',
        '英単語 テスト 無料',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: 'TOEIC L&R 金のフレーズ（金フレ）英単語テスト｜TOEIC対策',
        description: 'TOEIC対策の決定版「金のフレーズ（金フレ）」の単語テスト。レベル別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/toeic-gold',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TOEIC L&R 金のフレーズ（金フレ）英単語テスト｜TOEIC対策',
        description: 'TOEIC対策の決定版「金のフレーズ（金フレ）」の単語テスト。レベル別に無料で練習できます。',
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
                        <span className="block text-xl md:text-2xl font-bold text-orange-600 mb-4 tracking-normal">金のフレーズ（金フレ）テスト完全対応</span>
                        TOEIC頻出単語を<br />
                        <span className="text-orange-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "TOEIC対策のバイブル「出る単特急 金のフレーズ（金フレ）」の無料テスト・クイズアプリ（サイト）。目標スコアレベルごとに小テストを作成でき、効率的に600点〜990点を目指せます。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "金フレのテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。レベルを選ぶだけで、誰でも無料で金フレの小テストが作れます。<br />
                        選択肢から「教科書テスト」を選んで、<strong>TOEIC金のフレーズ</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "金フレの暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        TOEICスコアアップに直結する語彙力を、最短距離で身につけるための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "レベル別小テスト",
                    description: "600点・730点・860点・990点のレベルごとにテストが可能。自分の目標に合わせて効率よく学習できます。"
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
