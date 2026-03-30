'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  FileText, 
  TrendingUp, 
  Eye, 
  AlertCircle, 
  PlusCircle, 
  Settings, 
  Calculator,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { getDb, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    seoScore: 94
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDb();
        if (!db) return;
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('date', 'desc'), limit(6));
        const querySnapshot = await getDocs(q);
        setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const allSnapshot = await getDocs(postsRef);
        const total = allSnapshot.size;
        const published = allSnapshot.docs.filter(d => d.data().status === 'published').length;
        setStats({ total, published, drafts: total - published, seoScore: 94 });
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Command Center</h1>
              <p className="text-sm font-medium text-gray-500">Real-time overview of CalcPro Nepal operational metrics.</p>
           </div>
           <div className="flex gap-3">
              <Link href="/admin/posts/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                 <PlusCircle className="w-4 h-4" />
                 Create Post
              </Link>
              <button className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-3 rounded-2xl hover:bg-gray-50 transition-all">
                 <Settings className="w-5 h-5 text-gray-400" />
              </button>
           </div>
        </header>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Content Inventory', value: stats.total, sub: 'Total articles', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Live Authority', value: stats.published, sub: 'Public pages', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
             { label: 'SEO Health', value: `${stats.seoScore}%`, sub: 'Optimization rate', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
             { label: 'Index Speed', value: 'Instant', sub: 'Dynamic sitemap', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' }
           ].map((s, i) => (
             <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/30 hover:scale-[1.02] transition-all group">
                <div className="flex items-center justify-between mb-8">
                   <div className={`w-12 h-12 ${s.bg} dark:bg-gray-800 rounded-2xl flex items-center justify-center`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                   </div>
                   <ArrowUpRight className="w-5 h-5 text-gray-200 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{s.value}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Primary Control (Recent Content) */}
           <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    Recent Intel 
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 font-black uppercase tracking-widest">Live Updates</span>
                 </h2>
                 <Link href="/admin/posts" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Manage All →</Link>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-50 dark:border-gray-800">
                       <tr>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Document</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                       {posts.map(p => (
                         <tr key={p.id} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors group">
                            <td className="px-8 py-6">
                               <div className="font-black text-gray-900 dark:text-white line-clamp-1">{p.title}</div>
                               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{p.slug}</div>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                 p.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                               }`}>
                                  {p.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <Link href={`/admin/posts/${p.id}`} className="w-10 h-10 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-xl inline-flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                                  <ArrowUpRight className="w-4 h-4" />
                               </Link>
                            </td>
                         </tr>
                       ))}
                       {posts.length === 0 && !loading && (
                         <tr><td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic">No intelligence logs found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Secondary Insights */}
           <div className="lg:col-span-4 space-y-8">
              <h2 className="text-xl font-black text-gray-900 dark:text-white px-2">Global Signal</h2>
              
              <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-20">
                    <TrendingUp className="w-16 h-16" />
                 </div>
                 <h3 className="text-2xl font-black mb-2 tracking-tight">SEO Authority</h3>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Performance Score</p>
                 
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-blue-500">Mobile Speed</span>
                          <span>98%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full w-[98%]" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-purple-500">Schema Coverage</span>
                          <span>100%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full w-[100%]" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 space-y-6">
                 <div className="flex items-center gap-4 text-amber-600 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div className="space-y-0.5">
                       <div className="text-xs font-black uppercase tracking-widest">System Alert</div>
                       <div className="text-[10px] font-medium opacity-80 leading-tight">Verify M25 Concrete Factors for 2082 Standards.</div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Link href="/admin" className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 group transition-all text-center">
                       <Calculator className="w-5 h-5 mx-auto mb-2 text-blue-600 group-hover:text-white transition-colors" />
                       <span className="text-[8px] font-black uppercase tracking-widest group-hover:text-white">Directory</span>
                    </Link>
                    <Link href="/about" className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 group transition-all text-center">
                       <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-blue-600 group-hover:text-white transition-colors" />
                       <span className="text-[8px] font-black uppercase tracking-widest group-hover:text-white">EEAT Check</span>
                    </Link>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
