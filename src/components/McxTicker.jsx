import React, { useState, useEffect } from 'react';

const FALLBACK_CATEGORIES = {
  futures: [
    { symbol: 'GOLD', date: '04DEC2026', price: '76450.00', change: '+0.15%' },
    { symbol: 'SILVER', date: '30NOV2026', price: '91200.00', change: '-0.09%' },
    { symbol: 'COPPER', date: '30OCT2026', price: '854.20', change: '-0.05%' },
    { symbol: 'ZINC', date: '30OCT2026', price: '280.45', change: '+1.20%' },
    { symbol: 'CRUDEOIL', date: '19NOV2026', price: '6450.00', change: '-1.50%' },
    { symbol: 'NATURALGAS', date: '25OCT2026', price: '240.10', change: '+0.80%' },
    { symbol: 'LEAD', date: '30OCT2026', price: '192.05', change: '-0.10%' },
    { symbol: 'ALUMINIUM', date: '30OCT2026', price: '245.60', change: '+0.25%' },
  ],
  spot: [
    { symbol: 'GOLD 24K (10g)', date: 'SPOT', price: '78250.00', change: '+0.20%' },
    { symbol: 'GOLD 22K (10g)', date: 'SPOT', price: '71750.00', change: '+0.18%' },
    { symbol: 'GOLD 18K (10g)', date: 'SPOT', price: '58700.00', change: '+0.15%' },
    { symbol: 'SILVER 999 (1kg)', date: 'SPOT', price: '93500.00', change: '-0.12%' },
    { symbol: 'SILVER (100g)', date: 'SPOT', price: '9350.00', change: '-0.12%' },
    { symbol: 'PLATINUM (10g)', date: 'SPOT', price: '29800.00', change: '+0.05%' },
  ],
  index: [
    { symbol: 'MCX BULLDEX', date: 'FUT', price: '18420.50', change: '+0.10%' },
    { symbol: 'MCX METLDEX', date: 'FUT', price: '22890.00', change: '-0.25%' },
    { symbol: 'MCX ENRGDEX', date: 'FUT', price: '5610.00', change: '+0.45%' },
  ]
};

export default function McxTicker({ enabled = false }) {
  const [categoriesData, setCategoriesData] = useState(FALLBACK_CATEGORIES);
  const [activeTab, setActiveTab] = useState('futures'); // 'futures' | 'spot' | 'index'

  useEffect(() => {
    if (!enabled) return;
    
    const fetchMcx = async () => {
      try {
        const res = await fetch('/api/mcx');
        if (!res.ok) throw new Error('API request failed');
        const json = await res.json();
        if (json.success && json.data) {
          // If structure is object with categories
          if (json.data.futures) {
            setCategoriesData(json.data);
          } else if (Array.isArray(json.data)) {
            setCategoriesData(prev => ({ ...prev, futures: json.data }));
          }
        }
      } catch (err) {
        console.warn('Using fallback MCX data:', err);
      }
    };

    fetchMcx();
    const interval = setInterval(fetchMcx, 30 * 1000); // Live poll every 30 seconds
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const currentItems = categoriesData[activeTab] || categoriesData.futures || [];
  if (currentItems.length === 0) return null;

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
                      {item.price}
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
