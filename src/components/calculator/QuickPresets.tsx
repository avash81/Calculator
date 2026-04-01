'use client';
import React from 'react';
import { Target, TrendingUp, Briefcase, Home, GraduationCap, Car } from 'lucide-react';

interface Preset {
  name: string;
  description: string;
  values: Record<string, any>;
  icon?: 'home' | 'car' | 'briefcase' | 'graduation' | 'target';
}

interface QuickPresetsProps {
  presets: Preset[];
  onSelect: (presetValue: Preset) => void;
}

const ICON_MAP = {
  home: Home,
  car: Car,
  briefcase: Briefcase,
  graduation: GraduationCap,
  target: Target,
};

/**
 * QuickPresets — Phase 1 Optimized Component
 * Allows users to instantly fill calculator values with common industry benchmarks.
 */
export function QuickPresets({ presets, onSelect }: QuickPresetsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
          Quick Access Benchmarks
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset, index) => {
          const Icon = preset.icon ? ICON_MAP[preset.icon] : Target;
          
          return (
            <button
              key={index}
              onClick={() => onSelect(preset)}
              className="group flex flex-col items-start gap-4 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-6 text-left transition-all hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors">
                  {preset.name}
                </div>
                <div className="mt-1 text-sm font-bold text-gray-800 dark:text-white line-clamp-1">
                  {preset.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
