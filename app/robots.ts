import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/mistap/'], // TEMPORARY: Hide for AdSense
    },
    sitemap: [
      'https://edulens.jp/sitemap.xml',
      // 'https://edulens.jp/mistap/sitemap.xml' // TEMPORARY: Hide for AdSense
    ],
  };
}