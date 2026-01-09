import { mistapClient } from "@/lib/mistap/microcms";
import { notFound } from "next/navigation";
import type { Blog } from "../page"; // 
import Link from "next/link"; // Link
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";

// ページのキャッシュ設定
export const revalidate = 86400;

type Props = {
  params: Promise<{
    contentId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * */
async function getPostByContentId(contentId: string, draftKey?: string) {
  try {
    const queries: { draftKey?: string } = {};

    // draftKeyが渡された場合、下書きデータを取得
    if (draftKey) {
      queries.draftKey = draftKey;
    }

    // idでコンテンツを直接取得
    const post = await mistapClient.getListDetail<Blog>({
      endpoint: "blogs",
      contentId: contentId,
      queries,
    });

    return post;
  } catch (error) {
    console.error('Failed to fetch post:', {
      contentId,
      draftKey: draftKey ? 'present' : 'absent',
      error,
    });
    return null;
  }
}

// メタデータを動的に生成
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { contentId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const draftKey = typeof resolvedSearchParams.draftKey === 'string' ? resolvedSearchParams.draftKey : undefined;

  const post = await getPostByContentId(contentId, draftKey);

  if (!post) {
    console.error('generateMetadata: Post not found', { contentId, draftKey: draftKey ? 'present' : 'absent' });
    return {
      title: "記事が見つかりません | Mistap",
      description: "Mistapのブログ記事。英単語学習のコツ、効果的な暗記法を紹介します。",
      openGraph: {
        title: "記事が見つかりません | Mistap",
        description: "Mistapのブログ記事。英単語学習のコツ、効果的な暗記法を紹介します。",
        type: "website",
        url: `https://mistap.app/blog/${contentId}`,
        images: [
          {
            url: "https://mistap.app/mistap/ogp.png",
            width: 1200,
            height: 630,
            alt: "Mistap",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "記事が見つかりません | Mistap",
        description: "Mistapのブログ記事。英単語学習のコツ、効果的な暗記法を紹介します。",
        images: ["https://mistap.app/mistap/ogp.png"],
      },
    };
  }

  const description = post.content.replace(/<[^>]*>/g, "").substring(0, 160);
  const imageUrl = post.eyecatch?.url || "https://mistap.app/mistap/ogp.png";

  return {
    title: `${post.title} | Mistap ブログ`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://mistap.app/blog/${contentId}`,
      images: [
        {
          url: imageUrl,
          width: post.eyecatch?.width || 1200,
          height: post.eyecatch?.height || 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: {
        url: imageUrl,
        alt: post.title,
      },
    },
  };
}

/**
 * */
export default async function BlogPostPage({ params, searchParams }: Props) {
  const { contentId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const draftKey = typeof resolvedSearchParams.draftKey === 'string' ? resolvedSearchParams.draftKey : undefined;

  const post = await getPostByContentId(contentId, draftKey);

  // 
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-4 md:p-8" style={{ minHeight: '80vh' }}>
        {/* 構造化データ（JSON-LD） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              image: post.eyecatch?.url || "https://mistap.app/mistap/ogp.png",
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              author: {
                "@type": "Organization",
                name: "Mistap",
                url: "https://mistap.app",
              },
              publisher: {
                "@type": "Organization",
                name: "Mistap",
                logo: {
                  "@type": "ImageObject",
                  url: "https://mistap.app/mistap/logo.png",
                },
              },
              description: post.content.replace(/<[^>]*>/g, "").substring(0, 160),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://mistap.app/blog/${contentId}`,
              },
            }),
          }}
        />

        {post.eyecatch && (
          <Image
            src={post.eyecatch.url}
            alt={post.title}
            width={post.eyecatch.width}
            height={post.eyecatch.height}
            className="w-full h-auto rounded-lg mb-6"
            priority
          />
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          公開日: {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* (1) microCMSのリッチエディタ本文 */}
        <div
          className="prose lg:prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />

        {/* (2) CTA */}
        <hr className="border-gray-300" />
        <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 md:p-10 shadow-xl border border-white/50 my-12 text-center">

          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Mistapで「効率的な学習」を体験
          </h3>

          {/* <p className="text-gray-700 mb-6 md:mb-8 leading-relaxed">
          記事で紹介した「小テスト」を<br className="md:hidden" />
          今すぐお試しください。
        </p> */}

          <Link
            href="/mistap/test-setup"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg hover:shadow-red-300 inline-block"
          >
            今すぐデモを試してみる
          </Link>

          <p className="text-sm text-gray-600 mt-4">
            ※「間違えた単語」の保存には<Link href="/mistap?signup=1" className="underline hover:text-red-600 font-medium">アカウント登録（無料）</Link>が必要です。
          </p>

        </div>
      </div>
    </main>
  );
}

/**
 * */
export async function generateStaticParams() {
  try {
    const data = await mistapClient.getList<Blog>({
      endpoint: "blogs",
      queries: { fields: "id" },
    });

    const paths = data.contents.map((post) => ({
      slug: post.id,
    }));

    return paths;
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}