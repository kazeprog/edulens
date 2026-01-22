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



  // 新・教科書＆単語帳特設ページ (SEO強化版)
  const textbookPaths = [
    'textbook/new-crown',
    'textbook/new-crown/grade1',
    'textbook/new-crown/grade2',
    'textbook/new-crown/grade3',
    'textbook/new-horizon',
    'textbook/new-horizon/grade1',
    'textbook/new-horizon/grade2',
    'textbook/new-horizon/grade3',
    'textbook/system-words',
    'textbook/target-1900',
    'textbook/target-1200',
    'textbook/leap',
    'textbook/duo-30',
    'textbook/toeic-gold',
    'textbook/kobun-315',
    'textbook/kobun-330',
    'textbook/kobun-325',
  ];

  // 動的Unit/Lessonページの生成
  const { getAvailableLessons, WORDBOOK_CONFIG } = await import('@/lib/mistap/textbook-data');

  // School Textbooks
  const schoolBookConfigs = [
    { name: 'New Crown', slug: 'new-crown', maxGrade: 3 },
    { name: 'New Horizon', slug: 'new-horizon', maxGrade: 3 },
  ];

  schoolBookConfigs.forEach(book => {
    for (let g = 1; g <= book.maxGrade; g++) {
      const gradeStr = `中${g}`;
      const lessons = getAvailableLessons(book.name, gradeStr);
      lessons.forEach(l => {
        textbookPaths.push(`textbook/${book.slug}/grade${g}/${l}`);
      });
    }
  });

  // Wordbooks
  Object.keys(WORDBOOK_CONFIG).forEach(key => {
    const config = WORDBOOK_CONFIG[key];
    for (let i = 1; i <= config.totalUnits; i++) {
      textbookPaths.push(`textbook/${key}/${i}`);
    }
  });

  const textbookPages: MetadataRoute.Sitemap = textbookPaths.map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
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

    return [...staticPages, ...textbookPages, ...blogPages];
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [...staticPages, ...textbookPages];
  }
}
