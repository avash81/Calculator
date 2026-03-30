'use client';
import { useState, useMemo, useCallback } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMS = '0123456789';
const SYMS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const SIMILAR = 'il1Lo0O';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSyms, setUseSyms] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(() => {
    let charset = '';
    if (useUpper) charset += UPPER;
    if (useLower) charset += LOWER;
    if (useNums) charset += NUMS;
    if (useSyms) charset += SYMS;

    if (excludeSimilar) {
      charset = charset.split('').filter(c => !SIMILAR.includes(c)).join('');
    }

    if (!charset) {
      setPasswords(['Please select at least one character type']);
      return;
    }

    const newPasswords = [];
    for (let p = 0; p < 3; p++) {
      let pwd = '';
      for (let i = 0; i < length; i++) {
        pwd += charset[Math.floor(Math.random() * charset.length)];
      }
      newPasswords.push(pwd);
    }
    setPasswords(newPasswords);
    setCopiedIndex(null);
  }, [length, useUpper, useLower, useNums, useSyms, excludeSimilar]);

  // Initial generation
  useMemo(() => {
    if (passwords.length === 0) generate();
  }, [generate, passwords.length]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const strength = useMemo(() => {
    let score = 0;
    if (length > 8) score += 1;
    if (length > 12) score += 1;
    if (length >= 16) score += 1;
    if (useUpper && useLower) score += 1;
    if (useNums) score += 1;
    if (useSyms) score += 1;

    if (score < 3) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (score < 5) return { label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    if (score < 6) return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500' };
    return { label: 'Very Strong', color: 'text-blue-500', bg: 'bg-blue-500' };
  }, [length, useUpper, useLower, useNums, useSyms]);

  return (
    <>
      <JsonLd type="calculator"
        name="Password Generator"
        description="Generate strong, secure, and random passwords to keep your accounts safe with our customizable password generator tool."
        url="https://calcpro.com.np/calculator/password-generator" />

      <CalcWrapper
        title="Password Generator"
        description="Generate strong, secure, and random passwords to keep your accounts safe."
        crumbs={[{label:'utility',href:'/calculator?cat=utility'}, {label:'password generator'}]}
        relatedCalcs={[
          {name:'Word Counter',slug:'word-counter'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_350px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-6">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password Length</label>
                <span className="text-sm font-bold text-blue-600 font-mono">{length}</span>
              </div>
              <input type="range" min={8} max={64} step={1} value={length} onChange={e => {setLength(Number(e.target.value)); generate();}} className="w-full accent-blue-600" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest"><span>8</span><span>64</span></div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Options</label>
              
              {[
                { id: 'upper', label: 'Uppercase (A-Z)', state: useUpper, set: setUseUpper },
                { id: 'lower', label: 'Lowercase (a-z)', state: useLower, set: setUseLower },
                { id: 'nums', label: 'Numbers (0-9)', state: useNums, set: setUseNums },
                { id: 'syms', label: 'Symbols (!@#$)', state: useSyms, set: setUseSyms },
                { id: 'sim', label: 'Exclude Similar (i, l, 1, L, o, 0, O)', state: excludeSimilar, set: setExcludeSimilar },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <button onClick={() => {opt.set(!opt.state); setTimeout(generate, 0);}} className={`relative w-10 h-5 rounded-full transition-colors ${opt.state?'bg-blue-500':'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${opt.state?'left-5':'left-0.5'}`}/>
                  </button>
                  <div className="text-sm font-bold text-gray-900">{opt.label}</div>
                </label>
              ))}
            </div>

            <button onClick={generate} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors min-h-[44px]">
              Generate New Passwords
            </button>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generated Passwords</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${strength.color}`}>{strength.label}</span>
              </div>
              
              {/* Strength Bar */}
              <div className="h-1 w-full bg-gray-100 flex">
                <div className={`${strength.bg} h-full transition-all`} style={{width: strength.label === 'Weak' ? '25%' : strength.label === 'Fair' ? '50%' : strength.label === 'Strong' ? '75%' : '100%'}}></div>
              </div>

              <div className="p-4 space-y-3">
                {passwords.map((pwd, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 font-mono text-sm break-all text-gray-800 font-bold">
                      {pwd}
                    </div>
                    <button onClick={() => copyToClipboard(pwd, i)} className="flex-shrink-0 p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center font-bold text-[10px] uppercase tracking-widest" title="Copy to clipboard">
                      {copiedIndex === i ? '✓' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <ShareResult 
              title="Password Generator" 
              result="Generated secure passwords" 
              calcUrl={`https://calcpro.com.np/calculator/password-generator`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What makes a password strong?',
            answer: 'A strong password is typically at least 12-16 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and symbols. It should not contain easily guessable information like your name or birthday.',
          },
          {
            question: 'Why should I use a password generator?',
            answer: 'Password generators create random strings of characters that are much harder for hackers to guess or crack using automated tools compared to passwords created by humans.',
          },
          {
            question: 'Is it safe to use an online password generator?',
            answer: 'Our password generator runs entirely in your browser. Your generated passwords are never sent to our servers, making it a safe way to create secure credentials.',
          },
          {
            question: 'How often should I change my passwords?',
            answer: 'While the advice has changed over the years, most security experts now recommend changing a password only if you suspect it has been compromised. Using a unique, strong password for every account is more important than frequent changes.',
          },
          {
            question: 'What is the "Exclude Similar" option?',
            answer: 'This option removes characters that can be easily confused with one another, such as the lowercase "l", uppercase "I", and the number "1", or the number "0" and uppercase "O". This makes the password easier to read and type manually.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
