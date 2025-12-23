import { MetadataRoute } from 'next';
import { supabase } from '@/utils/supabase/client';

const BASE_URL = 'https://edulens.jp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 静的ルート
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/countdown`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/countdown/highschool`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/countdown/university`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/EduTimer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. データ取得 (並列でリクエストすると少し高速になります)
  const [
    { data: prefectures },
    { data: universityEvents },
    { data: qualificationExams } // 追加: 資格試験データ
  ] = await Promise.all([
    supabase.from('prefectures').select('slug'),
    supabase.from('university_events').select('slug, year').eq('year', 2026),
    supabase.from('exam_schedules').select('slug, session_slug') // 追加
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // --- 高校入試 (都道府県別) ---
  if (prefectures) {
    const highschoolRoutes = prefectures.map((pref) => ({
      url: `${BASE_URL}/countdown/highschool/${pref.slug}/2026`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    dynamicRoutes.push(...highschoolRoutes);
  }

  // --- 大学入試イベント ---
  if (universityEvents) {
    const universityRoutes = universityEvents.map((event) => ({
      url: `${BASE_URL}/countdown/university/${event.slug}/${event.year}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    dynamicRoutes.push(...universityRoutes);
  }

  // --- ▼▼▼ 追加: 資格試験 (資格試験トップ & 詳細) ▼▼▼ ---
  if (qualificationExams) {
    // 1. 資格トップページ (重複を排除して生成: /countdown/eiken, /countdown/toeic 等)
    const uniqueSlugs = Array.from(new Set(qualificationExams.map((q) => q.slug)));

    const qualificationCategoryRoutes = uniqueSlugs.map((slug) => ({
      url: `${BASE_URL}/countdown/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const, // カウントダウンは毎日変わるためdaily推奨
      priority: 0.9,
    }));

    // 2. 各回詳細ページ (/countdown/eiken/2025-3, /countdown/toefl/2026-01-24 等)
    const qualificationSessionRoutes = qualificationExams.map((exam) => ({
      url: `${BASE_URL}/countdown/${exam.slug}/${exam.session_slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    dynamicRoutes.push(...qualificationCategoryRoutes, ...qualificationSessionRoutes);
  }

  return [...routes, ...dynamicRoutes];
}