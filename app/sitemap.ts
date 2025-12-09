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
  ];

  const { data: prefectures } = await supabase
    .from('prefectures')
    .select('slug');

  if (prefectures) {
    const dynamicRoutes = prefectures.map((pref) => ({
      // ▼▼▼ 修正: URLに /highschool を追加 ▼▼▼
      url: `${BASE_URL}/countdown/highschool/${pref.slug}/2026`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    return [...routes, ...dynamicRoutes];
  }

  return routes;
}