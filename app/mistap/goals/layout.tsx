import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '目標管理 - 学習計画を立てる',
    description: '毎日の学習目標を設定し、継続的な学習習慣を身につけましょう。学習スケジュールの自動生成機能も搭載。',
};

export default function GoalsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
