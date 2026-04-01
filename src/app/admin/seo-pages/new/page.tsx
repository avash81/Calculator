/**
 * @fileoverview NewSEOPage — Admin editor for creating SEO landing pages
 *
 * Full-featured page editor with:
 *   - Rich text content area (markdown-style)
 *   - Live SEO score panel (10 checks)
 *   - Meta title, description, focus keyword
 *   - Schema type selector (Article, HowTo, FAQPage)
 *   - Related calculators selector (internal linking)
 *   - OG image URL
 *   - Canonical URL
 *   - Status: Draft / Published
 *
 * Pages saved to Firestore 'seo_pages' collection.
 * Public URL: /guide/[slug]
 *
 * @component
 */
'use client';
import { useState, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { SEOScorePanel } from '@/components/admin/SEOScorePanel';
import { getDb, getFirebaseAuth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CALCULATORS } from '@/data/calculators';
import {
  Save, ArrowLeft, Link as LinkIcon, HelpCircle, Globe
} from 'lucide-react';

/** Calculator slugs grouped by category for the internal link selector */
const CALC_GROUPS = {
  'Nepal Tools': ['nepal-income-tax','nepal-salary','nepal-vat','nepali-date','nepal-home-loan','nepal-provident-fund'],
  'Finance': ['loan-emi','sip-calculator','fd-calculator','compound-interest','simple-interest','cagr-calculator','discount-calculator','savings'],
  'Health': ['bmi','bmr','ideal-weight','body-fat','calorie-calculator','pregnancy-due-date','water-intake'],
  'Education': ['gpa','cgpa','percentage','attendance','marks-needed'],
  'Math': ['scientific-calculator','fraction-calculator','quadratic-solver','standard-deviation'],
  'Utility': ['password-generator','qr-generator','word-counter','tip-calculator','age-calculator','unit-converter'],
};

/** Schema type options */
const SCHEMA_TYPES = [
  { value: 'Article', label: 'Article — general guide or explainer' },
  { value: 'HowTo', label: 'HowTo — step-by-step instructions' },
  { value: 'FAQPage', label: 'FAQPage — question & answer page' },
  { value: 'WebPage', label: 'WebPage — general landing page' },
];

function NewSEOPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  // Prefill from URL params (when clicked from suggestions list)
  const [title, setTitle]           = useState('');
  const [slug, setSlug]             = useState(params.get('slug') || '');
  const [metaTitle, setMetaTitle]   = useState('');
  const [metaDesc, setMetaDesc]     = useState('');
  const [focusKw, setFocusKw]       = useState(params.get('kw') || '');
  const [excerpt, setExcerpt]       = useState('');
  const [content, setContent]       = useState('');
  const [schemaType, setSchemaType] = useState('Article');
  const [ogImage, setOgImage]       = useState('');
  const [imageTop, setImageTop]       = useState('');
  const [imageMiddle, setImageMiddle] = useState('');
  const [imageBottom, setImageBottom] = useState('');
  const [relatedCalcs, setRelated]  = useState<string[]>([]);
  const [saving, setSaving]         = useState(false);
  const [tab, setTab]               = useState<'write' | 'preview'>('write');

  /** Auto-generate slug from title */
  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
    if (!params.get('slug')) {
      setSlug(val.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60));
    }
    // Auto-generate meta title if empty
    if (!metaTitle) {
      setMetaTitle(val.substring(0, 60));
    }
  }, [metaTitle, params]);

  /** Toggle a calculator in/out of related list */
  const toggleCalc = useCallback((slug: string) => {
    setRelated((prev: string[]) =>
      prev.includes(slug)
        ? prev.filter((s: string) => s !== slug)
        : [...prev, slug]
    );
  }, []);

  /** Save to Firestore */
  const handleSave = async (publishStatus: 'draft' | 'published') => {
    if (!title.trim() || !slug.trim()) {
      alert('Title and URL slug are required.');
      return;
    }
    if (!content.trim() || content.split(/\s+/).length < 50) {
      if (!confirm('Content is very short. Are you sure you want to save?')) return;
    }

    setSaving(true);
    const db = getDb();
    if (!db) {
      alert('Firebase not configured. Check your .env.local file.');
      setSaving(false);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      const wordCount = content.split(/\s+/).filter(Boolean).length;

      await addDoc(collection(db, 'seo_pages'), {
        title,
        slug,
        metaTitle: metaTitle || title,
        metaDesc,
        focusKeyword: focusKw,
        excerpt,
        content,
        schemaType,
        ogImage,
        imageTop,
        imageMiddle,
        imageBottom,
        relatedCalcs,
        status: publishStatus,
        wordCount,
        author: auth?.currentUser?.displayName || 'Admin',
        date: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert(publishStatus === 'published'
        ? `✅ Page published at /guide/${slug}`
        : '✅ Draft saved.');
      router.push('/admin/seo-pages');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'seo_pages');
      alert('Save failed. Check the console for details.');
    } finally {
      setSaving(false);
    }
  };

  // Markdown preview (simple)
  const preview = content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link href="/admin/seo-pages"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100
                         rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">New SEO Page</h1>
              <p className="text-xs text-gray-400">
                Public URL: <span className="font-mono">calcpro.com.np/guide/{slug || 'your-slug'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200
                         rounded-xl text-sm font-medium text-gray-600
                         hover:bg-gray-50 disabled:opacity-50 transition-colors">
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <button onClick={() => handleSave('published')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600
                         text-white rounded-xl text-sm font-bold
                         hover:bg-green-700 disabled:opacity-50 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

          {/* LEFT — Content editor */}
          <div className="space-y-4">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500
                                uppercase tracking-wider mb-1.5">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Nepal Income Tax Calculator Guide 2082/83"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                           text-lg font-semibold focus:outline-none focus:border-blue-500"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 flex-shrink-0">
                calcpro.com.np/guide/
              </span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="url-slug"
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg
                           text-sm font-mono focus:outline-none focus:border-blue-500"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold text-gray-500
                                uppercase tracking-wider mb-1.5">
                Excerpt / Summary
                <span className="text-gray-400 font-normal normal-case ml-1">
                  (shown in blog listing + social shares)
                </span>
              </label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={2}
                placeholder="1-2 sentence summary of this page..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                           text-sm resize-none focus:outline-none focus:border-blue-500"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Write / Preview tabs */}
            <div>
              <div className="flex border-b border-gray-200 mb-3">
                {(['write','preview'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2 text-xs font-semibold capitalize transition-colors
                      ${tab === t
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-400 hover:text-gray-600'}`}>
                    {t === 'write' ? '✏️ Write' : '👁 Preview'}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-1 text-xs text-gray-400 pb-2">
                  <HelpCircle className="w-3 h-3" />
                  Markdown supported
                </div>
              </div>

              {tab === 'write' ? (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={20}
                  placeholder={`Write your SEO content here. Use Markdown:

## Introduction
Write 1-2 paragraphs introducing the topic.

## How Nepal Income Tax Works
Explain the main concept clearly.

## Step-by-Step Guide
1. First step...
2. Second step...

## Frequently Asked Questions

### What is the Nepal income tax rate 2082/83?
Answer here...

## Conclusion
Summary paragraph with call to action.`}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                             text-sm font-mono resize-y focus:outline-none focus:border-blue-500
                             leading-relaxed"
                  style={{ fontSize: '16px', minHeight: '450px' }}
                />
              ) : (
                <div
                  className="min-h-[450px] p-5 border-2 border-gray-100 rounded-xl
                             prose prose-sm max-w-none bg-white"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="mb-3">${preview}</p>`
                  }}
                />
              )}
            </div>

            {/* SEO Meta section */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                SEO Settings
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase
                                  tracking-wider mb-1.5">
                  Focus Keyword
                </label>
                <input type="text" value={focusKw}
                  onChange={e => setFocusKw(e.target.value)}
                  placeholder="e.g. nepal income tax 2082 83"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:border-blue-500"
                  style={{ fontSize: '16px' }}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  The main keyword users search for. Include it in title, first paragraph, and headings.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase
                                  tracking-wider mb-1.5">
                  Meta Title
                  <span className={`ml-2 font-mono ${
                    metaTitle.length > 60 ? 'text-red-500' :
                    metaTitle.length >= 50 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {metaTitle.length}/60
                  </span>
                </label>
                <input type="text" value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  placeholder="Title shown in Google results (50-60 chars)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:border-blue-500"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase
                                  tracking-wider mb-1.5">
                  Meta Description
                  <span className={`ml-2 font-mono ${
                    metaDesc.length > 160 ? 'text-red-500' :
                    metaDesc.length >= 120 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {metaDesc.length}/160
                  </span>
                </label>
                <textarea value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  rows={3}
                  placeholder="Description shown in Google results (120-160 chars). Include focus keyword."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                             resize-none focus:outline-none focus:border-blue-500"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase
                                    tracking-wider mb-1.5">
                    Schema Type
                  </label>
                  <select value={schemaType} onChange={e => setSchemaType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:border-blue-500 bg-white"
                    style={{ fontSize: '16px' }}>
                    {SCHEMA_TYPES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase
                                    tracking-wider mb-1.5">
                    Feature Image (OG)
                  </label>
                  <input type="url" value={ogImage}
                    onChange={e => setOgImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:border-blue-500"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Multi-Image SEO Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-50">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Top Image
                  </label>
                  <input type="url" value={imageTop} onChange={e => setImageTop(e.target.value)}
                    placeholder="URL" className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Middle Image
                  </label>
                  <input type="url" value={imageMiddle} onChange={e => setImageMiddle(e.target.value)}
                    placeholder="URL" className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Bottom Image
                  </label>
                  <input type="url" value={imageBottom} onChange={e => setImageBottom(e.target.value)}
                    placeholder="URL" className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Related calculators */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Related Calculators (Internal Links)
                </h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Select calculators to show as &quot;Related tools&quot; at the bottom of
                this page. These internal links boost SEO for both pages.
              </p>
              {Object.entries(CALC_GROUPS).map(([group, slugs]) => (
                <div key={group} className="mb-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase
                                  tracking-wider mb-1.5">
                    {group}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {slugs.map(s => {
                      const calc = CALCULATORS.find(c => c.slug === s);
                      if (!calc) return null;
                      const selected = relatedCalcs.includes(s);
                      return (
                        <button key={s} onClick={() => toggleCalc(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium
                            transition-all border ${selected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                          {calc.icon as string} {calc.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {relatedCalcs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-blue-600 font-medium">
                    {relatedCalcs.length} calculator{relatedCalcs.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — SEO Score panel (sticky) */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-20">
              <SEOScorePanel
                title={title}
                metaTitle={metaTitle}
                metaDesc={metaDesc}
                focusKeyword={focusKw}
                content={content}
                slug={slug}
                excerpt={excerpt}
              />

              {/* Writing tips */}
              <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase
                               tracking-wider mb-3">
                  Content Structure Tips
                </h3>
                <div className="space-y-2.5 text-[11px] text-gray-600 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">H2</span>
                    <span>Use ## for H2 headings. Aim for one H2 every 150-200 words.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-500 font-bold flex-shrink-0">KW</span>
                    <span>Use focus keyword in first 100 words, at least one H2, and conclusion.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-500 font-bold flex-shrink-0">📏</span>
                    <span>600-1200 words is optimal. Under 300 won&apos;t rank.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-purple-500 font-bold flex-shrink-0">🔗</span>
                    <span>Mention the calculator in text: &quot;Use our free Nepal Tax Calculator to…&quot;</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0">❓</span>
                    <span>End with a FAQ section using ### for questions. This gets FAQ rich snippets.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function NewSEOPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
      </div>
    }>
      <NewSEOPageInner />
    </Suspense>
  );
}
