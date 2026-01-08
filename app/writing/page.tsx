import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react"
import type { Metadata } from 'next'

import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"

export const metadata: Metadata = {
    title: 'AI英作文添削 - EduLens | 英検・大学入試対応',
    description: '最短10秒でAIが英作文を添削。英検®や大学入試の自由英作文・和文英訳に対応。経験豊富な予備校講師レベルのフィードバックで合格力を高めます。',
    openGraph: {
        title: 'AI英作文添削 - EduLens | 英検・大学入試対応',
        description: '最短10秒でAIが英作文を添削。英検®や大学入試の自由英作文・和文英訳に対応。',
        url: 'https://edulens.jp/writing',
        siteName: 'EduLens',
        type: 'website',
        images: [
            {
                url: '/EduLensWriting.png',
                width: 1200,
                height: 630,
                alt: 'EduLens AI Writing',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI英作文添削 - EduLens',
        description: '最短10秒でAIが英作文を添削。英検®や大学入試に対応。',
        images: ['/EduLensWriting.png'],
    },
};

export default function WritingHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "EduLens AI英作文添削",
        "description": "英検・大学入試対策に特化したAI英作文添削サービス。",
        "provider": {
            "@type": "Organization",
            "name": "EduLens",
            "url": "https://edulens.jp"
        },
        "areaServed": "JP",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "英作文添削コース",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "英検®対策コース",
                        "description": "3級〜1級対応。論理構成と語彙を強化。"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "大学受験対策コース",
                        "description": "志望校別傾向対策。自由英作文・和文英訳対応。"
                    }
                }
            ]
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SiteHeader />
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            AI英作文添削
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            目的に合わせたコースを選択してください。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Eiken Writing */}
                        <Link
                            href="/writing/eiken-writing"
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                英検®対策
                            </h2>
                            <p className="text-gray-500 mb-6 flex-grow">
                                3級から1級まで対応。<br />
                                面接対策にも役立つ論理構成を学べます。
                            </p>
                            <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                添削を始める <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </Link>

                        {/* University Exam Writing */}
                        <Link
                            href="/writing/university"
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-slate-700 transition-colors">
                                大学受験対策
                            </h2>
                            <p className="text-gray-500 mb-6 flex-grow">
                                志望校の傾向に合わせた厳格な採点。<br />
                                難関大合格に向けた論理構成を指導します。
                            </p>
                            <span className="inline-flex items-center text-slate-600 font-semibold group-hover:translate-x-1 transition-transform">
                                添削を始める <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    )
}
