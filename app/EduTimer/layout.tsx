import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'EduTimer - ポモドーロタイマー',
    description: 'ポモドーロテクニックを活用した学習タイマー。25分の集中と5分の休憩を繰り返し、効率的に学習を進めましょう。',
    alternates: {
        canonical: 'https://edulens.jp/EduTimer',
    },
    openGraph: {
        title: 'EduTimer - ポモドーロタイマー | EduLens',
        description: 'ポモドーロテクニックを活用した学習タイマー。25分の集中と5分の休憩を繰り返し、効率的に学習を進めましょう。',
        url: 'https://edulens.jp/EduTimer',
        type: 'website',
        siteName: 'EduLens',
        images: [
            {
                url: '/Xcard.png',
                width: 1200,
                height: 630,
                alt: 'EduTimer - ポモドーロタイマー',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EduTimer - ポモドーロタイマー | EduLens',
        description: 'ポモドーロテクニックを活用した学習タイマー',
        images: ['/Xcard.png'],
    },
};

export default function EduTimerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
