'use client';

import { Card, Input, Select } from '@/components/ui';
import { Globe } from 'lucide-react';
import { clsx } from 'clsx';

interface SEOPanelProps {
  data: {
    status: string;
    focusKeyword: string;
    metaTitle: string;
    metaDescription: string;
    slug: string;
  };
  onChange: (field: string, value: string) => void;
  onAutoGenerateSlug: () => void;
}

export default function SEOPanel({ data, onChange, onAutoGenerateSlug }: SEOPanelProps) {
  // Simple SEO scoring logic
  const getScore = () => {
    let score = 0;
    if (data.focusKeyword) score += 20;
    if (data.metaTitle.length >= 50 && data.metaTitle.length <= 60) score += 20;
    if (data.metaDescription.length >= 120 && data.metaDescription.length <= 155) score += 20;
    if (data.slug) score += 20;
    if (data.metaTitle.toLowerCase().includes(data.focusKeyword.toLowerCase())) score += 20;
    return score;
  };

  const score = getScore();
  const scoreColor = score < 50 ? 'text-red-500' : score < 80 ? 'text-amber-500' : 'text-green-500';

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Publish Status</h3>
        <Select
          label="Post Status"
          value={data.status}
          onChange={(v) => onChange('status', v)}
          options={[
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Scheduled', value: 'scheduled' },
          ]}
        />
      </Card>

      {/* SEO Score Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">SEO Score</h3>
          <span className={clsx("text-lg font-black", scoreColor)}>{score}/100</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
          <div 
            className={clsx("h-full transition-all duration-500", 
              score < 50 ? 'bg-red-500' : score < 80 ? 'bg-amber-500' : 'bg-green-500'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </Card>

      {/* SEO Fields */}
      <Card className="p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Search Optimization</h3>
        
        <Input
          label="Focus Keyword"
          value={data.focusKeyword}
          onChange={(v) => onChange('focusKeyword', v)}
          placeholder="e.g. Nepal Income Tax 2082"
        />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-700">SEO Title</label>
            <span className={clsx("text-[10px] font-bold", 
              data.metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'
            )}>{data.metaTitle.length}/60</span>
          </div>
          <input
            type="text"
            value={data.metaTitle}
            onChange={(e) => onChange('metaTitle', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/20 rounded-xl focus:ring-2 focus:ring-cp-blue outline-none text-sm"
            placeholder="SEO Title (50-60 chars)"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-700">Meta Description</label>
            <span className={clsx("text-[10px] font-bold", 
              data.metaDescription.length > 155 ? 'text-red-500' : 'text-slate-400'
            )}>{data.metaDescription.length}/155</span>
          </div>
          <textarea
            value={data.metaDescription}
            onChange={(e) => onChange('metaDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/20 rounded-xl focus:ring-2 focus:ring-cp-blue outline-none text-sm resize-none"
            placeholder="Meta Description (120-155 chars)"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-700">URL Slug</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.slug}
              onChange={(e) => onChange('slug', e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/20 rounded-xl focus:ring-2 focus:ring-cp-blue outline-none text-sm"
              placeholder="url-slug-here"
            />
            <button 
              onClick={onAutoGenerateSlug}
              className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/20 rounded-xl hover:bg-cp-blue hover:text-white transition-all"
              title="Auto-generate from title"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Google Preview */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Google Preview</h3>
        <div className="space-y-1">
          <div className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate">
            {data.metaTitle || 'Your SEO Title Will Appear Here'}
          </div>
          <div className="text-[#006621] text-sm truncate">
            calcpro.com.np/blog/{data.slug || 'your-slug'}
          </div>
          <div className="text-[#545454] text-sm line-clamp-2">
            {data.metaDescription || 'Your meta description will appear here. Make sure to include your focus keyword naturally to improve search rankings.'}
          </div>
        </div>
      </Card>
    </div>
  );
}
