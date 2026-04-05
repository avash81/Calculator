/**
 * @fileoverview Admin Login — CalcPro.NP
 * Protected by Firebase Authentication.
 * Shows helpful message if Firebase not configured.
 * @component
 */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase not configured. Please set up .env.local with Firebase credentials.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Set secure HttpOnly JWT via the new session API route
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        setError('Firebase session missing. Please try again.');
        return;
      }

      await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-12 w-full max-w-lg relative z-10 scale-100 hover:scale-[1.01] transition-transform duration-500">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-slate-950 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-900/20 mb-6 group transition-all duration-500 hover:rotate-12">
             <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xs">CP</span>
             </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Command Center</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Access — Auth Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Identifier</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              placeholder="admin@calcpro.com.np"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-inner" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Security Protocol</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-inner" 
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-[12px] font-bold text-red-600 flex items-center gap-3 animate-shake">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-slate-950 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-slate-900/20 hover:shadow-blue-500/20 disabled:opacity-40 transition-all flex items-center justify-center gap-3 active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Initiate Session'
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest underline decoration-slate-100 underline-offset-4 cursor-default">
             Secure Edge Network • Port 3004
           </p>
        </div>
      </div>
    </div>
  );
}
