'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Save, Eye, Image as ImageIcon, Settings, FileText, ChevronLeft } from 'lucide-react';
import { getDb, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.slug as string; // in admin/posts/page.tsx it maps to post.id

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Finance');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [imageTop, setImageTop] = useState('');
  const [imageMiddle, setImageMiddle] = useState('');
  const [imageBottom, setImageBottom] = useState('');
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const db = getDb();
        if (!db) return;
        const targetDoc = await getDoc(doc(db, 'posts', postId));
        
        if (targetDoc.exists()) {
          const data = targetDoc.data();
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setCategory(data.category || 'Finance');
          setContent(data.content || '');
          setExcerpt(data.excerpt || '');
          setMetaTitle(data.metaTitle || '');
          setMetaDesc(data.metaDesc || '');
          setKeywords(data.keywords || '');
          setImageTop(data.imageTop || '');
          setImageMiddle(data.imageMiddle || '');
          setImageBottom(data.imageBottom || '');
        } else {
          alert('Post not found in database.');
          router.push('/admin/posts');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Error loading post.');
        router.push('/admin/posts');
      } finally {
        setInitialLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
  };

  const handleUpdate = async () => {
    if (!title || !slug || !content) {
      alert('Please fill in required fields (Title, Permalink, Content)');
      return;
    }

    setSaving(true);
    try {
      const db = getDb();
      if (!db) return;
      const docRef = doc(db, 'posts', postId);

      await updateDoc(docRef, {
        title,
        slug,
        category,
        content,
        excerpt,
        metaTitle,
        metaDesc,
        keywords,
        imageTop,
        imageMiddle,
        imageBottom,
        updatedAt: serverTimestamp(),
      });

      alert('Post updated successfully!');
      router.push('/admin/posts');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center font-sans">
           <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin mb-4" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse leading-none">Fetching Intelligence...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-[1500px] mx-auto space-y-8 pb-24 font-sans">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-2">
           <Link href="/admin/posts" className="inline-flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors bg-white border border-slate-100 pl-3 pr-5 py-2.5 rounded-full shadow-sm">
             <ChevronLeft className="w-4 h-4" /> Back to Inventory
           </Link>
           <div className="flex items-center gap-4">
              <Link href={`/blog/${slug}`} target="_blank" className="flex items-center gap-2 bg-white border border-slate-100 text-slate-500 hover:text-slate-900 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-sm">
                 <Eye className="w-4 h-4" /> Preview Live
              </Link>
              <button 
                 onClick={handleUpdate} 
                 disabled={saving}
                 className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                 {saving ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <Save className="w-4 h-4" />
                 )}
                 {saving ? 'Updating...' : 'Update Intel'}
              </button>
           </div>
        </div>

        <header className="mb-10">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Node modifier</h1>
           <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-2">Update Operational Data</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Editor Surface */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-50 transition-colors" />
               <div className="relative z-10 space-y-8">
                  
                  {/* Title & Slug */}
                  <div className="space-y-4">
                     <input 
                        value={title} 
                        onChange={(e) => handleTitleChange(e.target.value)} 
                        placeholder="Enter the main headline here..."
                        className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 focus:outline-none bg-transparent"
                     />
                     <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Target Path:</span>
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg overflow-hidden focus-within:border-emerald-300 transition-colors">
                           <span className="text-slate-400 bg-slate-100 px-3 py-2 border-r border-slate-100">calcpro.com.np/blog/</span>
                           <input 
                              value={slug} 
                              onChange={e => setSlug(e.target.value)}
                              className="bg-transparent px-3 py-2 outline-none text-slate-700 min-w-[200px]"
                              placeholder="url-slug"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Body Editor */}
                  <div>
                     <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-[14px] font-black text-slate-900">HTML Source Content</h2>
                     </div>
                     <textarea 
                        value={content} 
                        onChange={e => setContent(e.target.value)}
                        className="w-full h-[800px] p-6 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 outline-none font-mono text-[13px] leading-relaxed text-slate-700 resize-y transition-all shadow-inner custom-scrollbar"
                        placeholder="## H2 Example&#10;Write your HTML content here..."
                     />
                  </div>
               </div>
            </div>

            {/* SEO Base Panel */}
            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/40">
               <div className="flex items-center gap-3 mb-8">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-[14px] font-black text-slate-900">Search Engine Indexing</h2>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Meta Title</label>
                     <input 
                        value={metaTitle} 
                        onChange={(e) => setMetaTitle(e.target.value)} 
                        placeholder="Google Search Result Title..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Meta Descriptor</label>
                     <textarea 
                        value={metaDesc} 
                        onChange={(e) => setMetaDesc(e.target.value)} 
                        placeholder="160 character snippet..."
                        className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner resize-none custom-scrollbar" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Primary Keywords</label>
                     <input 
                        value={keywords} 
                        onChange={(e) => setKeywords(e.target.value)} 
                        placeholder="nepal tax, calculator, engineering..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner" 
                     />
                  </div>
               </div>
            </div>
          </div>

          {/* Secondary Control Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Meta & Categorization */}
            <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-[80px] opacity-30" />
               <div className="relative z-10 space-y-6">
                  <h3 className="text-[16px] font-black tracking-tight border-b border-white/10 pb-4">Routing & Hierarchy</h3>
                  
                  <div className="space-y-3">
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Category</label>
                     <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 focus:border-emerald-500 outline-none text-[13px] font-bold text-white shadow-inner appearance-none custom-select"
                     >
                        <option value="Finance" className="text-slate-900">Finance</option>
                        <option value="Nepal Tools" className="text-slate-900">Nepal Tools</option>
                        <option value="Health" className="text-slate-900">Health</option>
                        <option value="Education" className="text-slate-900">Education</option>
                        <option value="Utility" className="text-slate-900">Utility</option>
                     </select>
                  </div>
                  
                  <div className="space-y-3">
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed Excerpt</label>
                     <textarea 
                        value={excerpt} 
                        onChange={e => setExcerpt(e.target.value)}
                        className="w-full h-28 p-4 rounded-xl border border-white/10 bg-white/5 focus:border-emerald-500 outline-none text-[13px] leading-relaxed text-slate-200 resize-none shadow-inner"
                        placeholder="Internal blog listing summary..."
                     />
                  </div>
               </div>
            </div>

            {/* Multi-Image SEO Slots (The Core Feature) */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                     <ImageIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-[14px] font-black text-slate-900">Multi-Image Pipeline</h3>
               </div>
               <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-6">Inject absolute image URLs to dominate Google Visual Search placements.</p>
               
               <div className="space-y-5">
                  <div className="space-y-2">
                     <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Phase 1: Feature (Top)</label>
                     <input 
                        value={imageTop} 
                        onChange={(e) => setImageTop(e.target.value)} 
                        placeholder="https://..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-emerald-400 transition-all shadow-inner" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Phase 2: Context (Middle)</label>
                     <input 
                        value={imageMiddle} 
                        onChange={(e) => setImageMiddle(e.target.value)} 
                        placeholder="Auto-injected after 1st H2..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-emerald-400 transition-all shadow-inner" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Phase 3: Summary (Bottom)</label>
                     <input 
                        value={imageBottom} 
                        onChange={(e) => setImageBottom(e.target.value)} 
                        placeholder="https://..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-emerald-400 transition-all shadow-inner" 
                     />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
