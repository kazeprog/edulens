import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: ['https://edulens.jp/sitemap.xml', 'https://edulens.jp/mistap/sitemap.xml'],
  };
}