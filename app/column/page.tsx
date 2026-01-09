import Link from "next/link";
import { blogClient } from "@/lib/mistap/microcms";
import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// メタデータ
export const metadata: Metadata = {
    title: "コラム | EduLens",
    description: "EduLensの公式コラム。効果的な学習方法や試験対策情報を発信します。",
    openGraph: {
        title: "コラム | EduLens",
        description: "EduLensの公式コラム。効果的な学習方法や試験対策情報を発信します。",
        type: "website",
        url: "https://edulens.jp/column",
    },
    twitter: {
        card: "summary_large_image",
        title: "コラム | EduLens",
        description: "EduLensの公式コラム。効果的な学習方法や試験対策情報を発信します。",
    },
};

// microCMSの型定義
export interface EduLensColumn {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title: string;
    content: string;
    eyecatch?: {
        url: string;
        height: number;
        width: number;
    };
    category?: {
        id: string;
        name: string;
    };
}

// ページのキャッシュ設定
export const revalidate = 360;

async function getAllColumns() {
    const limit = 100;
    let offset = 0;
    let allContents: EduLensColumn[] = [];

    try {
        while (true) {
            const data = await blogClient.getList<EduLensColumn>({
                endpoint: "blogs",
                queries: {
                    orders: "-publishedAt",
                    limit,
                    offset,
                },
            });

            allContents = [...allContents, ...data.contents];

            if (allContents.length >= data.totalCount) {
                break;
            }

            offset += limit;
        }
    } catch (error) {
        console.error("Failed to fetch EduLens columns:", error);
        return [];
    }

    return allContents;
}

// ページ本体 (サーバーコンポーネント)
export default async function ColumnPage() {
    const posts = await getAllColumns();

    return (
        <>
            <SiteHeader />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-5xl mx-auto p-4 md:p-8">
                    <div className="bg-white rounded-3xl p-8 mb-12 shadow-sm border border-slate-100">
                        <h1 className="text-3xl font-bold text-slate-800 mb-4">EduLens コラム</h1>
                        <p className="text-slate-600">
                            学習のヒントや最新情報をお届けします。
                        </p>
                    </div>

                    {!posts.length && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                            <p className="text-slate-500">記事がまだありません。</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/column/${post.id}`}
                                prefetch={false}
                                className="group block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                <div className="aspect-[1200/630] relative bg-slate-100 overflow-hidden">
                                    {post.eyecatch ? (
                                        <Image
                                            src={post.eyecatch.url}
                                            alt={post.title}
                                            width={post.eyecatch.width}
                                            height={post.eyecatch.height}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <p className="text-xs text-slate-500 mb-2">
                                        {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                                    </p>
                                    <h2 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
