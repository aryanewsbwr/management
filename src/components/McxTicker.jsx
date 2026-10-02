import React, { useState, useEffect } from 'react';

export default function McxTicker({ enabled = false }) {
  const [categoriesData, setCategoriesData] = useState(null);
  const [activeTab, setActiveTab] = useState('futures'); // 'futures' | 'spot' | 'index'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    
    const fetchMcx = async () => {
      try {
        const res = await fetch('/api/mcx');
        if (!res.ok) throw new Error('Live API error');
        const json = await res.json();
        if (json.success && json.data) {
          setCategoriesData(json.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('[McxTicker] Live API notice:', err.message);
      }
    };

    fetchMcx();
    const interval = setInterval(fetchMcx, 30 * 1000); // Live poll every 30 seconds
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const currentItems = categoriesData?.[activeTab] || [];

  if (isLoading || currentItems.length === 0) {
    return (
      <div className="w-full bg-[#040f25] border-b border-[#1e293b] py-2.5 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Connecting Live Market Feed...</span>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-[#081229] animate-pulse rounded-lg border border-[#1e293b]" />
            <div className="h-6 w-24 bg-[#081229] animate-pulse rounded-lg border border-[#1e293b]" />
            <div className="h-6 w-24 bg-[#081229] animate-pulse rounded-lg border border-[#1e293b]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#040f25] border-b border-[#1e293b] py-2 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center">
        
        {/* Interactive Tab Switcher & Live Indicator */}
        <div className="flex items-center gap-2 sm:gap-4 pr-3 sm:pr-5 border-r border-[#1e293b] shrink-0 mr-2 sm:mr-3">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Live</span>
          </div>

          <button
            onClick={() => setActiveTab('futures')}
            className={`text-xs font-bold transition-all py-1 px-1.5 sm:px-2 rounded-md ${
              activeTab === 'futures'
                ? 'text-white border-b-2 border-red-500 bg-white/5'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Futures
          </button>
          
          <button
            onClick={() => setActiveTab('spot')}
            className={`text-xs font-bold transition-all py-1 px-1.5 sm:px-2 rounded-md ${
              activeTab === 'spot'
                ? 'text-white border-b-2 border-red-500 bg-white/5'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Spot
          </button>

          <button
            onClick={() => setActiveTab('index')}
            className={`hidden sm:inline-block text-xs font-bold transition-all py-1 px-1.5 sm:px-2 rounded-md ${
              activeTab === 'index'
                ? 'text-white border-b-2 border-red-500 bg-white/5'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Index
          </button>
        </div>

        {/* Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div key={activeTab} className="flex animate-marquee whitespace-nowrap items-center hover:pause-animation">
            {/* Render items multiple times for smooth infinite scroll */}
            {[...currentItems, ...currentItems, ...currentItems].map((item, idx) => {
              const isNegative = item.change && item.change.includes('-');
              const colorClass = isNegative ? 'text-red-500' : 'text-emerald-400';

              return (
                <div 
                  key={idx} 
                  className="flex flex-col border border-[#1e293b] rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 mx-1.5 sm:mx-2 min-w-[130px] sm:min-w-[145px] bg-[#081229] hover:border-gray-600 transition"
                >
                  <div className="flex justify-between items-center gap-3 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-200 tracking-wider uppercase truncate max-w-[90px] sm:max-w-[110px]">
                      {item.symbol}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold font-mono ${colorClass}`}>
                      ₹{item.price}
                    </span>
                    <span className={`text-[10px] font-bold font-mono ${colorClass}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
