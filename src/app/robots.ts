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
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://calcly.com'}/sitemap.xml`,
  };
}
