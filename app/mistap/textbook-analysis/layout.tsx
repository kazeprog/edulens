import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '教科書分析 - 学習データ詳細',
    description: '単語帳ごとの詳細な学習データを分析。よく間違える単語や平均正答率を確認して、効率的な復習計画に役立てましょう。',
};

export default function TextbookAnalysisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
