import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight, X, Sparkles, Share2 } from 'lucide-react';
import { MANDI_NOTICE } from '../data/mandiRates';

export default function MandiTicker({ rates = [], onOpenFullMandi }) {
  if (!rates || rates.length === 0) return null;

  const handleShareMandi = (e) => {
    e.stopPropagation();
    let text = `*🌾 कृषि उपज मंडी ब्यावर - आज के भाव*\nतारीख: ${MANDI_NOTICE.date}\n\n`;
    rates.slice(0, 6).forEach(r => {
      text += `• *${r.cropHi}*: ₹${r.minPrice} - ₹${r.maxPrice} ${r.unit}\n`;
    });
    text += `\nस्रोत: आर्यन न्यूज़ एजेंसी (ब्यावर)\nhttps://www.aryannewsagency.com/`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white border-y border-emerald-700/40 shadow-inner">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        
        {/* Left Badge */}
        <div 
          onClick={onOpenFullMandi}
          className="shrink-0 flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition shadow"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <span>ब्यावर मंडी भाव</span>
        </div>

        {/* Scrolling Rate Items */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-4 text-xs">
          {rates.map((item) => (
            <div 
              key={item.id}
              onClick={onOpenFullMandi}
              className="flex items-center gap-1.5 shrink-0 bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-md cursor-pointer transition"
            >
              <span className="font-semibold text-emerald-200">{item.cropHi}:</span>
              <span className="font-mono font-bold text-white">₹{item.minPrice} - ₹{item.maxPrice}</span>
              
              {item.trend === 'up' && (
                <span className="flex items-center text-[10px] text-emerald-300 font-medium">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  {item.change}
                </span>
              )}
              {item.trend === 'down' && (
                <span className="flex items-center text-[10px] text-red-300 font-medium">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {item.change}
                </span>
              )}
              {item.trend === 'stable' && (
                <span className="flex items-center text-[10px] text-gray-300 font-medium">
                  <Minus className="w-3 h-3 mr-0.5" />
                  स्थिर
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right CTA WhatsApp Share & Expand */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={handleShareMandi}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[11px] transition shadow"
            title="मंडी भाव व्हाट्सएप पर भेजें"
          >
            <Share2 className="w-3 h-3" />
            <span className="hidden sm:inline">शेयर</span>
          </button>

          <button
            onClick={onOpenFullMandi}
            className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-200 hover:text-white"
          >
            <span>पूरा चार्ट</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
