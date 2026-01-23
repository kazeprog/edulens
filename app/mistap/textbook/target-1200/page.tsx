import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1200（Target 1200）英単語テスト｜高校基礎・共通テスト 無料',
    description: '高校英語の基礎固め「英単語ターゲット1200」対応の英単語テスト。Part/Sectionごとの頻出単語を無料でテストできます。高校入学〜共通テスト対策に最適。',
    keywords: [
        'ターゲット1200',
        '英単語ターゲット1200',
        'Target 1200',
        'ターゲット1200 テスト',
        '高校基礎 英単語',
        '共通テスト 英単語',
        '旺文社 英単語',
        '英単語 アプリ 高校生',
        'ターゲット 練習',
        'ターゲット1200 一覧',
        'ターゲット1200 Section',
        'ターゲット1200 Part',
        'ターゲット1200 無料',
        '英単語 テスト 高校1年生',
        '英単語 クイズ 基礎',
        '英単語 テスト 作成',
        '英単語 テスト 無料',
        '英単語 クイズ サイト'
    ],
    openGraph: {
        title: 'ターゲット1200 英単語テスト｜高校基礎・無料',
        description: '高校基礎の定番「英単語ターゲット1200」の単語テスト。Section別に無料で練習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1200',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1200 英単語テスト｜高校基礎・無料',
        description: '高校基礎の定番「英単語ターゲット1200」の単語テスト。Section別に無料で練習できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1200'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function Target1200Page() {
    return (
        <TextbookLPTemplate
            textbookName="Target 1200"
            textbookNameJa="英単語ターゲット1200"
            publisherName="旺文社"
            themeColor="emerald"
            presetTextbook="ターゲット1200"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1200"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-emerald-600 mb-4 tracking-normal">ターゲット1200（Target1200）テスト完全対応</span>
                        高校基礎英単語を<br />
                        <span className="text-emerald-500">ゲーム感覚で完全攻略</span>
                    </h1>
                ),
                heroDescription: "高校英語の基礎固め「英単語ターゲット1200」の無料テスト・クイズアプリ（サイト）。Part/Sectionごとに小テストを作成でき、定期テストや共通テスト基礎の対策に最適です。登録不要で今すぐテスト作成・実施が可能！",
                testSectionTitle: "ターゲット1200のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。PartやSectionを選ぶだけで、誰でも無料でターゲット1200の小テストが作れます。<br />
                        選択肢から「教科書テスト」を選んで、<strong>英単語ターゲット1200</strong>を選択してください。
                    </p>
                ),
                featuresTitle: "ターゲット1200の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        高校英語の基礎を固め、大学受験の土台を作るための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "Part・Section別小テスト",
                    description: "ターゲット1200の目次通りの順番でテストが可能。学校の小テスト対策から、日常学習の確認まで対応しています。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、ゲーム感覚で基礎単語をマスターできます。"
                }
            }}
        />
    );
}
