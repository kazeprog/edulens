import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '不規則動詞の過去形・過去分詞形 対応テスト｜中学英語 基礎 無料',
    description: '不規則動詞の過去形と過去分詞形をセットでマスター。現在完了形や受け身に必須の活用を効率よく学習できます。',
    keywords: [
        '不規則動詞 過去分詞',
        '動詞 活用 テスト',
        '中学英語 過去分詞',
        '過去形 過去分詞 覚え方',
        '英語 完了形 基礎',
    ],
    openGraph: {
        title: '不規則動詞の過去形・過去分詞形 対応テスト｜中学生・無料',
        description: '不規則動詞の過去形・過去分詞形を完璧に。',
        url: 'https://edulens.jp/mistap/textbook/past-participle',
        type: 'website',
        siteName: 'Mistap 英語テスト',
    }
};

export default function PastParticiplePage() {
    return (
        <TextbookLPTemplate
            textbookName="過去形、過去分詞形"
            textbookNameJa="不規則動詞の過去分詞形"
            publisherName="基礎"
            themeColor="indigo"
            presetTextbook="過去形、過去分詞形"
            canonicalUrl="https://edulens.jp/mistap/textbook/past-participle"
            audience="junior"
            bookType="wordbook"
            overrideCoverTitle="過去形・過去分詞形"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-indigo-600 mb-4 tracking-normal">不規則動詞 過去・過去分詞</span>
                        3つの形を<br />
                        <span className="text-indigo-500">一度に攻略する</span>
                    </h1>
                ),
                heroDescription: "現在完了形や受け身（受動態）の学習に欠かせない、不規則動詞の過去分詞形テスト。クイズ形式で確実に定着させましょう。",
                testSectionTitle: "過去分詞形のテスト作成",
                testSectionDescription: "「過去形・過去分詞形」のセットでテストを作成できます。",
                feature1: {
                    title: "完了形・受け身対策",
                    description: "入試で正答率が下がりやすい過去分詞形を、重点的にトレーニングできます。"
                }
            }}
        />
    );
}
