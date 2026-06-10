import { MetadataRoute } from 'next';
import { mistapClient } from '@/lib/mistap/microcms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://edulens.jp/mistap';
  const contentUpdatedAt = new Date('2026-05-11');
  const systemWordsUpdatedAt = new Date('2026-06-10');

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/test-setup`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chugaku-teiki-test`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/english-words-not-sticking`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/review-weak-words`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/english-idiom-test`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/toeic-word-test`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/word-test-maker`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/textbook`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/textbook-diagnosis`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];



  // 新・教科書＆単語帳特設ページ (SEO強化版)
  const textbookPaths = [
    'textbook/new-crown',
    'textbook/new-horizon',
    'textbook/system-words',
    'textbook/system-words-basic-5th',
    'textbook/system-english-idioms-5th',
    'textbook/system-words-stage5',
    'textbook/target-1900',
    'textbook/target-1900/print',
    'textbook/idiom-target-1000-5th',
    'textbook/target-1400',
    'textbook/target-1200',
    'textbook/target-1800',
    'textbook/target-1800-v5',
    'textbook/leap',
    'textbook/leap/app',
    'textbook/leap-basic',
    'textbook/reform-leap',
    'textbook/stock-3000',
    'textbook/stock-4500',
    'textbook/sokutan-hisshu-8th',
    'textbook/sokutan-jokyu-5th',
    'textbook/teppeki',
    'textbook/duo-30',
    'textbook/toeic-silver',
    'textbook/toeic-gold',
    'textbook/eiken-pre2-passtan-5th',
    'textbook/eiken-2-passtan-5th',
    'textbook/eiken-pre1-ex',
    'textbook/kobun-315',
    'textbook/kobun-330',
    'textbook/kobun-325',
    'textbook/kobun-351',
    'textbook/shin-kobun-336',
    'textbook/madonna-kobun-230',
    'textbook/group30-kobun-600',
    'textbook/absolute-150',
    'textbook/past-tense',
    'textbook/past-participle',
  ];

  // 動的Unit/Lessonページの生成
  const { WORDBOOK_CONFIG } = await import('@/lib/mistap/textbook-data');

  // Wordbooks
  Object.keys(WORDBOOK_CONFIG).forEach(key => {
    const config = WORDBOOK_CONFIG[key];
    for (let i = 1; i <= config.totalUnits; i++) {
      textbookPaths.push(`textbook/${key}/${i}`);
    }
  });

  const uniqueTextbookPaths = Array.from(new Set(textbookPaths));

  const textbookPages: MetadataRoute.Sitemap = uniqueTextbookPaths.map((path) => {
    const isUnitPage = path.split('/').length > 2;
    const isSystemWordsRoot = path === 'textbook/system-words';
    const isSystemWordsPage = path === 'textbook/system-words' || path.startsWith('textbook/system-words/');

    return {
      url: `${baseUrl}/${path}`,
      lastModified: isSystemWordsPage ? systemWordsUpdatedAt : contentUpdatedAt,
      changeFrequency: isUnitPage ? 'monthly' as const : 'weekly' as const,
      priority: isSystemWordsRoot ? 0.95 : isUnitPage ? 0.6 : 0.75,
    };
  });

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
