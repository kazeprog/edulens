import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '英検®英作文 AI添削 | 3級〜1級対応・合格判定 - EduLens',
    description: '英検®（実用英語技能検定）の英作文をAIが即時添削。3級、準2級、2級、準1級、1級に対応。文法、語彙、構成、内容の4観点から採点し、合格判定と改善アドバイスを提供します。',
    openGraph: {
        title: '英検®英作文 AI添削 | 3級〜1級対応・合格判定',
        description: '英検®のライティング対策ならEduLens。最短10秒で模範解答と解説を表示。',
        url: 'https://edulens.jp/writing/eiken-writing',
        siteName: 'EduLens',
        type: 'article',
        images: [
            {
                url: '/EduLensWriting.png',
                width: 1200,
                height: 630,
                alt: '英検英作文AI添削',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '英検®英作文 AI添削 - EduLens',
        description: '3級〜1級対応。AIがあなたの英作文を即時採点！',
        images: ['/EduLensWriting.png'],
    },
};

export default function EikenWritingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "英検®英作文 AI添削",
        "description": "英検®向けのAI英作文添削サービス。全級対応。",
        "provider": {
            "@type": "Organization",
            "name": "EduLens",
            "url": "https://edulens.jp"
        },
        "serviceType": "Educational Service",
        "audience": {
            "@type": "EducationalAudience",
            "educationalRole": "student"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
        }
    };

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
