import React from 'react';
import { 
  Share2, Volume2, Bookmark, Clock, Eye, 
  ExternalLink, ChevronRight, Check
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function ArticleCard({
  article,
  lang = 'hi',
  onOpenArticle,
  onPlayTTS,
  isPlayingAudio = false,
  isBookmarked = false,
  onToggleBookmark,
  layout = 'standard' // 'standard' | 'horizontal' | 'compact' | 'hero'
}) {
  const categoryMeta = CATEGORIES.find(c => c.id === article.category) || CATEGORIES[1];
  const categoryLabel = lang === 'hi' ? categoryMeta.nameHi : categoryMeta.nameEn;

  const title = lang === 'hi' ? article.titleHi : (article.titleEn || article.titleHi);
  const summary = lang === 'hi' ? article.summaryHi : (article.summaryEn || article.summaryHi);

  // Time formatting
  const timeAgo = (dateStr) => {
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 60) return `${Math.max(1, diffMins)} मिनट पहले`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} घंटे पहले`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} दिन पहले`;
    } catch {
      return 'ताज़ा';
    }
  };

  // WhatsApp 1-tap viral share
  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const shareText = `*${title}*\n\n${summary ? summary.slice(0, 140) + '...' : ''}\n\n👉 पूरी खबर पढ़ें: https://www.aryannewsagency.com/\n\n*आर्यन न्यूज़ एजेंसी (ब्यावर)* - सबसे तेज, सबसे विश्वसनीय।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleAudioClick = (e) => {
    e.stopPropagation();
    onPlayTTS(article);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onToggleBookmark(article.id);
  };

  // 1. HORIZONTAL MOBILE-FIRST CARD (Used extensively for list views)
  if (layout === 'horizontal') {
    return (
      <article
        onClick={() => onOpenArticle(article)}
        className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-200 cursor-pointer flex gap-3 sm:gap-4 items-start"
      >
        {/* Left / Thumbnail */}
        <div className="relative w-28 h-24 sm:w-36 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={article.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute top-1 left-1 bg-red-600/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
            {categoryLabel}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-xs sm:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 leading-snug">
              {title}
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
              {summary}
            </p>
          </div>

          {/* Meta & Action Bar */}
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 dark:border-gray-800/80 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span>{timeAgo(article.publishedAt)}</span>
            </span>

            <div className="flex items-center gap-1.5">
              {/* Audio Listen */}
              <button
                onClick={handleAudioClick}
                className={`p-1.5 rounded-full transition ${
                  isPlayingAudio
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-600'
                }`}
                title="खबर सुनें"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmarkClick}
                className={`p-1.5 rounded-full transition ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-amber-600'
                }`}
                title="सेव करें"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>

              {/* 1-Tap WhatsApp Share */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded-md text-[10px] shadow-sm transition active:scale-95"
                title="व्हाट्सएप पर शेयर करें"
              >
                <Share2 className="w-3 h-3" />
                <span className="hidden xs:inline">शेयर</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. STANDARD VERTICAL CARD
  return (
    <article
      onClick={() => onOpenArticle(article)}
      className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={article.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Category Badge */}
        <span className="absolute top-2.5 left-2.5 bg-red-600 text-white font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md">
          {categoryLabel}
        </span>

        {article.isBreaking && (
          <span className="absolute top-2.5 right-2.5 bg-amber-500 text-gray-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow animate-pulse">
            ब्रेकिंग
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 leading-snug transition-colors">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span>{timeAgo(article.publishedAt)}</span>
            </span>
            {article.views && (
              <span className="hidden sm:flex items-center gap-1">
                <Eye className="w-3 h-3 text-gray-400" />
                <span>{article.views.toLocaleString()}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Button */}
            <button
              onClick={handleAudioClick}
              className={`p-1.5 rounded-full transition ${
                isPlayingAudio
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-600'
              }`}
              title="खबर सुनें"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full transition ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-amber-600'
              }`}
              title="सेव करें"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded-lg text-[11px] shadow-sm transition active:scale-95"
              title="व्हाट्सएप पर शेयर करें"
            >
              <Share2 className="w-3 h-3" />
              <span>शेयर</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
