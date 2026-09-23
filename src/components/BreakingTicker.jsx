import React, { useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function BreakingTicker({ items = [], onSelectHeadline }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const currentItem = items[currentIndex];

  return (
    <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        
        {/* Pulsing Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-red-600 text-white font-black text-[11px] sm:text-xs uppercase px-2.5 py-1 rounded shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
          <span>ताज़ा अपडेट</span>
        </div>

        {/* Headline Display */}
        <div className="flex-1 overflow-hidden">
          <div 
            onClick={() => onSelectHeadline && onSelectHeadline(currentItem)}
            className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400 cursor-pointer truncate transition"
          >
            {currentItem}
          </div>
        </div>

        {/* Counter and Arrows */}
        <div className="flex items-center gap-1 shrink-0 text-gray-500 dark:text-gray-400 text-xs">
          <span className="hidden sm:inline font-mono">
            {currentIndex + 1}/{items.length}
          </span>
          <button 
            onClick={handlePrev}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-gray-700 dark:text-gray-300 transition"
            title="पिछली खबर"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-gray-700 dark:text-gray-300 transition"
            title="अगली खबर"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
