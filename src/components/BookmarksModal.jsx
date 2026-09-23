import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import ArticleCard from './ArticleCard';

export default function BookmarksModal({
  isOpen,
  onClose,
  bookmarkedArticles = [],
  lang = 'hi',
  onOpenArticle,
  onPlayTTS,
  currentTTSId,
  onToggleBookmark
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white font-hindi">
              सहेजी गई खबरें (Saved Articles)
            </h3>
            <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
              {bookmarkedArticles.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {bookmarkedArticles.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 font-hindi">
                आपने अभी तक कोई खबर सहेजी नहीं है।
              </p>
              <p className="text-xs text-gray-400 mt-1">
                किसी भी खबर के नीचे दिए गए बुकमार्क आइकन पर क्लिक करके उसे यहाँ सुरक्षित रख सकते हैं।
              </p>
            </div>
          ) : (
            bookmarkedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                lang={lang}
                layout="horizontal"
                onOpenArticle={(art) => {
                  onClose();
                  onOpenArticle(art);
                }}
                onPlayTTS={onPlayTTS}
                isPlayingAudio={currentTTSId === article.id}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
