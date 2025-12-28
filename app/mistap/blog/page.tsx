import Link from "next/link";
import { client } from "@/lib/mistap/microcms"; // lib/microcms.ts を指す
import type { Metadata } from "next";
import Image from "next/image";
import MistapFooter from "@/components/mistap/Footer";

// メタデータ
export const metadata: Metadata = {
  title: "ブログ | Mistap - 英単語学習アプリ",
  description: "Mistapの公式ブログ。英単語学習のコツ、効果的な暗記法、ターゲット1900やシステム英単語の活用方法などを紹介します。",
  openGraph: {
    title: "ブログ | Mistap - 英単語学習アプリ",
    description: "Mistapの公式ブログ。英単語学習のコツ、効果的な暗記法、ターゲット1900やシステム英単語の活用方法などを紹介します。",
    type: "website",
    url: "https://mistap.app/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "ブログ | Mistap - 英単語学習アプリ",
    description: "Mistapの公式ブログ。英単語学習のコツ、効果的な暗記法、ターゲット1900やシステム英単語の活用方法などを紹介します。",
  },
};

// microCMSの型定義（APIスキーマに合わせる）
export interface Blog {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  slug?: string;    // オプショナル（設定されていない場合はidを使用）
  content: string; // 
  eyecatch?: {    // 
    url: string;
    height: number;
    width: number;
  };
  category?: {    // 
    id: string;
    name: string;
  };
}

// ページのキャッシュ設定 - 動的レンダリングを強制
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SEO専用記事のID（一覧から除外）
const SEO_EXCLUDED_ID = '9dj-wo0gj';

async function getAllBlogs() {
  const limit = 100;
  let offset = 0;
  let allContents: Blog[] = [];

  while (true) {
    const data = await client.getList<Blog>({
      endpoint: "blogs",
      queries: {
        orders: "-publishedAt",
        fields: 'id,title,publishedAt,eyecatch,slug,category',
        filters: `category[not_equals]${SEO_EXCLUDED_ID}`,
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

  console.log('Total posts fetched:', allContents.length);
  return allContents;
}

// ページ本体 (サーバーコンポーネント)
export default async function BlogPage() {

  // 1. microCMSから全データを取得
  const posts = await getAllBlogs();

  // 2. 取得したデータを表示
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">ブログ一覧</h1>

        {/* 投稿がない場合の表示 */}
        {posts.length === 0 && (
          <p>記事がまだありません。</p>
        )}

        {/* 投稿がある場合のリスト表示 */}
        <ul className="space-y-6">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg border border-white/50 overflow-hidden transition-shadow hover:shadow-xl"
            >
              <Link
                href={`/mistap/blog/${post.id}`} // コンテンツIDを使用
                className="flex flex-col md:flex-row"
              >
                {post.eyecatch && (
                  <Image
                    src={post.eyecatch.url}
                    alt={post.title}
                    width={post.eyecatch.width}
                    height={post.eyecatch.height}
                    className="w-full md:w-80 h-48 md:h-42 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-red-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <MistapFooter />
    </div>
  );
}