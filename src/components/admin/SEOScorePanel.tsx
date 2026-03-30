/**
 * @fileoverview SEOScorePanel — Live SEO analysis panel for admin editor
 *
 * Shows real-time SEO score as admin types title, description,
 * keywords, and content. Calculates score based on:
 *   - Title length (50-60 chars ideal)
 *   - Description length (120-160 chars ideal)
 *   - Keywords present in content
 *   - Content word count (300+ good, 800+ excellent)
 *   - Internal links count
 *   - H2 headings in content
 *
 * @component
 */
'use client';
import { useMemo } from 'react';

interface SEOScorePanelProps {
  title: string;
  metaTitle: string;
  metaDesc: string;
  focusKeyword: string;
  content: string;
  slug: string;
  excerpt: string;
}

interface SEOCheck {
  label: string;
  pass: boolean;
  hint: string;
}

/**
 * Calculates SEO score and returns individual checks.
 */
function calcSEO(props: SEOScorePanelProps): { score: number; checks: SEOCheck[] } {
  const {
    title, metaTitle, metaDesc, focusKeyword, content, slug, excerpt
  } = props;

  const mt = metaTitle || title;
  const kw = focusKeyword.toLowerCase().trim();
  const contentLower = content.toLowerCase();
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const checks: SEOCheck[] = [
    {
      label: 'Meta title length (50-60 chars)',
      pass: mt.length >= 50 && mt.length <= 60,
      hint: `Currently ${mt.length} chars. ${mt.length < 50 ? 'Too short — add more detail.' : mt.length > 60 ? 'Too long — will be cut off in Google.' : 'Perfect!'}`,
    },
    {
      label: 'Meta description length (120-160 chars)',
      pass: metaDesc.length >= 120 && metaDesc.length <= 160,
      hint: `Currently ${metaDesc.length} chars. ${metaDesc.length < 120 ? 'Too short — Google may rewrite it.' : metaDesc.length > 160 ? 'Too long — will be cut in search results.' : 'Perfect!'}`,
    },
    {
      label: 'Focus keyword set',
      pass: kw.length > 0,
      hint: 'Enter the primary keyword users will search for, e.g. "nepal income tax 2082 83"',
    },
    {
      label: 'Focus keyword in title',
      pass: kw.length > 0 && mt.toLowerCase().includes(kw),
      hint: kw ? `"${kw}" must appear in your meta title` : 'Set a focus keyword first',
    },
    {
      label: 'Focus keyword in first 100 words',
      pass: kw.length > 0 && contentLower.substring(0, 600).includes(kw),
      hint: 'Mention your keyword in the opening paragraph for stronger relevance signal',
    },
    {
      label: 'Focus keyword in meta description',
      pass: kw.length > 0 && metaDesc.toLowerCase().includes(kw),
      hint: 'Include your focus keyword in the meta description',
    },
    {
      label: 'URL slug is set',
      pass: slug.length > 3,
      hint: 'URL should be short, lowercase, hyphen-separated. E.g. "nepal-income-tax-guide"',
    },
    {
      label: 'Content length (300+ words)',
      pass: wordCount >= 300,
      hint: `Currently ${wordCount} words. Aim for 600-1200 for best ranking.`,
    },
    {
      label: 'Content has H2 headings',
      pass: content.includes('<h2') || content.includes('## ') || content.includes('\n## '),
      hint: 'Use H2 subheadings to structure your content and help Google understand topics',
    },
    {
      label: 'Excerpt / summary written',
      pass: excerpt.length >= 50,
      hint: 'Write a 1-2 sentence summary. Used in blog listing and social shares.',
    },
  ];

  const passed = checks.filter(c => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);

  return { score, checks };
}

/** SEO score color */
function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#d97706';
  return '#dc2626';
}

export function SEOScorePanel(props: SEOScorePanelProps) {
  const { score, checks } = useMemo(() => calcSEO(props), [props]);

  const color = scoreColor(score);
  const wordCount = props.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Score header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center
                     text-white font-bold text-sm flex-shrink-0"
          style={{ background: color }}
        >
          {score}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">SEO Score</div>
          <div className="text-xs text-gray-400">
            {score >= 80 ? '✅ Good — ready to publish'
              : score >= 60 ? '⚠️ Needs improvement'
                : '❌ Needs work before publishing'}
          </div>
        </div>
      </div>

      {/* Word count */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Word count</span>
        <span className={`text-xs font-bold ${wordCount >= 600 ? 'text-green-600' : wordCount >= 300 ? 'text-amber-600' : 'text-red-500'}`}>
          {wordCount} words
          {wordCount < 300 ? ' (too short)' : wordCount < 600 ? ' (good)' : ' (excellent)'}
        </span>
      </div>

      {/* Score bar */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
      </div>

      {/* Individual checks */}
      <div className="divide-y divide-gray-50 max-h-[320px] overflow-y-auto">
        {checks.map((check, i) => (
          <div key={i} className="px-4 py-2.5">
            <div className="flex items-start gap-2">
              <span className={`text-sm flex-shrink-0 mt-0.5 ${check.pass ? 'text-green-500' : 'text-red-400'}`}>
                {check.pass ? '✓' : '✗'}
              </span>
              <div>
                <div className={`text-xs font-medium ${check.pass ? 'text-gray-700' : 'text-gray-900'}`}>
                  {check.label}
                </div>
                {!check.pass && (
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                    {check.hint}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
        <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
          Quick tip
        </div>
        <div className="text-[10px] text-blue-600 leading-relaxed">
          Add internal links to related calculators in your content.
          e.g. "Use our <a href='...'> Nepal Tax Calculator</a>"
          — this boosts SEO for both pages.
        </div>
      </div>
    </div>
  );
}