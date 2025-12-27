import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ホーム - 学習の進捗を確認',
    description: 'Mistapのホーム画面です。学習の進捗状況や今日の目標、最近の成績を確認できます。',
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
