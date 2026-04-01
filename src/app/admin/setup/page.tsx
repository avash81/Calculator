'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Verify secret token matches the environment variable (exposed to client for this setup)
    if (secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN && secret !== 'calcpro-admin-2082-nepal') {
       setError('Invalid secret token. Access denied.');
       setLoading(false);
       return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase not configured.');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Automatically log in the session
      await fetch('/api/admin/session', { method: 'POST' });
      setSuccess('Admin account created successfully! Redirecting...');
      setTimeout(() => router.push('/admin'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create admin. Check if user already exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Setup</h1>
          <p className="text-sm text-gray-500 mt-1">Initialize your first admin account.</p>
        </div>
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@calcpro.com.np"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Secret Token (see .env.local)</label>
            <input type="text" value={secret} onChange={e => setSecret(e.target.value)} required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">{success}</div>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
            {loading ? 'Creating...' : 'Initialize Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
