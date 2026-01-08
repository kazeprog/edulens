import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '大学入試英作文 AI添削 | 自由英作文・和文英訳対応 - EduLens',
    description: '大学入試の英作文（自由英作文・和文英訳）をAIが厳格に添削。難関国公立・私立大学の出題傾向に合わせた採点基準で、論理的思考力と表現力を鍛えます。',
    openGraph: {
        title: '大学入試英作文 AI添削 | 自由英作文・和文英訳対応',
        description: '志望校合格へ。大学入試の英作文対策ならEduLens。AIが厳しく添削。',
        url: 'https://edulens.jp/writing/university',
        siteName: 'EduLens',
        type: 'article',
        images: [
            {
                url: '/EduLensWriting.png',
                width: 1200,
                height: 630,
                alt: '大学入試英作文AI添削',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '大学入試英作文 AI添削 - EduLens',
        description: '自由英作文・和文英訳対応。難関大レベルの採点基準でフィードバック。',
        images: ['/EduLensWriting.png'],
    },
};

export default function UniversityWritingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "大学入試英作文 AI添削",
        "description": "大学受験向けのAI英作文添削サービス。自由英作文・和文英訳対応。",
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
