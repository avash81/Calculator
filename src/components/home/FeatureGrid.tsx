'use client';

import { 
  Zap, 
  Shield, 
  Smartphone, 
  Globe, 
  BarChart3, 
  Clock 
} from 'lucide-react';

const FEATURES = [
  {
    title: 'Instant Results',
    description: 'Get precise calculations in milliseconds with our optimized SaaS engine.',
    icon: Zap,
    color: 'text-cp-blue',
    bg: 'bg-cp-blue-light/20'
  },
  {
    title: 'Nepal Compliant',
    description: 'All tax and financial tools are updated for the latest 2082/83 Nepal rules.',
    icon: Shield,
    color: 'text-cp-red',
    bg: 'bg-cp-red-light/20'
  },
  {
    title: 'Mobile First',
    description: 'Fully responsive design that works perfectly on your phone or tablet.',
    icon: Smartphone,
    color: 'text-cp-green',
    bg: 'bg-cp-green-light/20'
  },
  {
    title: 'Multi-Language',
    description: 'Switch between English and Nepali for better accessibility.',
    icon: Globe,
    color: 'text-cp-blue',
    bg: 'bg-cp-blue-light/20'
  },
  {
    title: 'Advanced Analytics',
    description: 'Visualize your data with interactive charts and detailed breakdowns.',
    icon: BarChart3,
    color: 'text-cp-gold',
    bg: 'bg-cp-gold-light/20'
  },
  {
    title: 'Always Updated',
    description: 'We monitor regulatory changes daily to ensure your results are accurate.',
    icon: Clock,
    color: 'text-cp-purple',
    bg: 'bg-cp-purple-light/20'
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-24 bg-white border-y border-cp-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="h2-section text-cp-text mb-4">
            Why Choose <span className="text-cp-blue">CalcPro?</span>
          </h2>
          <p className="text-cp-text-muted max-w-2xl mx-auto text-sm">
            We combined professional-grade precision with a modern user experience to build the ultimate tool suite for Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-xl bg-white border border-cp-border hover:border-cp-blue transition-all group"
            >
              <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-cp-text mb-3">{feature.title}</h3>
              <p className="text-cp-text-muted leading-relaxed text-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
