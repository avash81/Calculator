'use client';
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Button, Input } from '@/components/ui';
import { Save, Eye, Image as ImageIcon, Settings } from 'lucide-react';
import { getDb, getFirebaseAuth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Finance');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title,
        slug,
        category,
        content,
        excerpt,
        metaTitle,
        metaDesc,
        keywords,
        author: getFirebaseAuth()?.currentUser?.displayName || 'Admin',
        authorUid: getFirebaseAuth()?.currentUser?.uid,
        status: 'published', // Default to published for now
        date: new Date().toISOString(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(getDb()!, 'posts'), postData);
      alert('Post published successfully!');
      router.push('/admin/posts');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create New Post</h1>
            <p className="text-sm text-slate-500">Draft your next expert guide for CalcPro Nepal.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-6">
              <Input 
                label="Post Title" 
                value={title} 
                onChange={handleTitleChange} 
                placeholder="e.g., How to Calculate Nepal Income Tax FY 2082/83"
                className="text-lg font-bold"
              />
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-bold uppercase tracking-widest">Permalink:</span>
                <span className="font-mono">calcpro.com.np/blog/</span>
                <input 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Content (HTML Supported)</label>
                <textarea 
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-[500px] p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-500 outline-none font-mono text-sm resize-none"
                  placeholder="Write your post content here..."
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" /> SEO Settings
              </h3>
              <div className="space-y-4">
                <Input 
                  label="Meta Title" 
                  value={metaTitle} 
                  onChange={setMetaTitle} 
                  placeholder="SEO Title (max 60 chars)"
                />
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Meta Description</label>
                  <textarea 
                    value={metaDesc} 
                    onChange={e => setMetaDesc(e.target.value)}
                    className="w-full h-24 p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-500 outline-none text-sm resize-none"
                    placeholder="Brief summary for search results..."
                  />
                </div>
                <Input 
                  label="Keywords" 
                  value={keywords} 
                  onChange={setKeywords} 
                  placeholder="e.g., nepal tax, income tax calculator, 2082/83"
                />
              </div>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Post Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-500 outline-none text-sm"
                  >
                    <option>Finance</option>
                    <option>Nepal Tools</option>
                    <option>Health</option>
                    <option>Education</option>
                    <option>Utility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Excerpt</label>
                  <textarea 
                    value={excerpt} 
                    onChange={e => setExcerpt(e.target.value)}
                    className="w-full h-32 p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-500 outline-none text-sm resize-none"
                    placeholder="Short summary for the blog listing page..."
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Featured Image</h3>
              <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold">Upload Image</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
