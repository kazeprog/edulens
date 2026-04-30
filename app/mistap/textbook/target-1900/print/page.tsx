import type { Metadata } from 'next';
import Link from 'next/link';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: 'ターゲット1900 テストプリント｜無料小テストアプリ - Mistap',
    description: 'ターゲット1900のテストプリント代わりに使える無料小テストページ。Sectionや番号範囲を指定して確認テストを作成でき、スマホやPCでそのまま反復できます。',
    keywords: [
        'ターゲット1900 テストプリント',
        'ターゲット1900 テストプリント 無料',
        'ターゲット1900 プリント',
        'ターゲット1900 確認テスト',
        'ターゲット1900 小テスト',
        'ターゲット1900 テスト',
        'ターゲット1900 単語テスト',
        '英単語ターゲット1900 テスト',
        'Target 1900 test',
    ],
    openGraph: {
        title: 'ターゲット1900 テストプリント｜無料小テストアプリ - Mistap',
        description: 'ターゲット1900の範囲指定テストを無料で作成。プリント代わりの確認テストや自習に使えます。',
        url: 'https://edulens.jp/mistap/textbook/target-1900/print',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ターゲット1900 テストプリント｜無料小テストアプリ - Mistap',
        description: 'ターゲット1900の小テストを範囲指定で作成。プリント代わりに無料で使えます。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/target-1900/print',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function Target1900PrintPage() {
    return (
        <TextbookLPTemplate
            textbookName="Target 1900"
            textbookNameJa="英単語ターゲット1900"
            publisherName="旺文社"
            themeColor="blue"
            presetTextbook="ターゲット1900"
            canonicalUrl="https://edulens.jp/mistap/textbook/target-1900/print"
            unitLabel="Section"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">ターゲット1900のテストプリント代わりに</span>
                        範囲指定で<br />
                        <span className="text-blue-500">無料小テストをすぐ作成</span>
                    </h1>
                ),
                heroDescription: "英単語ターゲット1900の確認テストを、Sectionや番号範囲で指定して作れます。紙のプリントを探す代わりに、スマホやPCでそのまま解いて、学校の小テスト対策や入試前の総復習に使えます。",
                heroSecondaryCta: (
                    <Link
                        href="/mistap/textbook/target-1900"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 border-2 border-blue-200 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        ターゲット1900通常ページへ
                    </Link>
                ),
                testSectionTitle: "ターゲット1900の確認テストを無料で作成",
                testSectionDescription: (
                    <p>
                        Sectionや番号範囲を選ぶだけで、ターゲット1900の小テストをすぐ作れます。<br />
                        <strong>英単語ターゲット1900</strong>を選択して、プリント代わりの確認テストを始めてください。
                    </p>
                ),
                featuresTitle: "プリントを探さず、今の範囲だけを反復",
                featuresDescription: (
                    <p>
                        Mistapはターゲット1900を覚えるための無料小テストアプリです。<br className="hidden md:inline" />
                        範囲を細かく区切れるので、授業の進度や自分の苦手範囲に合わせて確認できます。
                    </p>
                ),
                feature1: {
                    title: "番号範囲で指定できる",
                    description: "1-100、101-200のように、今覚えたい範囲だけを切り出してテストできます。",
                },
                feature2: {
                    title: "プリント代わりにそのまま解ける",
                    description: "印刷用PDFを探さなくても、ブラウザ上で確認テストを実施できます。スマホでもPCでも使えます。",
                },
                feature3: {
                    title: "間違えた単語を復習しやすい",
                    description: "登録すると、間違えた単語を保存して後から復習できます。自分専用の弱点リストとして使えます。",
                },
                extraFaqs: [
                    {
                        question: "ターゲット1900のテストプリントを印刷できますか？",
                        answer: "Mistapはブラウザ上で解く小テスト形式です。紙に印刷するプリントではありませんが、範囲指定してすぐ確認テストを実施できるため、プリント代わりの自習や小テスト対策に使えます。",
                    },
                    {
                        question: "学校の小テスト範囲に合わせられますか？",
                        answer: "はい、Sectionや番号範囲を指定できるので、学校で指定された範囲だけを確認できます。",
                    },
                ],
            }}
        />
    );
}
