import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'ターゲット1200 英単語テスト｜高校基礎の英単語を無料で小テスト',
    description: '英単語ターゲット1200対応の無料英単語テスト。Sectionごとに高校基礎レベルの重要単語を確認でき、共通テストに向けた土台作りにも役立ちます。',
    keywords: [
        'ターゲット1200 単語テスト',
        '英単語ターゲット1200 単語テスト',
        'ターゲット1200 小テスト',
        'ターゲット1200 アプリ',
        '英単語ターゲット1200 アプリ',
        '高校 英単語 アプリ',
        'Target 1200',
        '高校基礎 英単語',
        '共通テスト 英単語',
        'ターゲット1200 Section',
        'ターゲット1200 無料',
        '英単語 テスト 高校基礎',
        '旺文社 ターゲット1200'
    ],
    openGraph: {
        title: 'ターゲット1200 英単語テスト｜高校基礎の英単語を無料で小テスト',
        description: '英単語ターゲット1200の重要単語を、Sectionごとの無料小テストやアプリ感覚で復習できます。',
        url: 'https://edulens.jp/mistap/textbook/target-1200',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/MistapLP.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1200 英単語テスト｜高校基礎の英単語を無料で小テスト',
        description: 'ターゲット1200の単語をSectionごとの小テストやアプリ感覚で復習できる無料英単語テストです。',
        images: ['/MistapLP.png'],
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
            themeColor="yellow"
            presetTextbook="ターゲット1200"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1200"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-yellow-600 mb-4 tracking-normal">英単語ターゲット1200対応</span>
                        高校基礎英単語を<br />
                        <span className="text-yellow-500">小テストで着実に定着</span>
                    </h1>
                ),
                heroDescription: "高校英語の基礎固めに使える「英単語ターゲット1200」対応の無料英単語テスト・学習アプリ感覚ページです。Sectionごとに重要単語を確認でき、登録不要ですぐ復習を始められます。",
                testSectionTitle: "ターゲット1200の英単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Sectionを選ぶだけで、誰でも無料でターゲット1200の小テストが作れます。<br />
                        <strong>英単語ターゲット1200</strong>を選択して英単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "ターゲット1200の暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        高校英語の基礎を固め、大学受験の土台を作るための「英単語テスト作成サイト」です。アプリ感覚で気軽に続けられます。
                    </p>
                ),
                feature1: {
                    title: "Section別小テスト",
                    description: "ターゲット1200のSection順でテストが可能。学校の小テスト対策から基礎固めまで使えます。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの「苦手な英単語帳」が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通学中の電車やスキマ時間に、アプリ感覚で基礎単語をマスターできます。"
                }
            }}
        />
    );
}
