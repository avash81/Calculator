'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  FileText, 
  TrendingUp, 
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
      <div className="max-w-7xl mx-auto space-y-12 pb-20 font-sans">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest leading-none">Operational Intelligence — Real-time Metrics</p>
           </div>
           <div className="flex items-center gap-4">
              <Link href="/admin/posts/new" className="bg-slate-950 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2.5 shadow-2xl shadow-slate-900/20 transition-all active:scale-95 group">
                 <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                 Deploy New Intel
              </Link>
           </div>
        </header>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: 'Total Inventory', value: stats.total, sub: 'Managed Articles', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Live Authority', value: stats.published, sub: 'Active Nodes', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'SEO Precision', value: `${stats.seoScore}%`, sub: 'Optimization Rating', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
             { label: 'Index Velocity', value: 'Live', sub: 'HMR Gateway', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' }
           ].map((s, i) => (
             <div key={i} className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                   <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                   </div>
                   <div className="text-[10px] font-black text-slate-300 group-hover:text-blue-400 transition-colors">0{i+1}</div>
                </div>
                <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter relative z-10">{s.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">{s.label}</div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Primary Control (Recent Content) */}
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-4">
                 <h2 className="text-[18px] font-black text-slate-900 flex items-center gap-3">
                    Recent Activity
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                 </h2>
                 <Link href="/admin/posts" className="text-[11px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Audit All Logs →</Link>
              </div>

              <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 relative">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Identifier</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {posts.map(p => (
                         <tr key={p.id} className="hover:bg-blue-50/30 transition-all duration-300 group cursor-default">
                            <td className="px-10 py-7">
                               <div className="font-black text-slate-900 text-[15px] group-hover:text-blue-600 transition-colors leading-none mb-1.5">{p.title}</div>
                               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">ID: {p.slug}</div>
                            </td>
                            <td className="px-10 py-7 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 ${
                                 p.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                               }`}>
                                  <span className={`w-1 h-1 rounded-full ${p.status === 'published' ? 'bg-emerald-600' : 'bg-orange-600'}`} />
                                  {p.status}
                               </span>
                            </td>
                            <td className="px-10 py-7 text-right">
                               <Link href={`/admin/posts/${p.id}`} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl inline-flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:scale-110 transition-all">
                                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </td>
                         </tr>
                       ))}
                       {posts.length === 0 && !loading && (
                         <tr><td colSpan={3} className="px-8 py-24 text-center">
                            <div className="flex flex-col items-center gap-2 opacity-30">
                               <FileText className="w-12 h-12" />
                               <span className="text-[11px] font-black uppercase tracking-widest">No intelligence logs found.</span>
                            </div>
                         </td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Secondary Insights */}
           <div className="lg:col-span-4 space-y-10">
              <h2 className="text-[18px] font-black text-slate-900 px-4">Global Signal</h2>
              
              <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                 <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
                 <div className="flex items-center justify-between mb-10">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Authority</span>
                 </div>
                 <h3 className="text-3xl font-black mb-10 tracking-tight leading-tight">Architecture Strength</h3>
                 
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                          <span>Edge Response</span>
                          <span className="text-blue-500">98%</span>
                       </div>
                       <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full w-[98%]" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                          <span>Schema Health</span>
                          <span className="text-purple-500">100%</span>
                       </div>
                       <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full w-[100%]" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-xl shadow-slate-200/40">
                 <div className="flex items-center gap-5 text-amber-600">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shrink-0 shadow-inner">
                       <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                       <div className="text-[11px] font-black uppercase tracking-widest">Protocol Alert</div>
                       <div className="text-[12px] font-bold text-slate-500 leading-tight">Syncing M25 Factors for 2083 Engineering.</div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Link href="/admin" className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-600 group transition-all duration-500 text-center border border-slate-100 hover:border-transparent shadow-sm">
                       <Calculator className="w-5 h-5 mx-auto mb-3 text-blue-600 group-hover:text-white transition-colors" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Directory</span>
                    </Link>
                    <Link href="/about" className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-600 group transition-all duration-500 text-center border border-slate-100 hover:border-transparent shadow-sm">
                       <ShieldCheck className="w-5 h-5 mx-auto mb-3 text-blue-600 group-hover:text-white transition-colors" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Authority</span>
                    </Link>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
