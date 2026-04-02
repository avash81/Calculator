/**
 * @fileoverview GuidePage — Client component for SEO guide pages
 *
 * Renders the full SEO landing page with:
 *   - Breadcrumb navigation (JSON-LD BreadcrumbList)
 *   - Article header with author, date, reading time
 *   - Table of contents (auto-extracted from H2s)
 *   - Markdown content rendered as HTML
 *   - Related calculators (internal links)
 *   - JSON-LD schema (Article/HowTo/FAQPage based on type)
 *   - Social share buttons
 *
 * @component
 */
'use client';
import Link from 'next/link';
import { InternalLinks } from '@/components/seo/InternalLinks';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { useMemo } from 'react';

interface GuidePageData {
  title: string;
  slug: string;
  metaTitle: string;
  metaDesc: string;
  focusKeyword: string;
  excerpt: string;
  content: string;
  schemaType: string;
  ogImage: string;
  imageTop?: string;
  imageMiddle?: string;
  imageBottom?: string;
  relatedCalcs: string[];
  author: string;
  date: string;
  wordCount: number;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrlEscaped(url: string): string | null {
  const u = url.trim().toLowerCase();
  if (u.startsWith('javascript:') || u.startsWith('data:') || u.startsWith('vbscript:')) return null;
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/') || u.startsWith('#')) return url;
  return null;
}

function sanitizeUrlRaw(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  const u = trimmed.toLowerCase();
  if (u.startsWith('javascript:') || u.startsWith('data:') || u.startsWith('vbscript:')) return null;
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/') || u.startsWith('#')) return trimmed;
  return null;
}

function sanitizeId(value: string): string {
  const s = value.trim().toLowerCase();
  const out = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return out || 'section';
}

/** Converts markdown-style content to safe HTML */
function renderMarkdown(md: string): string {
  const escaped = escapeHtml(md);
  return escaped
    .replace(/^## (.+)$/gm, (_m, heading) => {
      const id = sanitizeId(String(heading));
      return `<h2 id="${id}" class="text-xl font-bold text-gray-900 mt-8 mb-3 scroll-mt-20">${heading}</h2>`;
    })
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-800 mt-5 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1">$2</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1">$1</li>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, (_m, alt, url) => {
      const safe = sanitizeUrlEscaped(String(url));
      if (!safe) return '';
      return `<img src="${safe}" alt="${alt}" loading="lazy" class="w-full h-auto rounded-2xl border border-gray-100 shadow-sm my-8" />`;
    })
    .replace(/\[(.+?)\]\((.+?)\)/g, (_m, label, url) => {
      const safe = sanitizeUrlEscaped(String(url));
      if (!safe) return `<span>${label}</span>`;
      return `<a href="${safe}" class="text-blue-600 underline hover:text-blue-800" rel="noopener noreferrer">${label}</a>`;
    })
    .replace(/^(?!<[hlo]).+$/gm, (line) => line.trim() ? `<p class="mb-4 text-gray-700 leading-relaxed">${line}</p>` : '')
    .replace(/(<\/li>\n<li)/g, '</li><li')
    .replace(/((<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="mb-4 space-y-1">$1</ul>');
}

/** Extract H2 headings for table of contents */
function extractTOC(md: string): { id: string; label: string }[] {
  const matches = [...md.matchAll(/^## (.+)$/gm)];
  return matches.map(m => ({
    id: m[1],
    label: m[1],
  }));
}

/** Calculate reading time (avg 200 wpm) */
function readingTime(wordCount: number): string {
  const mins = Math.max(1, Math.round(wordCount / 200));
  return `${mins} min read`;
}

/** JSON-LD schema for the page */
function buildSchema(page: GuidePageData): object {
  const base = {
    '@context': 'https://schema.org',
    '@type': page.schemaType || 'Article',
    headline: page.metaTitle || page.title,
    description: page.metaDesc || page.excerpt,
    url: `https://calcpro.com.np/guide/${page.slug}`,
    datePublished: page.date,
    dateModified: page.date,
    author: {
      '@type': 'Organization',
      name: 'CalcPro.NP',
      url: 'https://calcpro.com.np',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CalcPro.NP',
      url: 'https://calcpro.com.np',
    },
    inLanguage: 'en-NP',
    ...(page.ogImage ? { image: page.ogImage } : {}),
  };

  if (page.schemaType === 'HowTo') {
    // Extract numbered steps for HowTo schema
    const steps = [...page.content.matchAll(/^\d+\. (.+)$/gm)]
      .map((m, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text: m[1],
      }));
    return { ...base, step: steps };
  }

  return base;
}

export default function SEOGuidePage({ page }: { page: GuidePageData }) {
  const safeTopSrc = sanitizeUrlRaw(page.imageTop);
  const safeBottomSrc = sanitizeUrlRaw(page.imageBottom);

  const html = useMemo(() => {
    let rawHtml = renderMarkdown(page.content);
    // Dynamic Image Middle Injection (after first H2)
    const safeMiddleSrc = sanitizeUrlRaw(page.imageMiddle);
    if (safeMiddleSrc) {
      const parts = rawHtml.split('</h2>');
      if (parts.length > 1) {
        const middleImageHtml = `</h2><img src="${escapeHtml(safeMiddleSrc)}" alt="${escapeHtml(page.title)} Details" loading="lazy" class="w-full h-auto rounded-3xl border border-gray-100 shadow-xl my-10 object-cover" />`;
        rawHtml = parts[0] + middleImageHtml + parts.slice(1).join('</h2>');
      } else {
        // Fallback if no H2 exists
        rawHtml += `<img src="${escapeHtml(safeMiddleSrc)}" alt="${escapeHtml(page.title)} Flow" loading="lazy" class="w-full h-auto rounded-3xl border border-gray-100 shadow-xl my-10 object-cover" />`;
      }
    }
    return rawHtml;
  }, [page.content, page.imageMiddle, page.title]);
  
  const toc  = useMemo(() => extractTOC(page.content), [page.content]);
  const schema = useMemo(() => buildSchema(page), [page]);

  // Extract FAQ items from content (### Q\nA format)
  const faqs = useMemo(() => {
    const matches = [...page.content.matchAll(/^### (.+)\n([\s\S]+?)(?=\n###|\n##|$)/gm)];
    return matches
      .filter(m => m[1].endsWith('?') || m[1].toLowerCase().startsWith('what') || m[1].toLowerCase().startsWith('how'))
      .slice(0, 8)
      .map(m => ({ question: m[1], answer: m[2].trim().substring(0, 300) }));
  }, [page.content]);

  const pubDate = new Date(page.date).toLocaleDateString('en-NP', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type':'ListItem', position:1, name:'Home', item:'https://calcpro.com.np' },
              { '@type':'ListItem', position:2, name:'Guides', item:'https://calcpro.com.np/guide' },
              { '@type':'ListItem', position:3, name:page.title, item:`https://calcpro.com.np/guide/${page.slug}` },
            ]
          })
        }}
      />

      <div className="min-h-screen bg-[#F8FAFB]">
        <div className="max-w-5xl mx-auto px-4 py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5"
               aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600">Guides</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{page.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* MAIN ARTICLE */}
            <article className="flex-1 min-w-0">
              {/* Focus keyword pill */}
              {page.focusKeyword && (
                <div className="inline-block bg-blue-100 text-blue-700 text-xs
                                font-semibold px-3 py-1 rounded-full mb-3">
                  {page.focusKeyword}
                </div>
              )}

              {/* H1 */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900
                             leading-tight mb-3">
                {page.title}
              </h1>

              {/* Excerpt */}
              {page.excerpt && (
                <p className="text-base text-gray-500 mb-4 leading-relaxed
                              border-l-4 border-blue-300 pl-4 italic">
                  {page.excerpt}
                </p>
              )}

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-4
                              border-b border-gray-200 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center
                                  justify-center text-white text-[9px] font-bold">
                    CP
                  </div>
                  <span>CalcPro.NP Team</span>
                </div>
                <span>·</span>
                <time dateTime={page.date}>{pubDate}</time>
                <span>·</span>
                <span>{readingTime(page.wordCount)}</span>
                <span>·</span>
                <span>{page.wordCount} words</span>
                {page.schemaType !== 'WebPage' && (
                  <>
                    <span>·</span>
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {page.schemaType}
                    </span>
                  </>
                )}
              </div>

              {/* TOC (only if 3+ headings) */}
              {toc.length >= 3 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl
                                p-4 mb-6">
                  <div className="text-xs font-bold text-blue-700 uppercase
                                  tracking-wider mb-3">
                    Table of Contents
                  </div>
                  <ol className="space-y-1.5">
                    {toc.map((item, i) => (
                      <li key={i}>
                        <a href={`#${item.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800
                                     hover:underline flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-400">
                            {String(i + 1).padStart(2,'0')}
                          </span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Top Image (Feature) */}
              {safeTopSrc && (
                <div className="mb-10 w-full overflow-hidden rounded-[2rem] shadow-2xl border border-gray-100">
                   <img src={safeTopSrc} alt={`${page.title} Overview`} loading="eager" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              {/* Article body */}
              <div
                className="prose prose-sm max-w-none text-gray-700
                           prose-headings:text-gray-900 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {/* Bottom Image (Visual Summary) */}
              {safeBottomSrc && (
                <div className="mt-12 w-full overflow-hidden rounded-[2rem] shadow-2xl border border-gray-100">
                   <img src={safeBottomSrc} alt={`${page.title} Summary`} loading="lazy" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              {/* FAQ section (if detected) */}
              {faqs.length >= 2 && (
                <div className="mt-8">
                  <CalcFAQ faqs={faqs} />
                </div>
              )}

              {/* Internal links to related calculators */}
              {page.relatedCalcs.length > 0 && (
                <InternalLinks
                  slugs={page.relatedCalcs}
                  heading="Free Calculators for This Topic"
                  context="Use these free tools to apply what you learned above."
                />
              )}

              {/* Share buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-xs font-bold text-gray-400 uppercase
                                tracking-wider mb-3">
                  Share this guide
                </div>
                <ShareResult
                  title={page.title}
                  result="📖 Read the full guide"
                  calcUrl={`https://calcpro.com.np/guide/${page.slug}`}
                />
              </div>
            </article>

            {/* SIDEBAR (desktop only) */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4
                              lg:sticky lg:top-20">

              {/* Quick facts */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-400 uppercase
                                tracking-wider mb-3">
                  Quick Facts
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Reading time</span>
                    <span className="font-semibold">{readingTime(page.wordCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Word count</span>
                    <span className="font-semibold">{page.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last updated</span>
                    <span className="font-semibold">{pubDate}</span>
                  </div>
                </div>
              </div>

              {/* Jump to section */}
              {toc.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-gray-400 uppercase
                                  tracking-wider mb-3">
                    In This Guide
                  </div>
                  <nav className="space-y-1">
                    {toc.map((item, i) => (
                      <a key={i} href={`#${item.id}`}
                        className="block text-xs text-gray-600 hover:text-blue-600
                                   hover:bg-blue-50 py-1.5 px-2 rounded-lg
                                   transition-colors">
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Nepal rules note */}
              {page.focusKeyword.toLowerCase().includes('nepal') && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="np-badge">NP</span>
                    <span className="text-xs font-bold text-red-700">Nepal Specific</span>
                  </div>
                  <p className="text-[11px] text-red-600 leading-relaxed">
                    Rules verified against Nepal IRD, NRB, and SSF for FY 2082/83.
                    Check official sources for latest updates.
                  </p>
                  <a href="https://ird.gov.np" target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline mt-1.5 block">
                    Nepal IRD Official Site →
                  </a>
                </div>
              )}
            </aside>
          </div>

          {/* Back to blog */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link href="/blog"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              ← Back to all guides
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
