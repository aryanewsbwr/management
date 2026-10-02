import React from 'react';
import { 
  Flame, TrendingUp, Sparkles, Share2, Volume2, 
  MapPin, Clock, ArrowRight, ShieldCheck 
} from 'lucide-react';
import ArticleCard from './ArticleCard';
import CategoryPlaceholder from './CategoryPlaceholder';
import MediaCarousel from './MediaCarousel';

export default function HeroMixedSection({
  articles = [],
  lang = 'hi',
  onOpenArticle,
  onPlayTTS,
  currentTTSId,
  bookmarks = [],
  onToggleBookmark,
  onSelectCategory
}) {
  if (!articles || articles.length === 0) return null;

  // Custom hero created by Uncle or top live breaking article
  const customHero = articles.find(a => a.id.startsWith('custom-') && a.isHero);
  const liveHero = articles.find(a => a.isLiveFeed && (a.category === 'rajasthan' || a.category === 'national'));
  const heroArticle = customHero || liveHero || articles.find(a => a.isHero) || articles[0];
  
  // Pick 3 diverse mixed trending stories
  const remaining = articles.filter(a => a.id !== heroArticle.id);
  const pickFromCat = (cat) => remaining.find(a => a.category === cat);

  const mixedTrending = [
    pickFromCat('rajasthan'),
    pickFromCat('national'),
    pickFromCat('sports') || pickFromCat('beawar') || pickFromCat('business')
  ].filter(Boolean);

  // If less than 3, fill from remaining
  if (mixedTrending.length < 3) {
    const ids = new Set(mixedTrending.map(m => m.id));
    for (const item of remaining) {
      if (!ids.has(item.id)) {
        mixedTrending.push(item);
        ids.add(item.id);
        if (mixedTrending.length >= 3) break;
      }
    }
  }

  const heroTitle = lang === 'hi' ? heroArticle.titleHi : (heroArticle.titleEn || heroArticle.titleHi);
  const heroSummary = lang === 'hi' ? heroArticle.summaryHi : (heroArticle.summaryEn || heroArticle.summaryHi);

  const handleHeroShare = (e) => {
    e.stopPropagation();
    const shareText = `*${heroTitle}*\n\n${heroSummary}\n\n👉 पूरी रिपोर्ट: https://www.aryannewsagency.com/\n\n*आर्यन न्यूज़ एजेंसी (ब्यावर)*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <section className="py-3 sm:py-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Section Header: FIRST MIX CATEGORY */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600 text-white shadow-md shadow-red-500/30">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-950 dark:text-white font-hindi leading-tight">
                {lang === 'hi' ? 'प्रमुख सुर्खियां (टॉप मिक्स)' : 'Top Headlines (Mixed Highlights)'}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                ब्यावर, राजस्थान, देश-दुनिया व व्यापार की सबसे बड़ी खबरें
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Mixed Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-stretch">
          
          {/* LEFT: Proportionate Hero Spotlight Article (7 Cols on desktop, bounded height) */}
          <div 
            onClick={() => onOpenArticle(heroArticle)}
            className="lg:col-span-7 group relative bg-gray-900 rounded-2xl overflow-hidden cursor-pointer shadow-lg h-[280px] sm:h-[360px] lg:h-[390px] flex flex-col justify-end"
          >
            {/* Background: Category Placeholder if Live Feed, or Image if custom Beawar article */}
            {heroArticle.isLiveFeed ? (
              <div className="absolute inset-0 w-full h-full">
                <CategoryPlaceholder 
                  category={heroArticle.category} 
                  sourceName={heroArticle.sourceName} 
                  size="hero" 
                />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full">
                <MediaCarousel
                  images={heroArticle.gallery && heroArticle.gallery.length > 0 ? heroArticle.gallery : [heroArticle.image]}
                  videoUrl={heroArticle.videoUrl}
                  mediaType={heroArticle.mediaType}
                  title={heroTitle}
                  aspectRatio="w-full h-full"
                  autoPlayInterval={4000}
                  showControls={false}
                  objectPosition="object-left"
                />
              </div>
            )}
            {/* Dark overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                <span>संपादकीय पसंद</span>
              </span>
              <span className="bg-black/60 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full border border-white/20">
                {heroArticle.category === 'beawar' ? 'ब्यावर विशेष' : heroArticle.category === 'rajasthan' ? 'राजस्थान' : heroArticle.category === 'sports' ? 'खेल जगत' : heroArticle.category === 'business' ? 'व्यापार' : 'लाइव हेडलाइन'}
              </span>
            </div>

            {/* Hero Content Bottom */}
            <div className="relative z-10 p-3.5 sm:p-5 text-white">
              <h3 className="text-base sm:text-xl md:text-2xl font-black font-hindi leading-tight drop-shadow-md group-hover:text-red-300 transition-colors line-clamp-2">
                {heroTitle}
              </h3>
              
              <p className="mt-1.5 text-xs sm:text-sm text-gray-200 line-clamp-1 sm:line-clamp-2 leading-relaxed drop-shadow">
                {heroSummary}
              </p>

              {/* Action & Metadata Bar */}
              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2.5 text-gray-300 text-[10px] sm:text-xs">
                  <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-none">{heroArticle.author}</span>
                  <span>•</span>
                  <span>{heroArticle.readTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Listen audio */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTTS(heroArticle);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                      currentTTSId === heroArticle.id
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">खबर सुनें</span>
                  </button>

                  {/* WhatsApp 1-tap share */}
                  <button
                    onClick={handleHeroShare}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 sm:px-3 py-1 rounded-full text-xs shadow-lg transition active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>शेयर</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Mixed Trending Grid (5 Cols on desktop - 3 compact cards matching hero height) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2.5 h-full">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-800">
              <span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                <span>ट्रेंडिंग मिक्स (Trending Mix)</span>
              </span>
              <span className="text-[10px] text-gray-400">लाइव अपडेट्स</span>
            </div>

            {/* List of 3 mixed stories */}
            <div className="flex flex-col gap-2 sm:gap-2.5 flex-1 justify-between">
              {mixedTrending.map((item) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  lang={lang}
                  layout="horizontal"
                  onOpenArticle={onOpenArticle}
                  onPlayTTS={onPlayTTS}
                  isPlayingAudio={currentTTSId === item.id}
                  isBookmarked={bookmarks.includes(item.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
