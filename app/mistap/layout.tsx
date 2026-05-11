import { Metadata } from 'next';
import ClientHeader from '@/components/mistap/ClientHeader';

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Mistap｜間違えた単語に集中できる英単語テストアプリ',
  },
  description: 'Mistapは英単語テストで間違えた単語を自動記録し、苦手な単語だけを効率よく復習できる基本無料の学習アプリです。大学受験、定期テスト、資格試験の語彙学習に使えます。',
  keywords: [
    '英単語テスト 無料',
    '英単語アプリ 高校生',
    '苦手単語 復習',
    '英単語 暗記 アプリ',
    '英単語 小テスト',
    '大学受験 英単語 アプリ',
    '中学生 英単語 アプリ',
    '定期テスト 英単語',
    '資格試験 英単語',
    '英単語 クイズ 高校生',
    'Mistap',
    'ミスタップ'
  ],
  openGraph: {
    title: 'Mistap｜間違えた単語に集中できる英単語テストアプリ',
    description: '間違えた単語を自動で記録し、効率的に復習できる基本無料の英単語学習システム。',
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
    "description": "間違えた単語を自動で記録し、効率的に復習できる基本無料の単語学習システム。",
    "screenshot": "https://edulens.jp/MistapLP.png"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientHeader />
      {children}
    </>
  );
}


