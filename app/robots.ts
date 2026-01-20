import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 通常のクローラー（Googlebot含む）: 全ページ許可
        userAgent: '*',
        allow: [
          '/',
          '/favicon.ico',
          '/favicon-96x96.png',
          '/apple-touch-icon.png',
        ],
      },

    ],
    sitemap: [
      'https://edulens.jp/sitemap.xml',
      'https://edulens.jp/mistap/sitemap.xml',
    ],
  };
}