import type { Metadata } from 'next';
import HomeClient from '@/components/mistap/HomeClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Mistap｜間違えた英単語を自動記録する基本無料テストアプリ',
  },
  description: 'Mistapは、英単語テストで間違えた単語を自動記録し、苦手な単語だけを効率よく復習できる基本無料の学習アプリです。中学生の定期テスト対策から高校生の大学受験、資格試験の語彙学習まで幅広く使えます。',
  keywords: ['英単語アプリ', '単語テスト', '英単語テスト 無料', '英単語 暗記', '苦手単語 復習', '大学受験 英単語', '中学生 英単語'],
  alternates: {
    canonical: 'https://edulens.jp/mistap'
  },
  openGraph: {
    title: 'Mistap｜間違えた英単語を自動記録する基本無料テストアプリ',
    description: '間違えた単語だけを自動記録して、効率よく復習できる基本無料の英単語学習アプリ。',
    url: 'https://edulens.jp/mistap',
    type: 'website',
    siteName: 'Mistap (EduLens)',
    images: [
      {
        url: '/MistapLP.png',
        width: 1200,
        height: 630,
        alt: 'Mistap App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mistap｜間違えた英単語を自動記録する基本無料テストアプリ',
    description: '間違えた単語だけを自動記録して、効率よく復習できる英単語学習アプリ。',
    images: ['/MistapLP.png'],
  },
};

export default function MistapPage() {
  return <HomeClient />;
}
