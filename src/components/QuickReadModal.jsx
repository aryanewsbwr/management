import React, { useState } from 'react';
import { 
  X, ChevronUp, ChevronDown, Share2, Volume2, 
  Bookmark, Sparkles, ExternalLink 
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function QuickReadModal({
  isOpen,
  onClose,
  articles = [],
  lang = 'hi',
  onPlayTTS,
  isPlayingAudio = false,
  currentTTSId,
  bookmarks = [],
  onToggleBookmark
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !articles || articles.length === 0) return null;

  const current = articles[currentIndex] || articles[0];
  const categoryMeta = CATEGORIES.find(c => c.id === current.category) || CATEGORIES[1];
  const categoryLabel = lang === 'hi' ? categoryMeta.nameHi : categoryMeta.nameEn;

  const title = lang === 'hi' ? current.titleHi : (current.titleEn || current.titleHi);
  const summary = lang === 'hi' ? current.summaryHi : (current.summaryEn || current.summaryHi);

  const handleNext = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShare = () => {
    const text = `*शॉर्ट न्यूज़: ${title}*\n\n${summary}\n\n👉 विस्तार से पढ़ें: https://www.aryannewsagency.com/\n\n*आर्यन न्यूज़ एजेंसी (ब्यावर)*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-md h-full sm:h-[680px] bg-white dark:bg-gray-900 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between border-0 sm:border border-gray-800">
        
        {/* Top Control Bar */}
        <div className="p-3 bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-red-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>60-शब्द त्वरित खबर</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              ({currentIndex + 1}/{articles.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Card Body */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Image */}
          <div className="relative h-56 sm:h-64 w-full bg-gray-950 overflow-hidden shrink-0">
            <img
              src={current.image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              {categoryLabel}
            </span>
          </div>

          {/* Text Content */}
          <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
            <div>
              <h2 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white leading-snug">
                {title}
              </h2>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 font-hindi leading-relaxed">
                {summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <span>{current.author || 'आर्यन ब्यूरो, ब्यावर'}</span>
              <span>{current.readTime}</span>
            </div>
          </div>
        </div>

        {/* Bottom Swiper & Action Bar */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            {/* Audio Listen */}
            <button
              onClick={() => onPlayTTS(current)}
              className={`p-2 rounded-xl transition ${
                currentTTSId === current.id
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
              title="खबर सुनें"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(current.id)}
              className={`p-2 rounded-xl transition ${
                bookmarks.includes(current.id)
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-sm transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>शेयर</span>
            </button>
          </div>

          {/* Swipe Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-40"
              title="पिछली खबर"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md"
              title="अगली खबर"
            >
              <span>अगली</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
