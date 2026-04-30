import type { Metadata } from 'next';
import Link from 'next/link';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: 'LEAP アプリ｜無料小テストアプリ - Mistap',
    description: 'LEAPをスマホで覚えるための無料小テストアプリ。Partごとの単語テストを登録不要で試せて、通学中やスキマ時間にアプリ感覚で反復できます。',
    keywords: [
        'LEAP アプリ',
        'LEAP 英単語アプリ',
        'LEAP 単語帳 アプリ',
        'LEAP アプリ 無料',
        'LEAP 単語テスト',
        'LEAP 小テスト',
        'リープ アプリ',
        'リープ 英単語アプリ',
        '必修英単語LEAP アプリ',
        '英単語 アプリ 高校生',
    ],
    openGraph: {
        title: 'LEAP アプリ｜無料小テストアプリ - Mistap',
        description: 'LEAPの単語をスマホで反復。Part別の無料小テストをアプリ感覚で使えます。',
        url: 'https://edulens.jp/mistap/textbook/leap/app',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LEAP アプリ｜無料小テストアプリ - Mistap',
        description: 'LEAPの単語をスマホで反復。Part別の無料小テストをアプリ感覚で使えます。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/leap/app',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function LeapAppPage() {
    return (
        <TextbookLPTemplate
            textbookName="LEAP"
            textbookNameJa="LEAP"
            publisherName="数研出版"
            themeColor="sky"
            presetTextbook="LEAP"
            canonicalUrl="https://edulens.jp/mistap/textbook/leap/app"
            unitLabel="Part"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-sky-600 mb-4 tracking-normal">LEAPをスマホで覚える無料小テストアプリ</span>
                        Part別に<br />
                        <span className="text-sky-500">アプリ感覚で反復</span>
                    </h1>
                ),
                heroDescription: "必修英単語LEAPを覚えるための無料小テストアプリ感覚ページです。Partごとに範囲を選んで、通学中やスキマ時間にスマホで反復できます。登録不要で今すぐテストを試せます。",
                heroSecondaryCta: (
                    <Link
                        href="/mistap/textbook/leap"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-sky-700 border-2 border-sky-200 rounded-xl font-bold text-lg shadow-lg shadow-sky-100 hover:bg-sky-50 hover:border-sky-300 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        LEAP通常ページへ
                    </Link>
                ),
                testSectionTitle: "LEAPの単語テストをアプリ感覚で始める",
                testSectionDescription: (
                    <p>
                        面倒な会員登録は不要。Partや番号範囲を選ぶだけで、LEAPの小テストをすぐ作れます。<br />
                        <strong>LEAP</strong>を選択して、スマホで反復練習を始めてください。
                    </p>
                ),
                featuresTitle: "LEAPを覚えるためのスマホ向け反復練習",
                featuresDescription: (
                    <p>
                        MistapはLEAPを「読んで終わり」にしないための無料小テストアプリです。<br className="hidden md:inline" />
                        Part別に区切って、覚えたつもりの単語をテスト形式で確認できます。
                    </p>
                ),
                feature1: {
                    title: "Part別に小さく回せる",
                    description: "LEAPのPartごとに範囲を分けて、今進めている範囲だけを反復できます。",
                },
                feature2: {
                    title: "スマホでアプリ感覚に使える",
                    description: "インストール不要でブラウザから使えます。通学中や休み時間にも、すぐ単語テストを始められます。",
                },
                feature3: {
                    title: "苦手単語を後から復習",
                    description: "登録すると、間違えた単語を保存して後から見直せます。LEAPの弱点つぶしに使えます。",
                },
                extraFaqs: [
                    {
                        question: "LEAP専用のアプリとして使えますか？",
                        answer: "はい、LEAPの範囲を選んで単語テストを作れるため、LEAPを覚えるための無料小テストアプリ感覚で使えます。インストールは不要で、スマホのブラウザから利用できます。",
                    },
                    {
                        question: "LEAPをPartごとに練習できますか？",
                        answer: "はい、Partごとに範囲を指定してテストできます。学校や自分の進度に合わせて、必要な範囲だけを反復できます。",
                    },
                ],
            }}
        />
    );
}
