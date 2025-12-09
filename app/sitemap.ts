import { MetadataRoute } from 'next';
import { supabase } from '@/utils/supabase/client';

const BASE_URL = 'https://edulens.jp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/countdown`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // ▼▼▼ 追加: 高校入試トップ ▼▼▼
    {
      url: `${BASE_URL}/countdown/highschool`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // ▼▼▼ 追加: 大学入試トップ ▼▼▼
    {
      url: `${BASE_URL}/countdown/university`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 高校入試の都道府県別ページ
  const { data: prefectures } = await supabase
    .from('prefectures')
    .select('slug');

  // 大学入試イベントページ
  const { data: universityEvents } = await supabase
    .from('university_events')
    .select('slug, year')
    .eq('year', 2026);

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  if (prefectures) {
    const highschoolRoutes = prefectures.map((pref) => ({
      url: `${BASE_URL}/countdown/highschool/${pref.slug}/2026`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    dynamicRoutes.push(...highschoolRoutes);
  }

  if (universityEvents) {
    const universityRoutes = universityEvents.map((event) => ({
      url: `${BASE_URL}/countdown/university/${event.slug}/${event.year}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    dynamicRoutes.push(...universityRoutes);
  }

  return [...routes, ...dynamicRoutes];
}