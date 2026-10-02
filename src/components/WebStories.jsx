import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Share2, BookOpen, Play, Video } from 'lucide-react';
import { getArticleThumbnail } from '../utils/mediaHelper';

export default function WebStories({ articles = [], onOpenArticle }) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  // Filter for local Beawar news / custom uploaded stories
  const localArticles = articles.filter(a => 
    !a.category?.startsWith('_') && 
    (a.category === 'beawar' || !a.isLiveFeed)
  );

  // Use local Beawar stories, taking up to 10
  const validArticles = localArticles.length > 0 ? localArticles : articles.filter(a => !a.category?.startsWith('_'));
  
  const stories = validArticles.slice(0, 10).map((art, idx) => {
    const img = getArticleThumbnail(art);
    const isVideo = Boolean(art.videoUrl || art.mediaType === 'video');

    return {
      id: art.id || `story-${idx}`,
      title: art.titleHi || art.title || '',
      image: img,
      videoUrl: art.videoUrl || null,
      isVideo: isVideo,
      summary: art.summaryHi || art.contentHi?.slice(0, 140) || '',
      author: art.author || 'ब्यावर रिपोर्टर',
      tag: 'ब्यावर',
      badgeColor: 'bg-red-600 text-white',
      article: art
    };
  });

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
    const articleId = story.article?.id || story.id;
    const shareUrl = `https://www.aryannewsagency.com/news/${articleId}`;
    const text = `*वेब स्टोरी: ${story.title}*\n\n👉 पूरी खबर एवं वीडियो देखें:\n${shareUrl}\n\n*आर्यन न्यूज़ एजेंसी (ब्यावर)*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (stories.length === 0) return null;

  return (
    <section className="bg-white dark:bg-gray-900 py-5 sm:py-6 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 bg-purple-600 rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-black font-hindi text-gray-950 dark:text-white">
              वेब स्टोरीज़
            </h2>
          </div>
          <span className="text-[11px] text-gray-400 font-hindi">स्वाइप करें 👉</span>
        </div>

        {/* Stories Horizontal Cards */}
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-2">
          {stories.map((story, idx) => (
            <div
              key={story.id || idx}
              onClick={() => handleOpenStory(idx)}
              className="flex-shrink-0 w-32 sm:w-36 h-48 sm:h-56 rounded-2xl overflow-hidden cursor-pointer relative shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col justify-between p-3 border border-gray-200/40 dark:border-gray-700 select-none bg-gray-900"
            >
              {/* Background Image */}
              <img
                src={story.image}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

              {/* Top Category Tag Badge */}
              <div className="relative z-10 self-start flex items-center gap-1.5">
                <span className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md shadow ${story.badgeColor}`}>
                  {story.tag}
                </span>
                {story.isVideo && (
                  <span className="p-1 rounded-md bg-black/70 backdrop-blur-sm text-white shadow">
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </span>
                )}
              </div>

              {/* Bottom Title */}
              <div className="relative z-10">
                <h3 className="text-xs sm:text-sm font-bold font-hindi text-white line-clamp-3 leading-snug drop-shadow-md">
                  {story.title}
                </h3>
              </div>
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

              <div className="mt-4 flex flex-col gap-2">
                {onOpenArticle && stories[activeStoryIndex].article && (
                  <button
                    onClick={() => {
                      const selected = stories[activeStoryIndex].article;
                      handleClose();
                      onOpenArticle(selected);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg transition active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📖 पूरी खबर विस्तार से पढ़ें</span>
                  </button>
                )}

                <div className="flex items-center justify-between gap-2">
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
        </div>
      )}
    </section>
  );
}

