import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '鉄緑会東大英単語熟語 鉄壁 単語テスト｜東大・難関大受験 無料',
    description: '東大受験のバイブル「鉄緑会東大英単語熟語 鉄壁」対応の英単語テスト。Sectionごとの重要単語を無料でテストできます。東大・医学部・難関大対策に最適。',
    keywords: [
        '鉄壁',
        '鉄緑会',
        '東大英単語熟語',
        '鉄壁 テスト',
        '鉄壁 単語テスト',
        '鉄壁 テスト アプリ',
        '鉄壁 単語テスト アプリ',
        '東大 受験 英単語',
        '難関大 英単語',
        '医学部 英単語',
        '英単語 テスト 作成',
        '鉄壁 無料',
        '鉄緑会 英単語',
        '鉄壁 アプリ',
        '鉄壁 小テスト',
        '鉄壁 小テスト アプリ',
        '鉄壁 小テスト メーカー',
        '鉄壁 小テスト ジェネレーター',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: '鉄緑会東大英単語熟語 鉄壁 テスト｜東大・難関大対策',
        description: '東大受験のバイブル「鉄壁」の単語テスト。Section別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/teppeki',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '鉄壁 英単語テスト｜東大・難関大対策',
        description: '東大受験のバイブル「鉄壁」の単語テスト。Section別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/teppeki'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function TeppekiPage() {
    return (
        <TextbookLPTemplate
            textbookName="改訂版 鉄緑会東大英単語熟語 鉄壁"
            textbookNameJa="改訂版 鉄緑会東大英単語熟語 鉄壁"
            publisherName="KADOKAWA"
            themeColor="rose"
            presetTextbook="改訂版 鉄緑会東大英単語熟語 鉄壁"
            canonicalUrl="https://edulens.jp/mistap/textbook/teppeki"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-rose-600 mb-4 tracking-normal">鉄緑会「鉄壁」完全対応</span>
                        東大英単語を<br />
                        <span className="text-rose-500">極限まで効率化</span>
                    </h1>
                ),
                heroDescription: "東大受験生の常識「鉄緑会東大英単語熟語 鉄壁」の無料テスト・クイズアプリ（サイト）。Sectionごとに効率よくアウトプット学習ができ、東大・医学部・早慶レベルの語彙力を盤石にします。",
                testSectionTitle: "鉄壁のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。学習したいSectionを選ぶだけで、誰でも無料で鉄壁の小テストが作れます。<br />
                        <strong>改訂版 鉄緑会東大英単語熟語 鉄壁</strong>を選択してテストを作成してください。
                    </p>
                ),
                featuresTitle: "「鉄壁」の記憶定着を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、鉄壁の豊富な語彙を「テスト形式」で効率的に定着させるためのツールです。<br className="hidden md:inline" />
                        読み込むだけの学習にアウトプットを加えることで、難関大合格に必要な「使える知識」へと昇華させます。
                    </p>
                ),
                feature1: {
                    title: "Section別小テスト",
                    description: "鉄壁のSectionごとにテストが可能。毎日の学習進捗に合わせた確認テストとして最適です。"
                },
                feature2: {
                    title: "派生語・熟語も網羅",
                    description: "見出し語だけでなく、鉄壁の特徴である豊富な派生語や熟語もしっかりカバー（※順次対応拡大中）。"
                },
                feature3: {
                    title: "難関大合格への最短ルート",
                    description: "間違えた単語は自動で「苦手リスト」へ。東大・京大・医学部合格に必要な3000語レベルの語彙を、漏れなく習得できます。"
                }
            }}
        />
    );
}
