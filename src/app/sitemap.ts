import { MetadataRoute } from 'next';
import { CALCULATORS } from '@/data/calculators';

export const revalidate = 3600; // Refetch every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://calcpro.com.np';

  // 1. Static Core Paths
  const staticPaths = [
    '',
    '/calculator',
    '/blog',
    '/contact',
    '/about',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Category Hubs (Filtered Search Result Pages)
  const categoryPaths = [
    'nepal', 'finance', 'health', 'education', 'conversion', 'utility', 'engineering'
  ].map((cat) => ({
    url: `${baseUrl}/calculator?cat=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Individual Calculator Tools
  const calculatorPaths = CALCULATORS.map((calc) => ({
    url: `${baseUrl}/calculator/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.95,
  }));

  // 4. Dynamic Content from Firestore (REST API for speed/reliability)
  let contentPaths: MetadataRoute.Sitemap = [];
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const dbId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)';
    
    if (projectId) {
      const collections = [
        { name: 'posts', route: 'blog', priority: 0.75 },
        { name: 'seo_pages', route: 'guide', priority: 0.85 }
      ];

      for (const col of collections) {
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${col.name}?pageSize=100`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        
        if (res.ok) {
          const data = await res.json();
          if (data.documents) {
            const paths = data.documents
              .filter((d: any) => d.fields?.status?.stringValue === 'published')
              .map((d: any) => ({
                url: `${baseUrl}/${col.route}/${d.fields?.slug?.stringValue}`,
                lastModified: new Date(d.updateTime || new Date()),
                changeFrequency: 'weekly' as const,
                priority: col.priority,
              }));
            contentPaths = [...contentPaths, ...paths];
          }
        }
      }
    }
  } catch (error) {
    console.error('Sitemap Build Error:', error);
  }

  return [...staticPaths, ...categoryPaths, ...calculatorPaths, ...contentPaths];
}
