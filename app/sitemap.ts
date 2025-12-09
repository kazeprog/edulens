import { MetadataRoute } from 'next';
import { supabase } from '@/utils/supabase/client';

// サイトのベースURL (あなたのドメイン)
const BASE_URL = 'https://edulens.jp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 固定ページの定義 (トップページなど)
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
  ];

  // 2. DBから全都道府県を取得して動的ページを追加
  const { data: prefectures } = await supabase
    .from('prefectures')
    .select('slug');

  if (prefectures) {
    const dynamicRoutes = prefectures.map((pref) => ({
      // URL: edulens.jp/countdown/hyogo/2026
      url: `${BASE_URL}/countdown/${pref.slug}/2026`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const, // カウントダウンは毎日変わるため
      priority: 0.9,
    }));

    return [...routes, ...dynamicRoutes];
  }

  return routes;
}