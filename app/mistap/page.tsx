import type { Metadata } from 'next';
import HomeClient from '@/components/mistap/HomeClient';

export const metadata: Metadata = {
  title: 'Mistap｜英単語帳対応の無料単語テストアプリ（間違えた単語を自動記録）',
  description: 'Mistapはシステム英単語・ターゲット1900などの主要単語帳や、New Horizon・New Crownなどの中学教科書に対応した無料単語テストアプリ。間違えた単語を自動記録し、効率的に復習できます。スマホで使える暗記カードとして、大学受験や定期テスト対策に最適。',
  keywords: ['英単語アプリ', '単語テスト', 'システム英単語 アプリ', 'ターゲット1900 アプリ', '無料', '暗記', 'New Horizon'],
  alternates: {
    canonical: 'https://edulens.jp/mistap'
  },
  openGraph: {
    title: 'Mistap｜英単語帳対応の無料単語テストアプリ',
    description: '間違えた単語を自動記録して効率的に暗記できる学習システム。シス単・ターゲット・教科書に対応。',
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
    title: 'Mistap｜英単語帳対応の単語テストアプリ',
    description: '間違えた単語を自動記録。システム英単語・ターゲット対応。',
    images: ['/MistapLP.png'],
  },
};

export default function MistapPage() {
  return <HomeClient />;
}