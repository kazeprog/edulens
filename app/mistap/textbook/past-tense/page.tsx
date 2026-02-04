import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '不規則動詞の過去形 対応テスト｜中学英語 基礎 無料',
    description: '英語の不規則動詞の過去形をマスターするための無料テスト・クイズ。中学・高校入試に必須の動詞活用を効率よく学習できます。',
    keywords: [
        '不規則動詞 過去形',
        '動詞 活用 テスト',
        '中学英語 過去形',
        '不規則動詞 一覧 テスト',
        '英語 基礎 暗記',
    ],
    openGraph: {
        title: '不規則動詞の過去形 対応テスト｜中学生・無料',
        description: '不規則動詞の過去形を完璧に。Mistapで効率的な暗記学習。',
        url: 'https://edulens.jp/mistap/textbook/past-tense',
        type: 'website',
        siteName: 'Mistap 英語テスト',
    }
};

export default function PastTensePage() {
    return (
        <TextbookLPTemplate
            textbookName="過去形"
            textbookNameJa="不規則動詞の過去形"
            publisherName="基礎"
            themeColor="blue"
            presetTextbook="過去形"
            canonicalUrl="https://edulens.jp/mistap/textbook/past-tense"
            audience="junior"
            bookType="wordbook"
            overrideCoverTitle="不規則動詞 過去形"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">不規則動詞の過去形</span>
                        動詞の活用を<br />
                        <span className="text-blue-500">完璧にマスター</span>
                    </h1>
                ),
                heroDescription: "中学生が必ず覚えるべき不規則動詞の過去形テスト。クイズ形式で繰り返し練習できます。登録不要で今すぐスタート！",
                testSectionTitle: "過去形のテスト作成",
                testSectionDescription: "範囲を選んで「過去形」のテストを作成しましょう。",
                feature1: {
                    title: "主要な動詞を網羅",
                    description: "become, bring, cut, seeなど、入試に頻出する主要な不規則動詞をすべて収録。"
                }
            }}
        />
    );
}
