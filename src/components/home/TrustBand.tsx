import { ShieldCheck, Zap, Smartphone, Globe } from 'lucide-react';

const PILLARS = [
  { 
    icon: ShieldCheck, 
    title: 'Private by Design', 
    desc: 'All calculations happen in your browser. We never store, track, or sell your data.',
    color: 'text-yellow-500'
  },
  { 
    icon: Zap, 
    title: 'Instant Results', 
    desc: 'No loading, no API calls for basic calculations. Real-time, every time.',
    color: 'text-gray-900'
  },
  { 
    icon: Smartphone, 
    title: 'Mobile Optimized', 
    desc: 'Built mobile-first. Perfect on iPhone, Android, tablet, and desktop.',
    color: 'text-gray-900'
  },
  { 
    icon: Globe, 
    title: 'Nepal-First', 
    desc: 'Updated for FY 2082/83 IRD tax rules. Built for Nepal\'s students, professionals & businesses.',
    color: 'text-red-500'
  },
];

export function TrustBand() {
  return (
    <section className="py-20 bg-white border-t border-gray-50">
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
