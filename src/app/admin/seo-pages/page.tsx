/**
 * @fileoverview Admin SEO Pages — List all custom landing pages
 *
 * Shows all SEO landing pages created by admin.
 * These are standalone content pages (not blog posts) like:
 *   /guide/nepal-income-tax-guide-2082-83
 *   /guide/how-to-calculate-emi-nepal
 *   /guide/nepali-date-converter-guide
 *
 * Admin can create, edit, publish, or delete these pages.
 * Each page has full SEO control: schema type, canonical, OG image, etc.
 *
 * @component
 */
'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';
import { getDb, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import {
  PlusCircle, Edit, Trash2, Globe, FileText, ExternalLink
} from 'lucide-react';

interface SEOPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  metaTitle: string;
  focusKeyword: string;
  wordCount: number;
  date: string;
  schemaType: string;
}

export default function SEOPagesAdmin() {
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    const db = getDb();
    if (!db) { setLoading(false); return; }
    try {
      const q = query(collection(db, 'seo_pages'), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      setPages(snap.docs.map(d => ({ id: d.id, ...d.data() } as SEOPage)));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'seo_pages');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete &quot;${title}&quot;? This cannot be undone.`)) return;
    const db = getDb();
    if (!db) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'seo_pages', id));
      setPages(p => p.filter(x => x.id !== id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'seo_pages');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO Pages</h1>
            <p className="text-sm text-gray-500 mt-1">
              Custom landing pages for ranking in Google. Each page targets
              specific keywords and links to related calculators.
            </p>
          </div>
          <Link
            href="/admin/seo-pages/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600
                       text-white rounded-xl text-sm font-semibold
                       hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New SEO Page
          </Link>
        </div>

        {/* What is an SEO Page - info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-blue-900 mb-1">
                What are SEO Pages?
              </div>
              <div className="text-xs text-blue-700 leading-relaxed">
                SEO Pages are standalone content pages that target high-volume search
                queries. Unlike blog posts (news/updates), SEO pages are evergreen
                guides that stay relevant year-round. Example:
                <strong> &quot;How to Calculate Income Tax in Nepal 2082/83&quot;</strong> or
                <strong> &quot;Nepal EMI Calculator — Complete Guide&quot;</strong>.
                Each page links back to the relevant calculator to boost rankings for both.
              </div>
            </div>
          </div>
        </div>

        {/* Pages list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed
                          border-gray-200 rounded-2xl">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500 font-medium mb-1">No SEO pages yet</div>
            <div className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
              Create your first SEO page. Start with
              &quot;Nepal Income Tax Guide 2082/83&quot; — highest search volume.
            </div>
            <Link href="/admin/seo-pages/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600
                         text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
              <PlusCircle className="w-4 h-4" /> Create First Page
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_120px_100px_90px] gap-4 px-4 py-3
                            bg-gray-50 border-b border-gray-100 text-xs font-bold
                            text-gray-400 uppercase tracking-wider">
              <span>Page</span>
              <span>Focus Keyword</span>
              <span>Words</span>
              <span>Actions</span>
            </div>
            {/* Rows */}
            {pages.map(page => (
              <div key={page.id}
                className="grid grid-cols-[1fr_120px_100px_90px] gap-4 px-4 py-4
                           border-b border-gray-50 last:border-0 hover:bg-gray-50/50
                           transition-colors items-center">
                {/* Title + slug */}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {page.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded
                      ${page.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                      {page.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      /guide/{page.slug}
                    </span>
                  </div>
                </div>
                {/* Keyword */}
                <div className="text-xs text-gray-600 truncate">
                  {page.focusKeyword || '—'}
                </div>
                {/* Words */}
                <div className={`text-xs font-medium ${(page.wordCount || 0) >= 600 ? 'text-green-600'
                  : (page.wordCount || 0) >= 300 ? 'text-amber-600'
                    : 'text-red-500'}`}>
                  {page.wordCount || 0} words
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1">
                  {page.status === 'published' && (
                    <a href={`/guide/${page.slug}`} target="_blank" rel="noopener"
                      className="p-1.5 text-gray-400 hover:text-blue-600
                                 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View live page">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link href={`/admin/seo-pages/edit/${page.slug}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600
                               hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit">
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id, page.title)}
                    disabled={deleting === page.id}
                    className="p-1.5 text-gray-400 hover:text-red-600
                               hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO page ideas */}
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            🎯 Recommended Pages to Create (by search volume)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { kw: 'nepal income tax 2082 83', slug: 'nepal-income-tax-guide-2082-83', vol: 'Very High' },
              { kw: 'how to calculate emi nepal', slug: 'emi-calculator-guide-nepal', vol: 'High' },
              { kw: 'nepali date converter bs ad', slug: 'nepali-date-converter-guide', vol: 'Very High' },
              { kw: 'nepal salary calculator ssf', slug: 'nepal-salary-ssf-guide-2082', vol: 'High' },
              { kw: 'gpa calculator nepal tu ku', slug: 'gpa-calculator-nepal-guide', vol: 'High' },
              { kw: 'bmi calculator nepal', slug: 'bmi-calculator-guide-nepal', vol: 'Medium' },
              { kw: 'sip vs fd nepal which better', slug: 'sip-vs-fd-nepal-guide', vol: 'Medium' },
              { kw: 'nepal home loan interest rate 2082', slug: 'nepal-home-loan-guide-2082', vol: 'High' },
            ].map(item => {
              const alreadyCreated = pages.some(p => p.slug === item.slug);
              return (
                <div key={item.slug}
                  className={`flex items-center justify-between p-3 rounded-xl border
                    text-xs ${alreadyCreated
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-100 bg-gray-50 hover:border-blue-200'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{item.kw}</div>
                    <div className="text-gray-400 truncate">/guide/{item.slug}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded
                      ${item.vol === 'Very High' ? 'bg-red-100 text-red-700'
                        : item.vol === 'High' ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'}`}>
                      {item.vol}
                    </span>
                    {alreadyCreated ? (
                      <span className="text-green-600 text-[9px] font-bold">✓ Done</span>
                    ) : (
                      <Link href={`/admin/seo-pages/new?slug=${item.slug}&kw=${encodeURIComponent(item.kw)}`}
                        className="text-blue-600 hover:underline text-[10px] font-bold">
                        Create →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}