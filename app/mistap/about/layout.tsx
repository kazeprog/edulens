import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mistapとは - コンセプトと機能',
    description: 'システム英単語、ターゲット1900、LEAPなど主要な単語帳に対応した英単語学習システム。忘却曲線に基づいた効率的な復習で、確実な暗記をサポートします。',
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
