'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function WordCounter() {
  const [text, setText] = useState('');

  const result = useMemo(() => {
    const trimmed = text.trim();
    const words    = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars    = text.length;
    const noSpace  = text.replace(/\s+/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paras    = trimmed ? trimmed.split(/\n+/).filter(p => p.trim()).length : 0;
    const lines    = text ? text.split(/\n/).length : 0;
    const readMins = Math.ceil(words / 200);
    const wordCounts: Record<string, number> = {};
    if (trimmed) trimmed.toLowerCase().replace(/[.,!?]/g,'').split(/\s+/).forEach(w => { if (w.length > 3) wordCounts[w] = (wordCounts[w]||0)+1; });
    const topWords = Object.entries(wordCounts).sort((a,b) => b[1]-a[1]).slice(0,5);
    return { words, chars, noSpace, sentences, paras, lines, readMins, topWords };
  }, [text]);

  return (
    <CalculatorLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in real-time. Get reading time estimates and most frequent words."
      category={{ label: 'Utility', href: '/calculator/category/utility' }}
      leftPanel={
        <div className="space-y-4 h-full">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Text Input</label>
            <button onClick={() => setText('')} className="text-[10px] font-bold text-red-500 uppercase hover:text-red-700">Clear</button>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full border border-[var(--border)] bg-white p-4 text-sm font-medium focus:border-[var(--primary)] outline-none resize-none"
            style={{ minHeight: '280px' }}
          />
          {result.topWords.length > 0 && (
            <div className="bg-white border border-[var(--border)]">
              <div className="px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border)]">
                <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Most Frequent Words</h3>
              </div>
              {result.topWords.map(([word, count]) => (
                <div key={word} className="px-4 py-2 border-b border-[var(--border)] flex justify-between last:border-0">
                  <span className="text-[11px] font-bold text-[var(--text-main)]">{word}</span>
                  <span className="text-[10px] font-black bg-[var(--primary)] text-white px-2 py-0.5">{count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      rightPanel={
        <div className="space-y-4">
          {/* Words & Chars hero */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-[var(--primary)] text-white text-center">
              <div className="text-[10px] font-bold uppercase mb-1 opacity-80">Words</div>
              <div className="text-4xl font-black font-mono">{result.words}</div>
            </div>
            <div className="p-6 bg-white border border-[var(--border)] text-center">
              <div className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Characters</div>
              <div className="text-4xl font-black font-mono text-[var(--primary)]">{result.chars}</div>
            </div>
          </div>

          {/* Details */}
          {[
            { label: 'Chars (no spaces)', val: result.noSpace },
            { label: 'Sentences',         val: result.sentences },
            { label: 'Paragraphs',        val: result.paras },
            { label: 'Lines',             val: result.lines },
            { label: 'Est. Reading Time', val: `~${result.readMins} min` },
          ].map(({ label, val }) => (
            <div key={label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</span>
              <span className="text-sm font-black text-[var(--text-main)]">{val}</span>
            </div>
          ))}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'Is my text saved anywhere?', answer: 'No — all processing happens locally in your browser. Your text is never sent to our servers.' },
          { question: 'What reading speed is used?', answer: 'The average adult reading speed of 200 words per minute (WPM) for informational text.' },
          { question: 'Why only show words longer than 3 characters in frequent words?', answer: 'Short "stop words" like "the", "and", "is" are filtered to highlight meaningful topic keywords.' },
        ]} />
      }
    />
  );
}
