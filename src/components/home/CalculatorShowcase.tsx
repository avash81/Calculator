'use client';

import { Button } from '@/components/ui';
import { 
  TrendingUp, 
  Heart, 
  GraduationCap, 
  Flag, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  {
    id: 'finance',
    title: 'Finance & Investment',
    description: 'SIP, FD, CAGR, and Retirement planning tools.',
    icon: TrendingUp,
    color: 'bg-cp-blue',
    count: 12
  },
  {
    id: 'nepal',
    title: 'Nepal Rules',
    description: 'Income Tax (2082/83), VAT, and Salary breakdown.',
    icon: Flag,
    color: 'bg-cp-red',
    count: 8
  },
  {
    id: 'health',
    title: 'Health & Fitness',
    description: 'BMI, BMR, TDEE, and Pregnancy trackers.',
    icon: Heart,
    color: 'bg-cp-green',
    count: 10
  },
  {
    id: 'education',
    title: 'Education',
    description: 'GPA, Attendance, and Grade converters.',
    icon: GraduationCap,
    color: 'bg-cp-purple',
    count: 6
  }
];

export default function CalculatorShowcase() {
  return (
    <section className="py-24 bg-cp-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="h2-section text-cp-text mb-4">
              Tools for every <span className="text-cp-blue">scenario.</span>
            </h2>
            <p className="text-cp-text-muted text-sm">
              Browse our extensive library of calculators organized by category. Each tool is designed for maximum usability.
            </p>
          </div>
          <Link href="/calculators">
            <Button variant="outline" className="flex items-center gap-2 h-12 px-6 rounded-lg text-sm font-medium">
              View All 80+ Tools <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
            >
              <Link href={`/calculators/${cat.id}`}>
                <div className="p-8 bg-white rounded-xl border border-cp-border group hover:border-cp-blue transition-all duration-300 overflow-hidden relative shadow-cp-sm">
                  <div className="relative z-10">
                    <div className={`w-12 h-12 ${cat.color} rounded-lg flex items-center justify-center text-white mb-6 shadow-sm`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-cp-text group-hover:text-cp-blue transition-colors">{cat.title}</h3>
                      <span className="text-[10px] font-bold px-3 py-1 bg-cp-bg rounded-full text-cp-text-muted uppercase tracking-widest">
                        {cat.count} Tools
                      </span>
                    </div>
                    <p className="text-cp-text-muted mb-8 max-w-xs text-xs leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-cp-blue uppercase tracking-widest">
                      Explore Category <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
