'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { InternalLinks } from '@/components/seo/InternalLinks';
import { ShareResult } from '@/components/calculator/ShareResult';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrlEscaped(url: string): string | null {
  const u = url.trim().toLowerCase();
  // Reject dangerous schemes.
  if (u.startsWith('javascript:') || u.startsWith('data:') || u.startsWith('vbscript:')) return null;
  // Allow http(s) and safe local targets.
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/') || u.startsWith('#')) return url;
  return null;
}

function renderContent(content: string): string {
  // Escape any raw HTML from Firestore before applying markdown-like formatting.
  const escaped = escapeHtml(content);
  return escaped
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 scroll-mt-20">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-800 mt-5 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_m, label, url) => {
      const safe = sanitizeUrlEscaped(String(url));
      if (!safe) return `<span>${label}</span>`;
      return `<a href="${safe}" class="text-blue-600 underline hover:text-blue-800" rel="noopener noreferrer">${label}</a>`;
    })
    .replace(/^(?!<[hlo]).+$/gm, (l) => l.trim() ? `<p class="mb-4 text-gray-700 leading-relaxed">${l}</p>` : '');
}

export default function PageClient({ post, related }: { post: any, related: any[] }) {
  const html = useMemo(() => post ? renderContent(post.content || '') : '', [post]);

  const faqs = useMemo(() => {
    if (!post?.content) return [];
    const matches = [...post.content.matchAll(/^### (.+\?)\n([\s\S]+?)(?=\n###|\n##|$)/gm)];
    return matches.slice(0, 6).map((m: any) => ({
      question: m[1],
      answer: m[2].trim().substring(0, 400)
    }));
  }, [post]);

  const wordCount = post?.content?.split(/\s+/).length || 0;
  const readMins = Math.max(1, Math.round(wordCount / 200));

  const pubDate = post.date
    ? new Date(post.date).toLocaleDateString('en-NP', { year:'numeric', month:'long', day:'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </nav>

        {/* Category pill */}
        {post.category && (
          <div className="inline-block bg-blue-100 text-blue-700 text-xs
                          font-semibold px-3 py-1 rounded-full mb-3">
            {post.category}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900
                       leading-tight mb-3">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base text-gray-500 mb-4 leading-relaxed
                        border-l-4 border-blue-300 pl-4 italic">
            {post.excerpt}
          </p>
        )}

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-4
                        border-b border-gray-200 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <time dateTime={post.date}>{pubDate}</time>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{readMins} min read</span>
          </div>
          <span>·</span>
          <span>{wordCount} words</span>
        </div>

        {/* Article body */}
        <div
          className="prose prose-sm max-w-none text-gray-700
                     prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* FAQ section (auto-extracted) */}
        {faqs.length >= 2 && (
          <div className="mt-8">
            <CalcFAQ faqs={faqs} />
          </div>
        )}

        {/* Internal links — related calculators */}
        {post.relatedCalcs?.length > 0 && (
          <InternalLinks
            slugs={post.relatedCalcs}
            heading="Free Tools for This Topic"
          />
        )}

        {/* Share */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs font-bold text-gray-400 uppercase
                          tracking-wider mb-3">
            Share this post
          </div>
          <ShareResult
            title={post.title}
            result="📝 Read full article"
            calcUrl={`https://calcpro.com.np/blog/${post.slug}`}
          />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-bold text-gray-900 uppercase
                           tracking-wider mb-4">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r, i) => (
                <Link key={i} href={`/blog/${r.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4
                             hover:border-blue-300 hover:shadow-sm transition-all block">
                  {r.category && (
                    <span className="text-[9px] font-bold bg-blue-100 text-blue-700
                                     px-1.5 py-0.5 rounded mb-2 inline-block">
                      {r.category.toUpperCase()}
                    </span>
                  )}
                  <div className="text-sm font-semibold text-gray-900 leading-snug">
                    {r.title}
                  </div>
                  {r.excerpt && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {r.excerpt}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link href="/blog"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
          </Link>
        </div>
      </div>
    </div>
  );
}
