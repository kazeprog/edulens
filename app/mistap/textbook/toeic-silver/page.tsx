import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '銀のフレーズ テスト｜無料小テストアプリ - Mistap',
    description: 'TOEIC L&R TEST 出る単特急 銀のフレーズ（銀フレ）対応の無料英単語テスト。TOEIC600点を目指す基礎語彙を小テスト形式で効率よく復習できます。',
    keywords: [
        '銀のフレーズ 単語テスト',
        '銀フレ 単語テスト',
        '銀のフレーズ 小テスト',
        '銀フレ 小テスト',
        '銀のフレーズ アプリ',
        '銀フレ アプリ',
        'TOEIC 単語 アプリ',
        'TOEIC 銀のフレーズ',
        'TOEIC 単語 テスト',
        'TOEIC 基礎単語',
        '出る単特急 銀のフレーズ',
        'TEX加藤 銀のフレーズ'
    ],
    openGraph: {
        title: '銀のフレーズ テスト｜無料小テストアプリ - Mistap',
        description: 'TOEIC L&R TEST 出る単特急 銀のフレーズ（銀フレ）の単語を、無料の小テストやアプリ感覚で復習できます。',
        url: 'https://edulens.jp/mistap/textbook/toeic-silver',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '銀のフレーズ テスト｜無料小テストアプリ - Mistap',
        description: '銀フレの単語を無料の小テストやアプリ感覚で復習できるTOEIC英単語テストです。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/toeic-silver'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function ToeicSilverPage() {
    return (
        <TextbookLPTemplate
            textbookName="銀のフレーズ"
            textbookNameJa="TOEIC L&R 銀のフレーズ"
            publisherName="朝日新聞出版"
            themeColor="silver"
            presetTextbook="TOEIC銀のフレーズ"
            canonicalUrl="https://edulens.jp/mistap/textbook/toeic-silver"
            unitLabel="Level"
            audience="general"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-zinc-700 mb-4 tracking-normal">TOEIC L&R 銀のフレーズ（銀フレ）対応</span>
                        銀フレの英単語テストで<br />
                        <span className="text-slate-500">600点への基礎語彙を定着</span>
                    </h1>
                ),
                heroDescription: "TOEIC L&R TEST 出る単特急 銀のフレーズ（銀フレ）に対応した無料の英単語テスト・学習アプリ感覚ページです。TOEIC600点を目指す基礎単語を小テスト形式で、登録不要ですぐ復習できます。",
                testSectionTitle: "銀フレの英単語テストを無料で作成",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。誰でも無料で銀フレの小テストを作れます。<br />
                        <strong>TOEIC銀のフレーズ</strong>を選択して、英単語テストを始めてください。
                    </p>
                ),
                featuresTitle: "銀フレの暗記効率を最大化",
                featuresDescription: (
                    <p>
                        Mistapは、ただの単語帳アプリではありません。<br className="hidden md:inline" />
                        TOEICの土台になる基本語彙を、小テストとアプリ感覚の学習体験で無理なく定着させるための「英単語テスト作成サイト」です。
                    </p>
                ),
                feature1: {
                    title: "銀フレ対応の小テスト",
                    description: "銀のフレーズに対応した英単語テストをすぐに作成可能。TOEIC基礎単語の定着確認に使えます。"
                },
                feature2: {
                    title: "苦手単語を自動でリスト化",
                    description: "間違えた単語は自動的に保存。あなただけの苦手な英単語帳が作成され、効率的に穴を埋められます。"
                },
                feature3: {
                    title: "アプリ感覚でサクサク復習",
                    description: "スマホ・タブレット完全対応。通勤・通学中の電車やスキマ時間に、アプリ感覚で銀フレをマスターできます。"
                }
            }}
        />
    );
}
