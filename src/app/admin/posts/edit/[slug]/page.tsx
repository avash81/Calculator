'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import PostEditor from '@/components/admin/PostEditor';
import SEOPanel from '@/components/admin/SEOPanel';
import { Button } from '@/components/ui';
import { Save, Send, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState({
    status: 'draft',
    focusKeyword: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        
        setTitle(data.title);
        setBody(data.body);
        setSeoData({
          status: data.status,
          focusKeyword: data.focusKeyword || '',
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          slug: data.slug,
        });
      } catch (err) {
        console.error(err);
        router.push('/admin/posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, router]);

  const handleSeoChange = (field: string, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const autoGenerateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    handleSeoChange('slug', newSlug);
  };

  const handleSave = async (publish = false) => {
    const status = publish ? 'published' : seoData.status;
    
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST', // We use POST for both create and update in our simple API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          ...seoData,
          status,
          date: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        router.push('/admin/posts');
      } else {
        alert('Failed to update post');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating post');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6">
          <Link href="/admin/posts" className="inline-flex items-center gap-2 text-slate-500 hover:text-cp-blue transition-colors text-sm font-bold uppercase tracking-wider">
            <ChevronLeft className="w-4 h-4" /> Back to Posts
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Editor Area */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Post Title..."
                className="flex-1 bg-transparent text-3xl font-black text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700/20"
              />
            </div>

            <PostEditor content={body} onChange={setBody} />
            
            <div className="flex items-center gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => handleSave(false)}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Update Draft
              </Button>
              <Button 
                variant="gold" 
                onClick={() => handleSave(true)}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Update & Publish
              </Button>
            </div>
          </div>

          {/* Sidebar SEO Area */}
          <div className="w-full lg:w-[380px] shrink-0">
            <SEOPanel 
              data={seoData} 
              onChange={handleSeoChange} 
              onAutoGenerateSlug={autoGenerateSlug}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
