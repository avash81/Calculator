'use client';

import { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for students and casual users in Nepal.',
    features: [
      'Access to 50+ Basic Calculators',
      'Nepal Tax Rules (2082/83)',
      'Standard Math Engine',
      'Mobile-Friendly Interface',
      'Community Support',
    ],
    button: 'Get Started Free',
    variant: 'outline'
  },
  {
    name: 'Pro',
    price: '499',
    description: 'For professionals who need advanced insights.',
    features: [
      'Everything in Free',
      'Advanced Financial Projections',
      'Export Reports (PDF/Excel)',
      'Ad-Free Experience',
      'Priority Email Support',
      'Save Calculation History',
    ],
    button: 'Upgrade to Pro',
    variant: 'primary',
    popular: true
  },
  {
    name: 'Business',
    price: '1,999',
    description: 'For teams and businesses scaling in Nepal.',
    features: [
      'Everything in Pro',
      'API Access (10k req/mo)',
      'Custom Branding on Reports',
      'Team Collaboration (5 Seats)',
      'Dedicated Account Manager',
      'Early Access to New Tools',
    ],
    button: 'Contact Sales',
    variant: 'outline'
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-cp-bg font-sans py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pricing Plans</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Simple <span className="text-blue-600">Pricing</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, just precision tools for modern Nepal.
          </p>

          {/* Toggle */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className={clsx("text-sm font-semibold", !isAnnual ? "text-gray-900" : "text-gray-500")}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-gray-200 rounded-full p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className={clsx(
                "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
                isAnnual ? "translate-x-7" : "translate-x-0"
              )} />
            </button>
            <div className="flex items-center gap-2">
              <span className={clsx("text-sm font-semibold", isAnnual ? "text-gray-900" : "text-gray-500")}>Annual</span>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Save 20%</span>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={clsx(
                "rounded-3xl p-8 flex flex-col relative transition-all duration-300",
                plan.popular 
                  ? "bg-white border-2 border-blue-500 shadow-xl md:-mt-4 md:mb-4 z-10" 
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-8 text-center flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-gray-900">Rs. {plan.price}</span>
                <span className="text-gray-500 font-medium">/mo</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/calculators"
                className={clsx(
                  "w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-center transition-colors",
                  plan.variant === 'primary' 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                    : "bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {plan.button}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Preview */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900">Is it really free for students?</h4>
              <p className="text-gray-600 leading-relaxed">Yes! All basic calculators and Nepal rules are 100% free for everyone. We only charge for advanced professional features.</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900">Can I cancel my Pro plan anytime?</h4>
              <p className="text-gray-600 leading-relaxed">Absolutely. No long-term contracts. You can cancel with a single click from your dashboard.</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900">Are the tax rules updated?</h4>
              <p className="text-gray-600 leading-relaxed">Yes, we update our Nepal Rules engine within 24 hours of any official government announcement or Finance Act update.</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900">Do you offer API access?</h4>
              <p className="text-gray-600 leading-relaxed">Yes, our Business plan includes API access for integrating our math engine into your own apps or websites.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
