import React from 'react';
import { 
  Globe, Landmark, Trophy, Film, Briefcase, 
  ShieldAlert, MapPin, Newspaper, TrendingUp 
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

const CATEGORY_STYLES = {
  rajasthan: {
    gradient: 'from-orange-600 via-amber-600 to-orange-700',
    icon: Landmark,
    accent: 'bg-orange-500/20 text-orange-200'
  },
  national: {
    gradient: 'from-blue-700 via-indigo-700 to-blue-800',
    icon: Globe,
    accent: 'bg-blue-500/20 text-blue-200'
  },
  sports: {
    gradient: 'from-emerald-700 via-teal-700 to-emerald-800',
    icon: Trophy,
    accent: 'bg-emerald-500/20 text-emerald-200'
  },
  entertainment: {
    gradient: 'from-purple-700 via-fuchsia-700 to-purple-800',
    icon: Film,
    accent: 'bg-purple-500/20 text-purple-200'
  },
  business: {
    gradient: 'from-slate-700 via-slate-800 to-blue-900',
    icon: Briefcase,
    accent: 'bg-slate-500/20 text-slate-200'
  },
  crime: {
    gradient: 'from-rose-800 via-red-800 to-rose-950',
    icon: ShieldAlert,
    accent: 'bg-rose-500/20 text-rose-200'
  },
  beawar: {
    gradient: 'from-red-700 via-brand-700 to-amber-800',
    icon: MapPin,
    accent: 'bg-red-500/20 text-red-200'
  },
  mandi: {
    gradient: 'from-emerald-800 via-teal-800 to-green-900',
    icon: TrendingUp,
    accent: 'bg-emerald-500/20 text-emerald-200'
  }
};

export default function CategoryPlaceholder({
  category = 'national',
  sourceName = '',
  size = 'standard' // 'horizontal' | 'standard' | 'large' | 'hero'
}) {
  const meta = CATEGORIES.find(c => c.id === category) || CATEGORIES[3];
  const style = CATEGORY_STYLES[category] || {
    gradient: 'from-gray-700 via-gray-800 to-gray-900',
    icon: Newspaper,
    accent: 'bg-gray-500/20 text-gray-200'
  };

  const IconComponent = style.icon;
  const categoryTitle = meta.nameHi;

  if (size === 'horizontal') {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center p-2 text-white relative select-none`}>
        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-1 shadow-inner">
          <IconComponent className="w-4 h-4 text-white" />
        </div>
        <span className="text-[11px] font-bold font-hindi text-center leading-tight line-clamp-1">
          {categoryTitle}
        </span>
        {sourceName && (
          <span className="mt-1 text-[8px] text-white/80 bg-black/30 px-1.5 py-0.2 rounded font-medium truncate max-w-[90%]">
            {sourceName}
          </span>
        )}
      </div>
    );
  }

  if (size === 'large' || size === 'hero') {
    return (
      <div className={`w-full ${size === 'hero' ? 'h-full min-h-[340px] sm:min-h-[440px]' : 'h-52 sm:h-64'} rounded-2xl bg-gradient-to-br ${style.gradient} p-6 sm:p-8 flex flex-col items-center justify-center text-white relative shadow-lg overflow-hidden select-none`}>
        {/* Subtle Watermark background */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <IconComponent className="w-56 h-56" />
        </div>

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-xl border border-white/20">
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <span className="text-xl sm:text-2xl font-black font-hindi tracking-wide text-center">
          {categoryTitle}
        </span>

        {sourceName && (
          <div className="mt-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-medium text-white/90 border border-white/10">
            <span>रिपोर्टिंग स्रोत:</span>
            <strong className="text-amber-300 font-bold">{sourceName}</strong>
          </div>
        )}

        <div className="absolute bottom-2 text-[10px] text-white/50 font-hindi">
          आर्यन डिजिटल न्यूज़ नेटवर्क • कॉपीराइट सुरक्षित सामग्री
        </div>
      </div>
    );
  }

  // Standard Card Thumbnail (Aspect 16/10)
  return (
    <div className={`w-full h-full bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center p-4 text-white relative shadow-inner select-none overflow-hidden`}>
      <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
        <IconComponent className="w-28 h-28" />
      </div>

      <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1.5 shadow-md border border-white/15">
        <IconComponent className="w-5 h-5 text-white" />
      </div>

      <span className="text-sm font-black font-hindi text-center drop-shadow">
        {categoryTitle}
      </span>

      {sourceName && (
        <span className="mt-1 text-[9px] text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-medium">
          स्रोत: {sourceName}
        </span>
      )}
    </div>
  );
}
