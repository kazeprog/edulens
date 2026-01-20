import { Metadata } from 'next';
import ClientHeader from '@/components/mistap/ClientHeader';
import AddToHomePrompt from '@/components/mistap/AddToHomePrompt';

export const metadata: Metadata = {
  title: {
    template: '%s | Mistap',
    default: 'Mistap - 間違えた単語だけ復習する学習アプリ',
  },
  description: '間違えた単語を自動で記録し、効率的に復習できる単語学習システム。システム英単語、ターゲット1900、DUO3.0など主要な単語帳に対応。',
  keywords: ['英単語', '学習アプリ', '大学受験', '高校受験', '英語学習', 'Mistap', 'ミスタップ', '間違えた単語'],
  openGraph: {
    title: 'Mistap - 間違えた単語だけ復習',
    description: '間違えた単語を自動で記録し、効率的に復習できる単語学習システム。効率的な英語学習をサポートします。',
    url: 'https://edulens.jp/mistap',
    siteName: 'EduLens',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/MistapLP.png',
        width: 1200,
        height: 630,
        alt: 'Mistap - 間違えた単語に集中する学習システム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mistap - 間違えた単語だけ復習',
    description: '間違えた単語を自動で記録し、効率的に復習できる単語学習システム。',
    images: ['/MistapLP.png'],
  },
  manifest: '/mistap/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mistap',
  },
  applicationName: 'Mistap',
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


