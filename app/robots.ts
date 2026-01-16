import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 通常のクローラー（Googlebot含む）: 全ページ許可
        userAgent: '*',
        allow: '/',
      },

    ],
    sitemap: [
      'https://edulens.jp/sitemap.xml',
      'https://edulens.jp/mistap/sitemap.xml',
    ],
  };
}