import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '特定商取引法に基づく表記',
    robots: {
        index: false,
        follow: false,
    },
};

export default function TokushoPage() {
    return notFound();
}
