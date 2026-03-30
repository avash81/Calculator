import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostContent from './BlogPostContent';
import Link from 'next/link';

async function getPostData(slug: string) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const dbId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID;
    if (!projectId) return null;

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId || '(default)'}/documents/posts`;
    const res = await fetch(url + '?pageSize=100', { next: { revalidate: 3600 } });
    
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.documents) return null;

    let targetDoc = null;
    let allPublished = [];

    // Find the requested post and all published posts
    for (const d of data.documents) {
      const f = d.fields;
      if (f?.status?.stringValue === 'published') {
        const parsed = {
          title: f.title?.stringValue || '',
          slug: f.slug?.stringValue || '',
          excerpt: f.excerpt?.stringValue || '',
          content: f.content?.stringValue || '',
          category: f.category?.stringValue || '',
          date: f.date?.stringValue || new Date().toISOString(),
          relatedCalcs: f.relatedCalcs?.arrayValue?.values?.map((v: any) => v.stringValue) || [],
          ogImage: f.ogImage?.stringValue || '',
          author: f.author?.stringValue || 'CalcPro.NP',
        };
        allPublished.push(parsed);
        if (parsed.slug === slug) {
          targetDoc = parsed;
        }
      }
    }

    if (!targetDoc) return null;

    // Filter related posts (same category, excluding current)
    const related = allPublished
      .filter(p => p.slug !== slug && p.category === targetDoc.category)
      .slice(0, 2);

    return { post: targetDoc, related };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getPostData(params.slug);
  if (!data?.post) return { title: 'Not Found' };

  const { post } = data;
  return {
    title: `${post.title} | CalcPro.NP Blog`,
    description: post.excerpt || post.content.substring(0, 150),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://calcpro.com.np/blog/${post.slug}`,
      siteName: 'CalcPro.NP',
      type: 'article',
      ...(post.ogImage ? { images: [{ url: post.ogImage }] } : {}),
    },
    alternates: {
      canonical: `https://calcpro.com.np/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const data = await getPostData(params.slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Post not found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">← Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calcpro.com.np" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://calcpro.com.np/blog" },
              { "@type": "ListItem", "position": 3, "name": data.post.title, "item": `https://calcpro.com.np/blog/${data.post.slug}` }
            ]
          }),
        }}
      />
      <BlogPostContent post={data.post} related={data.related} />
    </>
  );
}
