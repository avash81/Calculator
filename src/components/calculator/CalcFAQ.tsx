'use client';
import { useState } from 'react';

interface FAQ { question: string; answer: string; }

export function CalcFAQ({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-1">
        {faqs.map((faq, i) => (
          <div key={i}
            className="border border-gray-100 rounded-lg
                       overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between
                         px-4 py-3 text-left text-sm font-medium
                         text-gray-900 hover:bg-gray-50
                         transition-colors"
            >
              <span>{faq.question}</span>
              <span className={`text-gray-400 text-xs ml-3
                flex-shrink-0 transition-transform duration-200
                ${open===i ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-gray-600
                               leading-relaxed bg-gray-50/50
                               border-t border-gray-100">
                <p className="pt-3">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* JSON-LD for FAQ rich snippets */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity: faqs.map(f=>({
            '@type':'Question',
            name: f.question,
            acceptedAnswer:{
              '@type':'Answer',
              text: f.answer,
            },
          })),
        })}}
      />
    </div>
  );
}
