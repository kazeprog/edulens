import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'テスト結果 - 振り返りと分析',
  description: '英単語テストの結果詳細と間違えた単語の確認ができます。結果をSNSでシェアして学習のモチベーションを高めましょう。',
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
