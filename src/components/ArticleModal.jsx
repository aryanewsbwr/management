import React, { useState } from 'react';
import { 
  X, Share2, Volume2, Bookmark, Eye, Clock, 
  ExternalLink, ArrowLeft, Type, Check, Send
} from 'lucide-react';
import { CATEGORIES, AGENCY_INFO } from '../data/categories';

export default function ArticleModal({
  article,
  isOpen,
  onClose,
  lang = 'hi',
  onPlayTTS,
  isPlayingAudio = false,
  isBookmarked = false,
  onToggleBookmark,
  relatedArticles = [],
  onSelectRelated
}) {
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: normal, 1: medium, 2: large

  if (!isOpen || !article) return null;

  const categoryMeta = CATEGORIES.find(c => c.id === article.category) || CATEGORIES[1];
  const categoryLabel = lang === 'hi' ? categoryMeta.nameHi : categoryMeta.nameEn;

  const title = lang === 'hi' ? article.titleHi : (article.titleEn || article.titleHi);
  const content = lang === 'hi' ? (article.contentHi || article.summaryHi) : (article.contentEn || article.summaryEn || article.contentHi);

  const fontClasses = [
    'text-base leading-relaxed',
    'text-lg leading-relaxed sm:text-xl sm:leading-loose',
    'text-xl leading-loose sm:text-2xl'
  ];

  const handleWhatsAppShare = () => {
    const text = `*${title}*\n\n${content ? content.slice(0, 160) + '...' : ''}\n\n👉 पूरी खबर पढ़ें: https://www.aryannewsagency.com/\n\n*आर्यन न्यूज़ एजेंसी (ब्यावर)*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 min-h-screen sm:min-h-0 sm:my-8 sm:rounded-2xl shadow-2xl overflow-hidden border-0 sm:border border-gray-200 dark:border-gray-800 flex flex-col">
        
        {/* STICKY TOP CONTROL BAR */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
              title="वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md">
              {categoryLabel}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Font size control */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 text-xs text-gray-700 dark:text-gray-300">
              <button
                onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
                className="px-2 py-1 hover:bg-white dark:hover:bg-gray-700 rounded font-bold"
                title="छोटा फ़ॉन्ट"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeLevel(Math.min(2, fontSizeLevel + 1))}
                className="px-2 py-1 hover:bg-white dark:hover:bg-gray-700 rounded font-bold"
                title="बड़ा फ़ॉन्ट"
              >
                A+
              </button>
            </div>

            {/* Audio Speech */}
            <button
              onClick={() => onPlayTTS(article)}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition ${
                isPlayingAudio
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-red-600'
              }`}
              title="खबर सुनें"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isPlayingAudio ? 'रुकें' : 'सुनें'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-lg transition ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-amber-600'
              }`}
              title="सेव करें"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ARTICLE BODY */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          
          {/* Headline */}
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-hindi text-gray-950 dark:text-white leading-tight">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="mt-4 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {article.author || 'आर्यन ब्यूरो, ब्यावर'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString('hi-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            {article.views && (
              <span className="flex items-center gap-1 font-mono text-gray-400">
                <Eye className="w-3.5 h-3.5" />
                {article.views.toLocaleString()} पाठक
              </span>
            )}
          </div>

          {/* Featured Image */}
          <div className="my-5 rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={article.image}
              alt={title}
              className="w-full h-auto max-h-[420px] object-cover"
            />
            <div className="p-2 text-center text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80">
              फोटो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)
            </div>
          </div>

          {/* Audio Player Banner (Highlight) */}
          <div className="my-4 p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-red-200">
              <Volume2 className="w-4 h-4 text-red-600 animate-bounce" />
              <span>ऑडियो बुलेटिन: क्या आप इस खबर को सुनना चाहते हैं?</span>
            </div>
            <button
              onClick={() => onPlayTTS(article)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
            >
              {isPlayingAudio ? 'रोकें' : 'खबर सुनें'}
            </button>
          </div>

          {/* Content Text with line breaks */}
          <div className={`mt-6 text-gray-800 dark:text-gray-200 font-hindi whitespace-pre-line ${fontClasses[fontSizeLevel]}`}>
            {content}
          </div>

          {/* Original source link if live RSS */}
          {article.originalUrl && (
            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs flex items-center justify-between">
              <span className="text-gray-500">स्रोत: {article.sourceName || 'लाइव फीड'}</span>
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-600 hover:underline font-bold"
              >
                <span>मूल स्रोत देखें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Bottom Viral WhatsApp Share Bar */}
          <div className="mt-8 p-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm sm:text-base font-hindi">
                यह खबर अपने दोस्तों व ग्रुप्स में शेयर करें!
              </h4>
              <p className="text-xs text-emerald-100">
                ब्यावर व राजस्थान की हर ताज़ा खबर सबसे पहले पाने के लिए शेयर करें।
              </p>
            </div>
            <button
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>व्हाट्सएप पर शेयर करें</span>
            </button>
          </div>

          {/* RELATED STORIES */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-base font-bold font-hindi text-gray-900 dark:text-white mb-4">
                संबंधित अन्य खबरें (Related News)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition flex gap-3"
                  >
                    <img
                      src={rel.image}
                      alt={rel.titleHi}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {lang === 'hi' ? rel.titleHi : (rel.titleEn || rel.titleHi)}
                      </h5>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {rel.readTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
