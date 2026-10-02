import React from 'react';

export default function McxTicker({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-[#040f25] border-b border-[#1e293b] py-2 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Static Header */}
        <div className="flex gap-4 pr-6 border-r border-[#1e293b] shrink-0 mr-4">
          <span className="text-white text-xs font-bold border-b-2 border-gray-400 pb-1">Futures</span>
          <span className="text-gray-400 text-xs hover:text-white transition cursor-pointer">Index Futures</span>
          <span className="text-gray-400 text-xs hover:text-white transition cursor-pointer">Spot</span>
        </div>

        {/* Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap items-center hover:pause-animation">
            {/* Render items twice for seamless infinite scroll */}
            {[...items, ...items].map((item, idx) => {
              const isNegative = item.change && item.change.includes('-');
              const colorClass = isNegative ? 'text-red-500' : 'text-emerald-500';

              return (
                <div 
                  key={idx} 
                  className="flex flex-col border border-[#1e293b] rounded-lg px-3 py-1.5 mx-2 min-w-[140px] bg-[#081229]"
                >
                  <div className="flex justify-between items-center gap-4 mb-1">
                    <span className="text-[10px] font-bold text-gray-200 tracking-wider uppercase">{item.symbol}</span>
                    <span className="text-[9px] text-gray-400 uppercase">{item.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold font-mono ${colorClass}`}>{item.price}</span>
                    <span className={`text-[10px] font-mono ${colorClass}`}>{item.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
