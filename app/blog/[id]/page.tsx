import { blogClient } from "@/lib/mistap/microcms";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { EduLensBlog } from "../page";

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

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

        const post = await blogClient.getListDetail<EduLensBlog>({
            endpoint: "blogs",
            contentId: id,
            queries,
            customRequestInit: {
                cache: 'no-store',
            },
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
            title: "記事が見つかりません | EduLens",
        };
    }

    return {
        title: `${post.title} | EduLens ブログ`,
        description: post.content.replace(/<[^>]*>/g, "").substring(0, 160),
        openGraph: {
            title: post.title,
            type: "article",
            url: `https://edulens.jp/blog/${id}`,
            images: [
                {
                    url: post.eyecatch?.url || "https://edulens.jp/Xcard.png",
                    width: post.eyecatch?.width || 1200,
                    height: post.eyecatch?.height || 630,
                },
            ],
        },
    };
}

export default async function BlogPostPage({ params, searchParams }: Props) {
    const { id } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const draftKey = typeof resolvedSearchParams.draftKey === 'string' ? resolvedSearchParams.draftKey : undefined;

    const post = await getPostById(id, draftKey);

    if (!post) {
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto p-4 md:p-8">
                    <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100">
                        {post.eyecatch && (
                            <div className="aspect-video relative rounded-2xl overflow-hidden mb-8">
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

                    <div className="mt-12 text-center">
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            記事一覧に戻る
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
        const data = await blogClient.getList<EduLensBlog>({
            endpoint: "blogs",
            queries: { fields: "id" },
        });
        return data.contents.map((post) => ({ id: post.id }));
    } catch (error) {
        return [];
    }
}
