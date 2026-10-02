import React, { useState, useEffect } from 'react';

const FALLBACK_DATA = [
  { symbol: 'GOLD', date: '04DEC2026', price: '76450.00', change: '+0.15%' },
  { symbol: 'SILVER', date: '30NOV2026', price: '91200.00', change: '-0.09%' },
  { symbol: 'COPPER', date: '30OCT2026', price: '854.20', change: '-0.05%' },
  { symbol: 'ZINC', date: '30OCT2026', price: '280.45', change: '+1.20%' },
  { symbol: 'CRUDEOIL', date: '19NOV2026', price: '6450.00', change: '-1.50%' },
  { symbol: 'NATURALGAS', date: '25OCT2026', price: '240.10', change: '+0.80%' },
  { symbol: 'LEAD', date: '30OCT2026', price: '192.05', change: '-0.10%' },
  { symbol: 'ALUMINIUM', date: '30OCT2026', price: '245.60', change: '+0.25%' },
];

export default function McxTicker({ enabled = false }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!enabled) return;
    
    const fetchMcx = async () => {
      try {
        const res = await fetch('/api/mcx');
        if (!res.ok) throw new Error('API failed');
        const json = await res.json();
        if (json.success && json.data) {
          setItems(json.data);
        } else {
          setItems(FALLBACK_DATA);
        }
      } catch (err) {
        console.error('Failed to fetch live MCX data, using fallback.', err);
        setItems(FALLBACK_DATA);
      }
    };

    fetchMcx();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMcx, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled || items.length === 0) return null;

  return (
    <div className="w-full bg-[#040f25] border-b border-[#1e293b] py-2 overflow-hidden relative">
      <div className="w-full px-2 flex items-center">
        {/* Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap items-center hover:pause-animation">
            {/* Render items twice for seamless infinite scroll */}
            {[...items, ...items, ...items].map((item, idx) => {
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
          animation: marquee 35s linear infinite;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
