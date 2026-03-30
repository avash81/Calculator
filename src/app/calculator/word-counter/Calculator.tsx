'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function WordCounter() {
  const [text, setText] = useState('');

  const result = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    
    // Reading time (avg 200 words per minute)
    const readingTimeMin = Math.ceil(words / 200);

    // Most frequent words
    const wordCounts: Record<string, number> = {};
    if (trimmed) {
      trimmed.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).forEach(w => {
        if (w.length > 3) { // Only count words > 3 chars
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });
    }
    
    const topWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { words, chars, charsNoSpaces, sentences, paragraphs, lines, readingTimeMin, topWords };
  }, [text]);

  const clearText = () => setText('');

  return (
    <>
      <JsonLd type="calculator"
        name="Word Counter"
        description="Count words, characters, sentences, and paragraphs in real-time. Estimate reading time and find most frequent words with our free online word counter."
        url="https://calcpro.com.np/calculator/word-counter" />

      <CalcWrapper
        title="Word Counter"
        description="Count words, characters, sentences, and paragraphs in real-time. Estimate reading time and find most frequent words."
        crumbs={[{label:'utility',href:'/calculator?cat=utility'}, {label:'word counter'}]}
        relatedCalcs={[
          {name:'Password Generator',slug:'password-generator'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[500px]">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Text Input</h2>
              <button onClick={clearText} className="text-[10px] font-bold text-red-500 hover:text-red-700 min-h-[44px] px-2 uppercase tracking-widest">
                Clear Text
              </button>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="flex-1 w-full p-4 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
            />
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-600 rounded-xl p-4 text-center text-white shadow-lg shadow-blue-900/20">
                <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-1">Words</div>
                <div className="text-3xl font-bold font-mono">{result.words}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Characters</div>
                <div className="text-3xl font-bold font-mono text-blue-700">{result.chars}</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Characters (no spaces)</span>
                  <span className="font-mono font-bold text-gray-900">{result.charsNoSpaces}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Sentences</span>
                  <span className="font-mono font-bold text-gray-900">{result.sentences}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Paragraphs</span>
                  <span className="font-mono font-bold text-gray-900">{result.paragraphs}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Lines</span>
                  <span className="font-mono font-bold text-gray-900">{result.lines}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Reading Time</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">~{result.readingTimeMin} min</span>
                </div>
              </div>
            </div>

            {result.topWords.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Most Frequent Words (&gt;3 chars)</div>
                <div className="p-4 space-y-2">
                  {result.topWords.map(([word, count]) => (
                    <div key={word} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 truncate max-w-[150px] font-medium">{word}</span>
                      <span className="font-mono text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ShareResult 
              title="Word Count Result" 
              result={`${result.words} words, ${result.chars} chars`} 
              calcUrl={`https://calcpro.com.np/calculator/word-counter`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How does the word counter work?',
            answer: 'Our word counter analyzes your text in real-time as you type or paste it. It uses regular expressions to identify words, sentences, and paragraphs, providing instant feedback on your content.',
          },
          {
            question: 'What is the average reading time based on?',
            answer: 'The estimated reading time is based on an average reading speed of 200 words per minute (WPM), which is typical for most adults reading informational text.',
          },
          {
            question: 'Does the character count include spaces?',
            answer: 'Yes, the main character count includes all characters, including spaces and punctuation. We also provide a "Characters (no spaces)" count for more specific requirements.',
          },
          {
            question: 'Why are only words longer than 3 characters shown in the frequent words list?',
            answer: 'Common short words like "the", "and", "is", and "of" (often called stop words) are usually not very meaningful for analysis. Filtering for words longer than 3 characters helps highlight the core topics of your text.',
          },
          {
            question: 'Is my text saved on your servers?',
            answer: 'No, all processing happens locally in your browser. Your text is never sent to our servers, ensuring your privacy and data security.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
