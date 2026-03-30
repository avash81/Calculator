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
}

export function JsonLd({ type, name, description, url, faqs }: JsonLdProps) {
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
      description: 'Free online calculators for Nepal — income tax 2082/83, EMI, BMI, Nepali date and 80+ tools',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${base}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    calculator: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name,
      description,
      url,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'NPR',
      },
      inLanguage: 'en',
      creator: {
        '@type': 'Organization',
        name: 'CalcPro.NP',
        url: base,
      },
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

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas[type]),
      }}
    />
  );
}
