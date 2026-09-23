import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Share2 } from 'lucide-react';
import { INITIAL_WEB_STORIES } from '../data/initialArticles';

export default function WebStories() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  const stories = INITIAL_WEB_STORIES;

  const handleOpenStory = (index) => {
    setActiveStoryIndex(index);
  };

  const handleClose = () => {
    setActiveStoryIndex(null);
  };

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleShareStory = (story) => {
    const text = `*वेब स्टोरी: ${story.title}*\nआर्यन न्यूज़ एजेंसी (ब्यावर)\nhttps://www.aryannewsagency.com/`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-3 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
            <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
            <span>वेब स्टोरीज़ (Web Stories)</span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold px-1.5 py-0.5 rounded">
              ट्रेंडिंग
            </span>
          </div>
          <span className="text-[11px] text-gray-500">स्वाइप करें 👉</span>
        </div>

        {/* Stories Horizontal Reel */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {stories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => handleOpenStory(idx)}
              className="flex-shrink-0 w-24 sm:w-28 cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-[2.5px] bg-gradient-to-tr from-amber-500 via-red-500 to-pink-500 shadow-md transition-transform group-hover:scale-105 active:scale-95">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-[14px] border-2 border-white dark:border-gray-900"
                  loading="lazy"
                />
              </div>
              <span className="mt-1.5 text-[11px] font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Interactive Web Story Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm h-full sm:h-[680px] bg-gray-900 rounded-none sm:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Top Progress Bars */}
            <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
              {stories.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i === activeStoryIndex
                      ? 'bg-white'
                      : i < activeStoryIndex
                      ? 'bg-white/70'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Top Bar with Agency Tag and Close */}
            <div className="absolute top-5 left-4 right-4 z-20 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">
                  आ
                </div>
                <div>
                  <span className="text-xs font-bold block">आर्यन न्यूज़ एजेंसी</span>
                  <span className="text-[10px] text-gray-300">ब्यावर विशेष</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Background Image */}
            <img
              src={stories[activeStoryIndex].image}
              alt={stories[activeStoryIndex].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

            {/* Interactive Tap Zones (Left: Prev, Right: Next) */}
            <div className="absolute inset-0 z-10 flex">
              <div onClick={handlePrev} className="w-1/3 h-full cursor-pointer" />
              <div onClick={handleNext} className="w-2/3 h-full cursor-pointer" />
            </div>

            {/* Bottom Caption & WhatsApp Share */}
            <div className="relative z-20 p-5 mt-auto text-white">
              <span className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                {stories[activeStoryIndex].tag}
              </span>
              <h3 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-md">
                {stories[activeStoryIndex].title}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleShareStory(stories[activeStoryIndex])}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg"
                >
                  <Share2 className="w-4 h-4" />
                  <span>व्हाट्सएप पर शेयर करें</span>
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
