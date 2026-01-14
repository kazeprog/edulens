import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 通常のクローラー（Googlebot含む）: 全ページ許可
        userAgent: '*',
        allow: '/',
      },
      {
        // AdSenseクローラー: Mistapをブロック
        userAgent: 'Mediapartners-Google',
        disallow: ['/mistap/'],
      },
      {
        // Google Ads クローラー: Mistapをブロック
        userAgent: 'AdsBot-Google',
        disallow: ['/mistap/'],
      },
      {
        // Google Ads モバイルクローラー: Mistapをブロック
        userAgent: 'AdsBot-Google-Mobile',
        disallow: ['/mistap/'],
      },
    ],
    sitemap: [
      'https://edulens.jp/sitemap.xml',
      'https://edulens.jp/mistap/sitemap.xml',
    ],
  };
}