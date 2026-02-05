import { Metadata } from 'next';
import MathtapHeader from '@/components/mathtap/MathtapHeader';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
    title: {
        template: '%s | Mathtap',
        default: 'Mathtap｜計算問題の練習アプリ',
    },
    description: 'Mathtapは中学生向けの計算問題練習アプリ。四則演算から方程式まで、様々な計算問題に挑戦できます。',
    openGraph: {
        title: 'Mathtap｜計算問題の練習アプリ',
        description: '中学生向けの計算問題練習アプリ。',
        url: 'https://edulens.jp/mathtap',
        siteName: 'Mathtap (EduLens)',
        locale: 'ja_JP',
        type: 'website',
    },
    icons: {
        icon: '/Mathtapicon.png',
        apple: '/Mathtapicon.png',
    },
};

export default function MathtapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <MathtapHeader />
            {children}
        </>
    );
}
