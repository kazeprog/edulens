import { Metadata } from 'next';
import ClientHeader from '@/components/mistap/ClientHeader';
import AddToHomePrompt from '@/components/mistap/AddToHomePrompt';

export const metadata: Metadata = {
  title: {
    template: '%s | Mistap',
    default: 'Mistap - 間違えた単語に集中する学習システム',
  },
  description: '間違えた単語を自動で記録し、効率的に復習できる単語学習システム。',
};

export default function MistapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientHeader />
      <AddToHomePrompt />
      {children}
    </>
  );
}