import { blogClient } from "@/lib/mistap/microcms";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import GoogleAdsense from "@/components/GoogleAdsense";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { EduLensColumn } from "../page";

export const revalidate = 86400;

type Props = {
    params: Promise<{
        id: string;
    }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getPostById(id: string, draftKey?: string) {
    try {
        const queries: { draftKey?: string } = {};
        if (draftKey) {
            queries.draftKey = draftKey;
        }

        const post = await blogClient.getListDetail<EduLensColumn>({
            endpoint: "blogs",
            contentId: id,
            queries,
        });

        return post;
    } catch (error) {
        console.error('Failed to fetch EduLens post:', error);
        return null;
    }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { id } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const draftKey = typeof resolvedSearchParams.draftKey === 'string' ? resolvedSearchParams.draftKey : undefined;

    const post = await getPostById(id, draftKey);

    if (!post) {
        return {
            title: "コラムが見つかりません | EduLens",
        };
    }

    const description = post.content.replace(/<[^>]*>/g, "").trim().substring(0, 160);
    const imageUrl = post.eyecatch?.url || "https://edulens.jp/Xcard.png";

    return {
        title: `${post.title} | コラム`,
        description: description,
        openGraph: {
            title: post.title,
            description: description,
            type: "article",
            url: `https://edulens.jp/column/${id}`,
            images: [
                {
                    url: imageUrl,
                    width: post.eyecatch?.width || 1200,
                    height: post.eyecatch?.height || 630,
                    alt: post.title,
                },
            ],
        },
    };
}

// 関連記事取得
async function getRecommendedPosts(currentId: string) {
    try {
        const data = await blogClient.getList<EduLensColumn>({
            endpoint: "blogs",
            queries: {
                orders: "-publishedAt",
                limit: 3,
                filters: `id[not_equals]${currentId}`,
                fields: "id,title,publishedAt,eyecatch",
            },
        });
        return data.contents;
    } catch (error) {
        console.error("Failed to fetch recommended posts:", error);
        return [];
    }
}

export default async function BlogPostPage({ params, searchParams }: Props) {
    const { id } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const draftKey = typeof resolvedSearchParams.draftKey === 'string' ? resolvedSearchParams.draftKey : undefined;

    // 並列取得
    const [post, recommendedPosts] = await Promise.all([
        getPostById(id, draftKey),
        getRecommendedPosts(id),
    ]);

    if (!post) {
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto p-4 md:p-8">
                    <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 mb-12">
                        {post.eyecatch && (
                            <div className="aspect-[1200/630] relative rounded-2xl overflow-hidden mb-8">
                                <Image
                                    src={post.eyecatch.url}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4 leading-relaxed">
                            {post.title}
                        </h1>

                        <div className="flex items-center text-slate-500 text-sm mb-12 border-b border-slate-100 pb-8">
                            <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                            {post.category && (
                                <span className="ml-4 bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                                    {post.category.name}
                                </span>
                            )}
                        </div>

                        <div
                            className="prose lg:prose-lg max-w-none prose-slate prose-img:rounded-xl prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-800"
                            dangerouslySetInnerHTML={{
                                __html: post.content,
                            }}
                        />
                    </article>

                    {/* 記事読み終わり直後の広告 */}
                    <GoogleAdsense />

                    {/* おすすめの記事セクション */}
                    {recommendedPosts.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">おすすめのコラム</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {recommendedPosts.map((post) => (
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
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs text-slate-500 mb-2">
                                                {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                                            </p>
                                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            href="/column"
                            prefetch={false}
                            className="inline-flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            コラム一覧に戻る
                        </Link>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </>
    );
}

export async function generateStaticParams() {
    try {
        const data = await blogClient.getList<EduLensColumn>({
            endpoint: "blogs",
            queries: { fields: "id" },
        });
        return data.contents.map((post) => ({ id: post.id }));
    } catch (error) {
        return [];
    }
}
