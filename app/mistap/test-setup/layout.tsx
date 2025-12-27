import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'テスト作成 - 自分だけの問題集',
    description: '対応教材から出題範囲を選択して、オリジナルの単語テストを作成できます。苦手な単語だけの復習テストも作成可能。',
};

export default function TestSetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
