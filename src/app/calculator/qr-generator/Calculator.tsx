'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import Image from 'next/image';

export default function QRGenerator() {
  const [text, setText] = useState('https://calcpro.com.np');
  const [size, setSize] = useState(250);

  const qrUrl = useMemo(
    () => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`,
    [text, size]
  );

  return (
    <>
      <JsonLd type="calculator"
        name="QR Code Generator"
        description="Create custom QR codes for your website, contact info, or any text. Fast, free, and easy to use QR generator for Nepal."
        url="https://calcpro.com.np/calculator/qr-generator" />

      <CalcWrapper
        title="QR Code Generator"
        description="Create custom QR codes for your website, contact info, or any text. Fast, free, and easy to use QR generator for Nepal."
        crumbs={[{ label: 'Tools', href: '/calculator?cat=tools' }, { label: 'QR Generator' }]}
        relatedCalcs={[
          { name: 'Number to Words', slug: 'number-to-words' },
          { name: 'Roman Numerals', slug: 'roman-numerals' },
        ]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Text or URL</label>
                <textarea 
                  value={text} 
                  onChange={e => setText(e.target.value)} 
                  className="w-full h-32 p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg resize-none font-bold" 
                  placeholder="Enter text or URL here..." 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Size (px)</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="number" inputMode="numeric" pattern="[0-9.]*" 
                    value={size} 
                    onChange={e => setSize(+e.target.value)} 
                    className="w-32 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" 
                  />
                  <input 
                    type="range" 
                    min={100} 
                    max={1000} 
                    step={10} 
                    value={size} 
                    onChange={e => setSize(+e.target.value)} 
                    className="flex-1 accent-blue-600" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Your QR Code</div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6 relative w-[200px] h-[200px]">
                <Image 
                  src={qrUrl} 
                  alt="QR Code" 
                  fill 
                  className="object-contain p-2" 
                  unoptimized // External API generated image
                  referrerPolicy="no-referrer"
                />
              </div>
              <a 
                href={qrUrl} 
                download="qrcode.png" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-center hover:bg-blue-500 transition-colors mb-3"
              >
                Download QR Code
              </a>

              <ShareResult 
                title="My Custom QR Code" 
                result={`QR Code for: ${text.substring(0, 20)}...`} 
                calcUrl={`https://calcpro.com.np/calculator/qr-generator`} 
              />
            </div>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is a QR code?',
            answer: 'A QR (Quick Response) code is a type of matrix barcode that can be read by a digital device and which stores information as a series of pixels in a square-shaped grid.',
          },
          {
            question: 'Are QR codes free to create?',
            answer: 'Yes, our QR code generator is completely free to use. You can create as many QR codes as you want for personal or commercial use.',
          },
          {
            question: 'Do QR codes expire?',
            answer: 'No, static QR codes (like the ones generated here) do not expire. They will work as long as the content they link to (like a website URL) is still active.',
          },
          {
            question: 'Can I change the size of the QR code?',
            answer: 'Yes, you can adjust the size of the QR code in pixels using our generator to ensure it fits perfectly on your website, business card, or flyer.',
          },
          {
            question: 'How do I scan a QR code?',
            answer: 'Most modern smartphones have a built-in QR code scanner in their camera app. Simply point your camera at the code, and a link or notification will appear.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
