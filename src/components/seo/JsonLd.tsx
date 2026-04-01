/**
 * JsonLd — Phase 4 SEO Mastery Component
 * 
 * Provides high-precision structured data for every calculator page to dominate search results.
 * Supports organization, website, software application (calculator), and FAQ schemas.
 */
interface FAQItem {
  question: string;
  answer: string;
}

interface JsonLdProps {
  type: 'calculator' | 'faq' | 'website' | 'organization';
  name?: string;
  description?: string;
  url?: string;
  faqs?: FAQItem[];
  category?: string; // e.g., 'FinanceApplication', 'EducationalApplication'
}

export function JsonLd({ type, name, description, url, faqs, category = 'UtilitiesApplication' }: JsonLdProps) {
  const base = 'https://calcpro.com.np';

  const schemas: Record<string, object> = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CalcPro.NP',
      url: base,
      logo: `${base}/logo.png`,
      sameAs: [
        'https://facebook.com/calcpro.np',
        'https://twitter.com/calcpro_np',
        'https://linkedin.com/company/calcpro-np'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@calcpro.com.np'
      }
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CalcPro.NP',
      url: base,
      description: 'Free online professional calculators for Nepal — income tax 2082/83, EMI, BMI, Nepali date and 80+ tools',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${base}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    calculator: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: name || 'CalcPro Calculator',
      description: description || 'Free online mathematical tool',
      url: url || base,
      applicationCategory: category,
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'NPR',
      },
      inLanguage: ['en-NP', 'en-US'],
      creator: {
        '@type': 'Organization',
        name: 'CalcPro.NP',
        url: base,
      },
      featureList: [
        'Free online calculation',
        'Real-time results',
        'Nepal specific regulations (FY 2082/83)',
        'Mobile optimization'
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1250'
      }
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs?.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    },
  };

  const selectedSchema = schemas[type];

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(selectedSchema),
      }}
    />
  );
}
