import Link from 'next/link';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { InternalLinks } from '@/components/seo/InternalLinks';
import { ShareResult } from '@/components/calculator/ShareResult';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

function renderContent(content: string): string {
  if (!content) return '';
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 scroll-mt-20">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-800 mt-5 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800">$1</a>')
    .replace(/^(?!<[hlo]).+$/gm, (l) => l.trim() ? `<p class="mb-4 text-gray-700 leading-relaxed">${l}</p>` : '');
}

export default function BlogPostContent({ post, related }: { post: any; related: any[] }) {
  const html = renderContent(post.content || '');
  
  // Parse FAQs from content for rich results
  const faqs = (() => {
    if (!post?.content) return [];
    const matches = [...post.content.matchAll(/^### (.+\?)\n([\s\S]+?)(?=\n###|\n##|$)/gm)];
    return matches.slice(0, 6).map((m: any) => ({
      question: m[1],
      answer: m[2].trim().substring(0, 400)
    }));
  })();

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
          <div className="inline-block bg-[#E8F0FE] text-[#1A73E8] text-[10px]
                          font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
            {post.category}
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl font-black text-[#202124]
                       leading-tight mb-4 tracking-tighter">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-[#5F6368] mb-6 leading-relaxed
                        border-l-4 border-[#1A73E8] pl-6 italic font-medium">
            {post.excerpt}
          </p>
        )}

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-4
                        border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.date}>{pubDate}</time>
          </div>
          <span>·</span>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{readMins} min read</span>
          </div>
          <span>·</span>
          <span>{wordCount} words</span>
        </div>

        {/* Article body */}
        <div
          className="prose prose-sm max-w-none text-[#3C4043]
                     prose-a:text-[#1A73E8] prose-a:font-bold prose-headings:text-[#202124]"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* FAQ section (Client Island) */}
        {faqs.length >= 2 && (
          <div className="mt-12">
            <CalcFAQ faqs={faqs} />
          </div>
        )}

        {/* Internal links */}
        {post.relatedCalcs?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
             <InternalLinks
               slugs={post.relatedCalcs}
               heading="Free Tools for This Topic"
             />
          </div>
        )}

        {/* Share (Client Island) */}
        <div className="mt-12 pt-10 border-t border-gray-100">
          <div className="text-[10px] font-black text-gray-300 uppercase
                          tracking-[0.2em] mb-4">
            Share this investigation
          </div>
          <ShareResult
            title={post.title}
            result="📝 Read full article"
            calcUrl={`https://calcpro.com.np/blog/${post.slug}`}
          />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-[#202124] uppercase
                           tracking-widest mb-6 border-b-2 border-[#1A73E8] inline-block pb-1">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((r, i) => (
                <Link key={i} href={`/blog/${r.slug}`}
                  className="bg-white border border-[#E8EAED] rounded-2xl p-6
                             hover:border-[#1A73E8] hover:shadow-xl transition-all block group">
                  {r.category && (
                    <span className="text-[9px] font-black bg-[#F8F9FA] text-gray-400
                                     group-hover:text-[#1A73E8] px-2 py-0.5 rounded mb-3 inline-block uppercase tracking-widest">
                      {r.category}
                    </span>
                  )}
                  <div className="text-base font-bold text-[#202124] group-hover:text-[#1A73E8] leading-tight transition-colors">
                    {r.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-black text-[#1A73E8] uppercase tracking-widest border border-[#E8F0FE] px-8 py-4 rounded-full hover:bg-[#E8F0FE] transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to blog directory
          </Link>
        </div>
      </div>
    </div>
  );
}
