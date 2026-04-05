'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';
import { getDb, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import {
  PlusCircle, Edit, Trash2, Globe, FileText, ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';

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
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
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
      <div className="space-y-8 font-sans max-w-[1500px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">SEO Trajectory</h1>
            <p className="text-slate-500 mt-1 text-[13px] font-bold uppercase tracking-widest">Manage Custom Landing Nodes.</p>
          </div>
          <Link href="/admin/seo-pages/new" className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
            <PlusCircle className="w-4 h-4" /> Deploy SEO Node
          </Link>
        </div>

        {/* Intelligence Box */}
        <div className="bg-slate-950 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 pointer-events-none" />
          <div className="flex gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex flex-shrink-0 items-center justify-center border border-blue-500/30">
               <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[14px] font-black tracking-wide text-white mb-2">Tactical SEO Pages</div>
              <div className="text-[12px] font-medium text-slate-300 leading-relaxed max-w-4xl">
                Unlike temporal blog posts, these nodes are <strong className="text-white">evergreen gravity wells</strong> designed to pull high-volume queries indefinitely. Create focused guides (&quot;Calculate EMI Nepal&quot;) and seamlessly anchor them to our native calculators to achieve algorithmic dominance.
              </div>
            </div>
          </div>
        </div>

        {/* Pages Grid/List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-100 rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
               <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-[16px] font-black text-slate-900 mb-2">No SEO Nodes Active</div>
            <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest max-w-[300px] mx-auto mb-8 leading-relaxed">
              Create your first gravity well. Start with high volume targets.
            </div>
            <Link href="/admin/seo-pages/new" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
              <PlusCircle className="w-4 h-4" /> Initialize Node
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Node Identifier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Focus Target</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Density</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pages.map(page => (
                    <tr key={page.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{page.title}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                               <span className={clsx(
                                 "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                                 page.status === 'published' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                               )}>
                                 {page.status}
                               </span>
                               <span className="text-[11px] font-bold text-slate-400">/guide/{page.slug}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[12px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                            {page.focusKeyword || 'Uncategorized'}
                         </span>
                      </td>
                      <td className="px-8 py-5">
                         <span className={clsx(
                            "text-[12px] font-black",
                            (page.wordCount || 0) >= 600 ? "text-green-500" : (page.wordCount || 0) >= 300 ? "text-orange-400" : "text-red-500"
                         )}>
                            {page.wordCount || 0} w
                         </span>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center justify-end gap-1">
                            {page.status === 'published' && (
                              <a href={`/guide/${page.slug}`} target="_blank" rel="noopener" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <Link href={`/admin/seo-pages/edit/${page.slug}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(page.id, page.title)} disabled={deleting === page.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEO Algorithm Targets */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 mt-12">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Algorithm Targets 2082</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { kw: 'nepal income tax 2082 83', slug: 'nepal-income-tax-guide-2082-83', vol: 'Very High' },
              { kw: 'how to calculate emi nepal', slug: 'emi-calculator-guide-nepal', vol: 'High' },
              { kw: 'nepali date converter bs ad', slug: 'nepali-date-converter-guide', vol: 'Very High' },
              { kw: 'nepal salary calculator ssf', slug: 'nepal-salary-ssf-guide-2082', vol: 'High' },
              { kw: 'gpa calculator nepal tu ku', slug: 'gpa-calculator-nepal-guide', vol: 'High' },
              { kw: 'bmi calculator nepal', slug: 'bmi-calculator-guide-nepal', vol: 'Medium' },
              { kw: 'sip vs fd nepal which better', slug: 'sip-vs-fd-nepal-guide', vol: 'Medium' },
              { kw: 'nepal home loan interest rate 2082', slug: 'nepal-home-loan-guide-2082', vol: 'High' },
            ].map((item, idx) => {
              const alreadyCreated = pages.some(p => p.slug === item.slug);
              return (
                <div key={idx} className={clsx(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all",
                  alreadyCreated ? "border-green-100 bg-green-50/50" : "border-slate-100 bg-slate-50 hover:border-blue-200"
                )}>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-[13px] font-bold text-slate-900 truncate">{item.kw}</div>
                    <div className="text-[10px] font-bold text-slate-400 truncate mt-1">/guide/{item.slug}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      "text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest",
                      item.vol === 'Very High' ? 'bg-red-100 text-red-600' :
                      item.vol === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    )}>
                      {item.vol}
                    </span>
                    {alreadyCreated ? (
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-100/50 px-2 py-1 rounded-lg">Done</span>
                    ) : (
                      <Link href={`/admin/seo-pages/new?slug=${item.slug}&kw=${encodeURIComponent(item.kw)}`} className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        Init →
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