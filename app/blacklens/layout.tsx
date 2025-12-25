import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'BlackLens - 勉強のストレスを吐き出すコメントボード | EduLens',
    description: '受験勉強のストレスや悩みを匿名で吐き出せるコメントボード。「わかる」「エール」のリアクションで同じ悩みを持つ仲間とつながれます。勉強・受験・人間関係・進路など、誰にも言えない本音を共有できる場所。',
    keywords: [
        '受験 ストレス',
        '勉強 悩み',
        '受験生 掲示板',
        '匿名 相談',
        '勉強 辛い',
        '受験 不安',
        '高校受験 ストレス',
        '大学受験 悩み',
    ],
    alternates: {
        canonical: 'https://edulens.jp/blacklens',
    },
    openGraph: {
        title: 'BlackLens - 勉強のストレスを吐き出すコメントボード',
        description: '受験勉強のストレスや悩みを匿名で吐き出せるコメントボード。誰にも言えない本音を共有できる場所。',
        url: 'https://edulens.jp/blacklens',
        type: 'website',
        siteName: 'EduLens',
        images: [
            {
                url: '/BlacklensSquare.png',
                width: 512,
                height: 512,
                alt: 'BlackLens',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'BlackLens - 勉強のストレスを吐き出すコメントボード',
        description: '受験勉強のストレスや悩みを匿名で吐き出せるコメントボード。',
        images: ['/BlacklensSquare.png'],
    },
};

export default function BlackLensLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
