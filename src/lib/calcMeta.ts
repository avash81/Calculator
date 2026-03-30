import { Metadata } from 'next';

export function calcMeta({ title, description, slug, keywords }: { title: string; description: string; slug: string; keywords: string[] }): Metadata {
  const ogImage = `https://calcpro.com.np/api/og?title=${encodeURIComponent(title)}`;
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://calcpro.com.np/calculator/${slug}`,
      siteName: 'CalcPro.NP',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://calcpro.com.np/calculator/${slug}`,
    },
  };
}
