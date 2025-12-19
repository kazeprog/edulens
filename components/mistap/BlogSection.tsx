import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
    id: string;
    title: string;
    publishedAt: string;
    eyecatch?: {
        url: string;
        height: number;
        width: number;
    };
}

interface BlogSectionProps {
    blogPosts: BlogPost[];
    blogLoading: boolean;
}

export default function BlogSection({ blogPosts, blogLoading }: BlogSectionProps) {
    if (blogLoading || blogPosts.length === 0) {
        return null;
    }

    return (
        <section className="py-8 md:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                    📝 ブログ記事
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {blogPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/mistap/blog/${post.id}`}
                            className="bg-white/40 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 overflow-hidden transition-shadow hover:shadow-2xl group"
                        >
                            {post.eyecatch && (
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={post.eyecatch.url}
                                        alt={post.title}
                                        width={post.eyecatch.width || 1200}
                                        height={post.eyecatch.height || 630}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link
                        href="/mistap/blog"
                        className="inline-block bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        すべての記事を見る →
                    </Link>
                </div>
            </div>
        </section>
    );
}
