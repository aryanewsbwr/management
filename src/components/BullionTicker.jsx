import React from 'react';
import { Clock, AlertCircle, Sparkles } from 'lucide-react';

export default function BullionTicker({ rates = [], lastUpdatedAt = null, enabled = true }) {
  if (!enabled || !rates || rates.length === 0) return null;

  // Check if update is older than 24 hours
  let isOutdated = false;
  let formattedTime = '';

  if (lastUpdatedAt) {
    try {
      const updateDate = new Date(lastUpdatedAt);
      const now = new Date();
      const diffHours = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60);
      if (diffHours >= 24) {
        isOutdated = true;
      }

      formattedTime = updateDate.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      isOutdated = true;
    }
  } else {
    isOutdated = true;
  }

  return (
    <div className="w-full bg-[#0a1128] border-b border-amber-500/20 py-2 overflow-hidden relative select-none shadow-inner">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center">
        
        {/* Left Badge: ब्यावर सर्राफा भाव */}
        <div className="flex items-center gap-2 pr-3 sm:pr-4 border-r border-amber-500/30 shrink-0 mr-3">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-950 px-2.5 py-0.5 rounded-md font-black text-[11px] shadow-sm font-hindi">
            <span>🪙</span>
            <span>ब्यावर सर्राफा भाव</span>
          </div>

          {/* Time or Outdated Notice */}
          {isOutdated ? (
            <span className="hidden md:inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-hindi font-bold">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>आज के भाव अपडेट होने बाकी</span>
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1 text-gray-400 text-[10px] font-mono">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>अपडेट: {formattedTime}</span>
            </span>
          )}
        </div>

        {/* Marquee Rates */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap items-center hover:pause-animation">
            {[...rates, ...rates, ...rates].map((item, idx) => (
              <div 
                key={idx} 
                className="inline-flex items-center gap-2 bg-[#101d42] border border-amber-500/20 rounded-lg px-3 py-1 mx-2 shrink-0 shadow-sm"
              >
                <span className="text-xs font-bold text-amber-300 font-hindi">
                  {item.item}
                </span>
                <span className="text-[10px] text-gray-400 font-hindi">
                  ({item.unit})
                </span>
                <span className="text-xs font-black text-white font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10">
                  ₹{item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Outdated Tag */}
        {isOutdated && (
          <span className="md:hidden shrink-0 ml-2 text-[10px] text-amber-400 font-hindi bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
            अपडेट बाकी
          </span>
        )}
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
