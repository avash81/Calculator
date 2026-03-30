import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/admin/login',
        '/admin/posts',
        '/admin/seo-pages',
      ],
    },
    sitemap: 'https://calcpro.com.np/sitemap.xml',
  };
}
