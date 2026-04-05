import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut,
  Menu,
  X,
  Globe,
  Newspaper,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { NepalFlag } from '@/components/ui/NepalFlag';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
       setLoading(false);
       return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'SEO Pages', href: '/admin/seo-pages', icon: Globe },
    { name: 'Blog Posts', href: '/admin/posts', icon: Newspaper },
    { name: 'New Post', href: '/admin/posts/new', icon: PlusCircle },
  ];

  const handleLogout = async () => {
    try {
      const auth = getFirebaseAuth();
      if (auth) await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
       console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
         <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-4" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse leading-none">Accessing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex text-[14px]">
      {/* Sidebar - The Power Core */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-400 border-r border-white/5 transition-transform duration-500 ease-in-out transform shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col pt-8 pb-6">
          <div className="px-8 mb-12 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                 <NepalFlag className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black text-white tracking-tight leading-none">CALCPRO</span>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1">Command Center</span>
              </div>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <div className="px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Main Console</div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon className={clsx("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-slate-600 group-hover:text-blue-500")} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 mt-8">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-5 py-4 rounded-[1.5rem] text-[13px] font-black text-slate-400 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/5 transition-all duration-300 shadow-sm"
            >
              <LogOut className="w-5 h-5 opacity-60" />
              Sign Out Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Arena */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2.5" />
               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Operational: Edge Gateway</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <Link href="/" target="_blank" className="text-[12px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 transition-colors">
              Review Site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-blue-500 font-black text-xs shadow-lg">
              CP
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
