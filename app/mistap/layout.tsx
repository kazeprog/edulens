import { Metadata } from 'next';
import ClientHeader from '@/components/mistap/ClientHeader';
import AddToHomePrompt from '@/components/mistap/AddToHomePrompt';

export const metadata: Metadata = {
  title: {
    template: '%s | Mistap',
    default: 'Mistap｜間違えた単語に集中できる英単語テストアプリ',
  },
  description: 'Mistapはシステム英単語・ターゲット1900・New Horizonなどに対応した無料単語テストアプリ。間違えた単語を自動記録し、効率的に復習できます。大学受験や定期テスト対策に最適。',
  keywords: [
    '英単語テスト 無料',
    '英単語アプリ 高校生',
    'システム英単語 テスト',
    'ターゲット1900 テスト',
    'New Horizon 単語テスト',
    '教科書 単語 テスト',
    '大学受験 英単語 アプリ',
    '古文単語 アプリ',
    'システム英単語 無料 テスト',
    'ターゲット1900 単語テスト',
    'New Horizon 単語テスト 無料',
    '古文単語 315 テスト',
    '英単語 クイズ 高校生',
    '英単語 暗記 アプリ 無料',
    'Mistap',
    'ミスタップ'
  ],
  openGraph: {
    title: 'Mistap｜間違えた単語に集中できる英単語テストアプリ',
    description: '間違えた単語を自動で記録し、効率的に復習できる無料単語学習システム。システム英単語、ターゲット、教科書に対応。',
    url: 'https://edulens.jp/mistap',
    siteName: 'Mistap (EduLens)',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://edulens.jp/MistapLP.png',
        width: 1200,
        height: 630,
        alt: 'Mistap - 間違えた単語に集中する学習システム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mistap｜間違えた単語に集中できる英単語テストアプリ',
    description: '間違えた単語を自動で記録し、効率的に復習できる無料単語学習システム。',
    images: ['https://edulens.jp/MistapLP.png'],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mistap",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "description": "間違えた単語を自動で記録し、効率的に復習できる単語学習システム。システム英単語、ターゲット1900、New Horizonなど主要な単語帳に対応。",
    "screenshot": "https://edulens.jp/MistapLP.png"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientHeader />
      <AddToHomePrompt />
      {children}
    </>
  );
}


