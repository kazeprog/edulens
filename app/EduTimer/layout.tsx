import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'EduTimer - 無料ポモドーロタイマー | 勉強・作業の集中力アップ',
    description: '登録不要・無料で使えるポモドーロタイマー。25分集中＋5分休憩のサイクルで勉強や作業の効率を最大化。受験勉強、資格試験、テレワークに最適。',
    keywords: ['ポモドーロタイマー', 'ポモドーロテクニック', '無料', '勉強', '集中', 'タイマー', 'Webアプリ', '受験', '作業用', 'タイムマネジメント'],
    alternates: {
        canonical: 'https://edulens.jp/EduTimer',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: 'EduTimer - 無料ポモドーロタイマー | 勉強・作業に最適',
        description: '無料で使えるポモドーロタイマー。25分集中・5分休憩で勉強効率UP！受験勉強、資格試験対策におすすめのWebタイマー。',
        url: 'https://edulens.jp/EduTimer',
        type: 'website',
        siteName: 'EduLens',
        locale: 'ja_JP',
        images: [
            {
                url: '/Xcard.png',
                width: 1200,
                height: 630,
                alt: 'EduTimer - 無料ポモドーロタイマー',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EduTimer - 無料ポモドーロタイマー',
        description: '25分集中・5分休憩のポモドーロテクニックで勉強効率UP！無料で使えるWebタイマー。',
        images: ['/Xcard.png'],
    },
};

// 構造化データ（JSON-LD）
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'EduTimer - ポモドーロタイマー',
    description: '無料で使えるポモドーロタイマー。25分集中・5分休憩のポモドーロテクニックで勉強効率UP！',
    url: 'https://edulens.jp/EduTimer',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '120',
    },
    featureList: [
        'ポモドーロテクニック対応',
        'カスタマイズ可能なタイマー設定',
        '集中・休憩の自動切り替え',
        'セッション進捗管理',
        '無料で利用可能',
    ],
};

export default function EduTimerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
