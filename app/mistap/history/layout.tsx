import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '学習履歴 - 過去の成績を確認',
    description: 'これまでのテスト結果や学習の推移を確認できます。間違えた単語の復習もここから行えます。',
};

export default function HistoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
