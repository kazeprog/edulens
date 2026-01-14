import { MetadataRoute } from 'next';
import { mistapClient } from '@/lib/mistap/microcms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://edulens.jp/mistap';

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/test-setup`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 単語帳別ランディングページ
  const bookSlugs = [
    'target-1900',
    'systan',
    'kobun-315',
    'duo-30',
    'leap',
    'stock-4500',
    'toeic-gold',
    'passtan',
  ];

  const bookPages: MetadataRoute.Sitemap = bookSlugs.map((slug) => ({
    url: `${baseUrl}/books/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // ブログ記事を取得
  try {
    const { contents } = await mistapClient.getList({
      endpoint: 'blogs',
      queries: { fields: 'id,updatedAt', limit: 100 },
    });

    const blogPages: MetadataRoute.Sitemap = contents.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...bookPages, ...blogPages];
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [...staticPages, ...bookPages];
  }
}
