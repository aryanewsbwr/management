import React, { useState } from 'react';
import { 
  Globe, Landmark, Trophy, Film, Briefcase, 
  ShieldAlert, MapPin, Newspaper, TrendingUp 
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

// Curated 100% Free-to-Use (Unsplash License / CC0 Public Domain) thematic images
// Free for commercial and non-commercial use, zero copyright infringement risk.
const CATEGORY_STYLES = {
  rajasthan: {
    gradient: 'from-amber-950/85 via-orange-950/70 to-black/80',
    icon: Landmark,
    accent: 'bg-orange-500/20 text-orange-200',
    bgImage: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80' // Rajasthan heritage (Free Unsplash)
  },
  national: {
    gradient: 'from-slate-950/85 via-blue-950/70 to-black/80',
    icon: Globe,
    accent: 'bg-blue-500/20 text-blue-200',
    bgImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80' // India heritage / National (Free Unsplash)
  },
  sports: {
    gradient: 'from-emerald-950/85 via-teal-950/70 to-black/80',
    icon: Trophy,
    accent: 'bg-emerald-500/20 text-emerald-200',
    bgImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80' // Sports stadium / Cricket (Free Unsplash)
  },
  entertainment: {
    gradient: 'from-purple-950/85 via-fuchsia-950/70 to-black/80',
    icon: Film,
    accent: 'bg-purple-500/20 text-purple-200',
    bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80' // Cinema hall (Free Unsplash)
  },
  business: {
    gradient: 'from-slate-950/85 via-cyan-950/70 to-black/80',
    icon: Briefcase,
    accent: 'bg-slate-500/20 text-slate-200',
    bgImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80' // Stock charts / Market (Free Unsplash)
  },
  crime: {
    gradient: 'from-red-950/85 via-stone-950/70 to-black/80',
    icon: ShieldAlert,
    accent: 'bg-rose-500/20 text-rose-200',
    bgImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80' // Law & justice (Free Unsplash)
  },
  beawar: {
    gradient: 'from-red-950/85 via-amber-950/70 to-black/80',
    icon: MapPin,
    accent: 'bg-red-500/20 text-red-200',
    bgImage: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80' // Local heritage (Free Unsplash)
  },
  mandi: {
    gradient: 'from-emerald-950/85 via-green-950/70 to-black/80',
    icon: TrendingUp,
    accent: 'bg-emerald-500/20 text-emerald-200',
    bgImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80' // Grain harvest / Agriculture (Free Unsplash)
  }
};

export default function CategoryPlaceholder({
  category = 'national',
  sourceName = '',
  size = 'standard' // 'horizontal' | 'standard' | 'large' | 'hero'
}) {
  const [imgError, setImgError] = useState(false);
  const meta = CATEGORIES.find(c => c.id === category) || CATEGORIES[3];
  const style = CATEGORY_STYLES[category] || {
    gradient: 'from-gray-950/85 via-gray-900/70 to-black/80',
    icon: Newspaper,
    accent: 'bg-gray-500/20 text-gray-200',
    bgImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80' // General newspaper (Free Unsplash)
  };

  const IconComponent = style.icon;
  const categoryTitle = meta.nameHi;

  if (size === 'horizontal') {
    return (
      <div className="w-full h-full relative overflow-hidden bg-gray-900 select-none">
        {/* Free-to-use thematic photographic background */}
        {!imgError && style.bgImage && (
          <img
            src={style.bgImage}
            alt=""
            aria-hidden="true"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Tinted gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient}`} />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 text-white">
          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-1 shadow-inner border border-white/20">
            <IconComponent className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[11px] font-bold font-hindi text-center leading-tight line-clamp-1 drop-shadow">
            {categoryTitle}
          </span>
          {sourceName && (
            <span className="mt-1 text-[8px] text-white/90 bg-black/60 backdrop-blur-xs px-1.5 py-0.2 rounded font-medium truncate max-w-[90%]">
              {sourceName}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (size === 'large' || size === 'hero') {
    return (
      <div className={`w-full ${size === 'hero' ? 'h-full min-h-[340px] sm:min-h-[440px]' : 'h-52 sm:h-64'} rounded-2xl relative shadow-lg overflow-hidden select-none bg-gray-900`}>
        {/* Free-to-use thematic photographic background */}
        {!imgError && style.bgImage && (
          <img
            src={style.bgImage}
            alt=""
            aria-hidden="true"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover scale-105"
            loading="lazy"
          />
        )}

        {/* Deep atmospheric gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient}`} />

        {/* Subtle decorative watermark icon */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-white">
          <IconComponent className="w-56 h-56" />
        </div>

        <div className="relative z-10 w-full h-full p-6 sm:p-8 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-xl border border-white/25">
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <span className="text-xl sm:text-2xl font-black font-hindi tracking-wide text-center drop-shadow-md">
            {categoryTitle}
          </span>

          {sourceName && (
            <div className="mt-3 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-medium text-white/90 border border-white/15 shadow">
              <span>रिपोर्टिंग स्रोत:</span>
              <strong className="text-amber-300 font-bold">{sourceName}</strong>
            </div>
          )}

          <div className="absolute bottom-2 text-[10px] text-white/60 font-hindi drop-shadow">
            आर्यन डिजिटल न्यूज़ नेटवर्क • सत्यापित एवं सुरक्षित स्रोत
          </div>
        </div>
      </div>
    );
  }

  // Standard Card Thumbnail (Aspect 16/10)
  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-900 shadow-inner select-none group">
      {/* Free-to-use thematic photographic background */}
      {!imgError && style.bgImage && (
        <img
          src={style.bgImage}
          alt=""
          aria-hidden="true"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      )}

      {/* Dark gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient}`} />

      {/* Subtle watermark */}
      <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none text-white">
        <IconComponent className="w-28 h-28" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1.5 shadow-md border border-white/20">
          <IconComponent className="w-5 h-5 text-white" />
        </div>

        <span className="text-sm font-black font-hindi text-center drop-shadow">
          {categoryTitle}
        </span>

        {sourceName && (
          <span className="mt-1 text-[9px] text-white/90 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded font-medium border border-white/10">
            स्रोत: {sourceName}
          </span>
        )}
      </div>
    </div>
  );
}
