'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import Image from 'next/image';
import { Download } from 'lucide-react';

export default function QRGenerator() {
  const [text, setText] = useState('https://calcpro.com.np');
  const [size, setSize] = useState(300);

  const qrUrl = useMemo(
    () => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`,
    [text, size]
  );

  return (
    <CalculatorLayout
      title="QR Code Generator"
      description="Generate custom QR codes instantly for any URL, text, or contact information. Free, instant, no signup required."
      category={{ label: 'Utility', href: '/calculator/category/utility' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Text or URL</label>
            <textarea value={text} onChange={e => setText(e.target.value)}
              className="w-full h-36 p-4 border border-[var(--border)] bg-white font-mono text-sm font-bold focus:border-[var(--primary)] outline-none resize-none"
              placeholder="https://your-url.com or any text..." />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">QR Size</label>
              <span className="text-sm font-black text-[var(--primary)]">{size} × {size} px</span>
            </div>
            <input type="range" min={100} max={600} step={50} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full accent-[#083366]" />
            <div className="grid grid-cols-4 gap-2">
              {[150,250,350,500].map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`py-2 text-[10px] font-black border transition-all ${size===s ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {s}px
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Presets</label>
            {[
              { label: 'Website URL',   val: 'https://calcpro.com.np' },
              { label: 'Phone number',  val: 'tel:+9779800000000' },
              { label: 'Email link',    val: 'mailto:hello@calcpro.com.np' },
              { label: 'Wifi access',   val: 'WIFI:T:WPA;S:MyNetwork;P:mypassword;;' },
            ].map(p => (
              <button key={p.label} onClick={() => setText(p.val)}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-6 bg-white border border-[var(--border)] flex flex-col items-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-4">Your QR Code</div>
            <div className="relative w-[200px] h-[200px] border border-[var(--border)] bg-gray-50 p-2">
              <Image src={qrUrl} alt="QR Code" fill className="object-contain" unoptimized referrerPolicy="no-referrer" />
            </div>
          </div>

          <a href={qrUrl} download="qrcode.png" target="_blank" rel="noopener noreferrer"
            className="w-full py-4 bg-[var(--primary)] text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download QR Code
          </a>

          <div className="space-y-2">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Image Size</span>
              <span className="text-sm font-black">{size} × {size} px</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Characters</span>
              <span className="text-sm font-black">{text.length}</span>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)]">QR codes are static and do not expire. Works on any device with a camera.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a QR code?', answer: 'A Quick Response code is a 2D barcode that stores data readable by smartphone cameras. It can encode URLs, text, phone numbers, and more.' },
          { question: 'Do QR codes expire?', answer: 'Static QR codes (like these) never expire. They will work as long as the linked content (e.g., a URL) remains accessible.' },
          { question: 'How do I scan a QR code?', answer: 'Open your smartphone camera app and point it at the QR code. Most modern phones detect QR codes automatically.' },
        ]} />
      }
    />
  );
}
