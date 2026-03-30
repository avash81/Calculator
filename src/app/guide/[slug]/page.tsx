/**
 * @fileoverview SEO Guide Page — Public landing page
 *
 * Renders admin-created SEO pages at /guide/[slug].
 * Features full SEO metadata, JSON-LD schema, and
 * internal links to related calculators.
 *
 * Dynamic metadata generated from Firestore data.
 *
 * @example URL: /guide/nepal-income-tax-guide-2082-83
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SEOGuidePage from './GuidePage';

/** Fetch a single SEO page from Firestore */
async function getPage(slug: string) {
  try {
    // We use the REST API for server-side fetching (avoids client SDK in RSC)
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const dbId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID;
    if (!projectId) return null;

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId || '(default)'}/documents/seo_pages?pageSize=100`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.documents) return null;

    const doc = data.documents.find((d: any) => {
      const fields = d.fields;
      return fields?.slug?.stringValue === slug &&
             fields?.status?.stringValue === 'published';
    });

    if (!doc) return null;

    const f = doc.fields;
    return {
      title:        f.title?.stringValue || '',
      slug:         f.slug?.stringValue || '',
      metaTitle:    f.metaTitle?.stringValue || f.title?.stringValue || '',
      metaDesc:     f.metaDesc?.stringValue || '',
      focusKeyword: f.focusKeyword?.stringValue || '',
      excerpt:      f.excerpt?.stringValue || '',
      content:      f.content?.stringValue || '',
      schemaType:   f.schemaType?.stringValue || 'Article',
      ogImage:      f.ogImage?.stringValue || '',
      relatedCalcs: f.relatedCalcs?.arrayValue?.values?.map((v: any) => v.stringValue) || [],
      author:       f.author?.stringValue || 'CalcPro.NP',
      date:         f.date?.stringValue || new Date().toISOString(),
      wordCount:    f.wordCount?.integerValue || 0,
    };
  } catch {
    return null;
  }
}

/** Dynamic metadata for SEO */
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const page = await getPage(params.slug);
  if (!page) return { title: 'Not Found' };

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.excerpt,
    keywords: page.focusKeyword,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDesc || page.excerpt,
      url: `https://calcpro.com.np/guide/${page.slug}`,
      siteName: 'CalcPro.NP',
      type: 'article',
      ...(page.ogImage ? { images: [{ url: page.ogImage }] } : {}),
    },
    alternates: {
      canonical: `https://calcpro.com.np/guide/${page.slug}`,
    },
  };
}

export default async function GuidePage({
  params
}: {
  params: { slug: string }
}) {
  const page = await getPage(params.slug);
  if (!page) notFound();

  return <SEOGuidePage page={page} />;
}
