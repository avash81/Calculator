import { ShieldCheck, Zap, Smartphone, Lock } from 'lucide-react';

const PILLARS = [
  { 
    icon: Lock, 
    title: 'Secure Encryption', 
    desc: 'Your data never leaves your device. All calculations are 100% private and offline-capable.',
    color: 'text-gray-400'
  },
  { 
    icon: Zap, 
    title: 'Instant Results', 
    desc: 'Optimized for speed. Get complex mathematical solutions in milliseconds, not minutes.',
    color: 'text-gray-400'
  },
  { 
    icon: Smartphone, 
    title: 'Fully Responsive', 
    desc: 'Pixel-perfect experience across all devices. Built for mobile-first Nepal.',
    color: 'text-gray-400'
  },
  { 
    icon: ShieldCheck, 
    title: 'No Account Required', 
    desc: 'We value your privacy. Access all 75+ professional tools without ever signing up.',
    color: 'text-gray-400'
  },
];

export function TrustBand() {
  return (
    <section className="py-12 bg-white border-t border-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="group flex flex-col items-center">
              <div className={`mb-6 p-4 rounded-2xl bg-gray-50 group-hover:bg-gray-100 transition-colors`}>
                <pillar.icon className={`w-8 h-8 ${pillar.color}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
