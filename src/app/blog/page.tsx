/**
 * @fileoverview Blog Page — CalcPro.NP
 *
 * Lists all published blog posts AND SEO guide pages.
 * Tabs: All | Blog Posts | Guides
 * Firebase optional — shows empty state gracefully.
 *
 * @component
 */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, FileText } from 'lucide-react';
import { getDb, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

type ContentType = 'all' | 'posts' | 'guides';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  type: 'post' | 'guide';
  focusKeyword?: string;
  wordCount?: number;
}

export default function BlogPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ContentType>('all');

  useEffect(() => {
    const fetchAll = async () => {
      const dbInst = getDb();
      if (!dbInst) { setLoading(false); return; }
      try {
        // Fetch blog posts
        const pq = query(
          collection(dbInst, 'posts'),
          where('status', '==', 'published'),
          orderBy('date', 'desc')
        );
        const postSnap = await getDocs(pq);
        const posts = postSnap.docs.map(d => ({
          id: d.id, type: 'post' as const, ...d.data()
        } as ContentItem));

        // Fetch SEO pages
        const gq = query(
          collection(dbInst, 'seo_pages'),
          where('status', '==', 'published'),
          orderBy('date', 'desc')
        );
        const guideSnap = await getDocs(gq);
        const guides = guideSnap.docs.map(d => ({
          id: d.id, type: 'guide' as const, ...d.data()
        } as ContentItem));

        // Merge and sort by date
        const all = [...posts, ...guides].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setItems(all);
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'blog');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = tab === 'all' ? items
    : tab === 'posts' ? items.filter(i => i.type === 'post')
      : items.filter(i => i.type === 'guide');

  const postCount = items.filter(i => i.type === 'post').length;
  const guideCount = items.filter(i => i.type === 'guide').length;

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            CalcPro.NP Blog & Guides
          </h1>
          <p className="text-sm text-gray-500">
            Nepal finance tips, tax guides, calculator tutorials and more.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {([
            { id: 'all', label: `All (${items.length})` },
            { id: 'posts', label: `Blog Posts (${postCount})` },
            { id: 'guides', label: `SEO Guides (${guideCount})` },
          ] as { id: ContentType, label: string }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors
                ${tab === t.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-5/6 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-dashed
                          border-gray-200 rounded-2xl">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500 font-medium mb-1">
              {tab === 'guides' ? 'No SEO guides yet' : 'No posts yet'}
            </div>
            <div className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
              {tab === 'guides'
                ? 'Create SEO landing pages from the admin panel to rank in Google.'
                : 'Blog posts will appear here once published from the admin panel.'}
            </div>

          </div>
        )}

        {/* Content grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(item => {
              const href = item.type === 'guide'
                ? `/guide/${item.slug}`
                : `/blog/${item.slug}`;
              const pubDate = item.date
                ? new Date(item.date).toLocaleDateString('en-NP', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })
                : '';
              const readMins = Math.max(1, Math.round((item.wordCount || 300) / 200));

              return (
                <Link key={item.id} href={href}
                  className="bg-white border border-gray-200 rounded-2xl p-5
                             hover:border-blue-300 hover:shadow-sm transition-all
                             group block">
                  {/* Type + category */}
                  <div className="flex items-center gap-2 mb-2.5">
                    {item.type === 'guide' ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold
                                       bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <BookOpen className="w-2.5 h-2.5" /> GUIDE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-bold
                                       bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        <FileText className="w-2.5 h-2.5" /> POST
                      </span>
                    )}
                    {item.category && (
                      <span className="text-[9px] font-semibold text-gray-400 uppercase
                                       tracking-wider">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-gray-900 leading-snug
                                 group-hover:text-blue-700 transition-colors mb-2">
                    {item.title}
                  </h2>

                  {/* Excerpt */}
                  {item.excerpt && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                      {item.excerpt}
                    </p>
                  )}

                  {/* Footer meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {pubDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readMins}m read
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400
                                          group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
