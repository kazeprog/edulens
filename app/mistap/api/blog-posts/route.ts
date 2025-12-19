import { NextResponse } from 'next/server';
import { client } from '@/lib/mistap/microcms';

// キャッシュを無効化
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SEO専用記事のID（一覧から除外）
const SEO_EXCLUDED_ID = '9dj-wo0gj';

export async function GET() {
  try {
    const data = await client.getList({
      endpoint: 'blogs',
      queries: {
        orders: '-publishedAt',
        limit: 3,
        fields: 'id,title,publishedAt,eyecatch,category',
        filters: `category[not_equals]${SEO_EXCLUDED_ID}`,
      },
    });

    return NextResponse.json({ contents: data.contents });
  } catch (error) {
    console.error('ブログ記事の取得に失敗:', error);
    return NextResponse.json({ contents: [] }, { status: 500 });
  }
}
