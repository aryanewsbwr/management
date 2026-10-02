import React from 'react';
import { Sparkles, ArrowRight, ExternalLink, Clock, Flame, ChevronRight } from 'lucide-react';
import MediaCarousel from './MediaCarousel';
import CategoryPlaceholder from './CategoryPlaceholder';

export default function EditorialMagazineGrid({
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

  // 1. BEAWAR ARTICLES
  const beawarArticles = articles.filter(a => a.category === 'beawar' || a.id.startsWith('custom-'));
  const beawarHero = beawarArticles[0] || articles[0];
  const beawarList = beawarArticles.slice(1, 4);
  // Fill beawarList if needed
  if (beawarList.length < 3) {
    const usedIds = new Set([beawarHero.id, ...beawarList.map(a => a.id)]);
    for (const art of articles) {
      if (!usedIds.has(art.id)) {
        beawarList.push(art);
        usedIds.add(art.id);
        if (beawarList.length >= 3) break;
      }
    }
  }

  // 2. BIG BREAKING / TODAY'S HIGHLIGHT (आज की बड़ी खबर)
  const nationalArticles = articles.filter(a => a.category === 'national' || a.category === 'international');
  const bigBreaking = nationalArticles[0] || articles[1] || articles[0];
  const nationalList = nationalArticles.slice(1, 5);
  if (nationalList.length < 4) {
    const usedIds = new Set([beawarHero.id, ...beawarList.map(a => a.id), bigBreaking.id, ...nationalList.map(a => a.id)]);
    for (const art of articles) {
      if (!usedIds.has(art.id) && art.category !== 'sports') {
        nationalList.push(art);
        usedIds.add(art.id);
        if (nationalList.length >= 4) break;
      }
    }
  }

  // 3. RAJASTHAN STATE ARTICLES
  const rajasthanArticles = articles.filter(a => a.category === 'rajasthan');
  const rajasthanList = rajasthanArticles.slice(0, 4);
  if (rajasthanList.length < 4) {
    const usedIds = new Set([beawarHero.id, ...beawarList.map(a => a.id), bigBreaking.id, ...nationalList.map(a => a.id), ...rajasthanList.map(a => a.id)]);
    for (const art of articles) {
      if (!usedIds.has(art.id) && art.category !== 'sports') {
        rajasthanList.push(art);
        usedIds.add(art.id);
        if (rajasthanList.length >= 4) break;
      }
    }
  }

  // 4. SPORTS ARTICLES
  const sportsArticles = articles.filter(a => a.category === 'sports');
  const sportsList = sportsArticles.slice(0, 3);
  if (sportsList.length < 3) {
    const usedIds = new Set([
      beawarHero.id, ...beawarList.map(a => a.id), 
      bigBreaking.id, ...nationalList.map(a => a.id), 
      ...rajasthanList.map(a => a.id), ...sportsList.map(a => a.id)
    ]);
    for (const art of articles) {
      if (!usedIds.has(art.id)) {
        sportsList.push(art);
        usedIds.add(art.id);
        if (sportsList.length >= 3) break;
      }
    }
  }

  // Helper for source & time formatting
  const formatSourceTime = (art) => {
    const source = art.author || art.sourceName || (art.category === 'beawar' ? 'जनसंपर्क कार्यालय' : 'आर्यन ब्यूरो');
    const pubDate = new Date(art.publishedAt || Date.now());
    const diffHours = Math.max(1, Math.round((Date.now() - pubDate.getTime()) / (1000 * 60 * 60)));
    const timeStr = diffHours < 24 ? `${diffHours} घंटे पहले` : `${Math.floor(diffHours / 24)} दिन पहले`;
    return `स्रोत: ${source} · ${timeStr}`;
  };

  const formatSourceShort = (art) => {
    const source = art.author || art.sourceName || (art.category === 'beawar' ? 'जनसंपर्क कार्यालय' : 'दैनिक भास्कर');
    const pubDate = new Date(art.publishedAt || Date.now());
    const diffHours = Math.max(1, Math.round((Date.now() - pubDate.getTime()) / (1000 * 60 * 60)));
    const timeStr = diffHours < 24 ? `${diffHours} घंटे पहले` : `${Math.floor(diffHours / 24)} दिन पहले`;
    return `${source} · ${timeStr}`;
  };

  return (
    <section className="py-4 sm:py-6 bg-stone-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Main 3-Column Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* COLUMN 1 (Left ~45% / 5.5 cols): ब्यावर विशेष (Hero + 3 compact items) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block" />
                <h2 className="text-lg sm:text-xl font-black font-hindi text-gray-950 dark:text-white">
                  ब्यावर विशेष
                </h2>
              </div>
              <button
                onClick={() => onSelectCategory('beawar')}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-0.5"
              >
                <span>सभी देखें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Featured Card */}
            {beawarHero && (
              <article 
                onClick={() => onOpenArticle(beawarHero)}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                {/* Media Photo / Carousel */}
                <div className="relative aspect-[16/10] w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {beawarHero.isLiveFeed ? (
                    <CategoryPlaceholder category={beawarHero.category} sourceName={beawarHero.sourceName} size="standard" />
                  ) : (
                    <MediaCarousel
                      images={beawarHero.gallery && beawarHero.gallery.length > 0 ? beawarHero.gallery : [beawarHero.image]}
                      videoUrl={beawarHero.videoUrl}
                      mediaType={beawarHero.mediaType}
                      title={beawarHero.titleHi}
                      aspectRatio="w-full h-full"
                      autoPlayInterval={3500}
                      showControls={false}
                      objectPosition="object-left"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="inline-block bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    ब्यावर
                  </div>

                  <h3 className="text-base sm:text-lg font-black font-hindi text-gray-950 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition leading-snug">
                    {beawarHero.titleHi}
                  </h3>

                  {beawarHero.summaryHi && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-hindi line-clamp-2 leading-relaxed">
                      {beawarHero.summaryHi}
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 text-[11px] text-gray-400 dark:text-gray-500 font-hindi">
                    {formatSourceTime(beawarHero)}
                  </div>
                </div>
              </article>
            )}

            {/* 3 Compact Items Below */}
            <div className="space-y-2.5 pt-1">
              {beawarList.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onOpenArticle(item)}
                  className="p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200/70 dark:border-gray-800 flex items-center gap-3 hover:border-gray-300 dark:hover:border-gray-700 transition cursor-pointer group shadow-2xs"
                >
                  {/* Left Thumbnail */}
                  <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-stone-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700/60">
                    {item.image && !item.image.includes('unsplash.com') ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : item.videoUrl ? (
                      <img src={item.videoUrl.replace(/\.(mp4|webm|mov|mkv)$/i, '.jpg')} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-lg">📷</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold font-hindi text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 leading-snug">
                      {item.titleHi}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 font-hindi truncate">
                      {item.author || 'जनसंपर्क कार्यालय'} · 1 दिन पहले
                    </p>
                  </div>
                </article>
              ))}
            </div>

          </div>


          {/* ========================================================================= */}
          {/* COLUMN 2 (Center ~30% / 3.8 cols): आज की बड़ी खबर + देश-विदेश */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* 1. आज की बड़ी खबर (Dark Maroon/Wine Card) */}
            {bigBreaking && (
              <article 
                onClick={() => onOpenArticle(bigBreaking)}
                className="bg-gradient-to-br from-[#6b1414] via-[#591010] to-[#450a0a] text-white rounded-2xl p-5 shadow-md border border-red-900/50 cursor-pointer group relative overflow-hidden space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shadow">
                    आज की बड़ी खबर
                  </span>
                  <span className="text-[11px] text-red-200 font-hindi">
                    देश-विदेश
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black font-hindi text-white group-hover:text-red-200 transition leading-snug">
                  {bigBreaking.titleHi}
                </h3>

                {bigBreaking.summaryHi && (
                  <p className="text-xs text-gray-200 font-hindi line-clamp-3 leading-relaxed">
                    {bigBreaking.summaryHi}
                  </p>
                )}

                <div className="pt-2 border-t border-red-800/60 flex items-center justify-between text-[11px] text-red-200/90 font-hindi">
                  <span>{formatSourceTime(bigBreaking)}</span>
                  <span className="underline font-bold text-white group-hover:text-amber-200">
                    मूल खबर पढ़ें
                  </span>
                </div>
              </article>
            )}

            {/* 2. देश-विदेश List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
                  <h3 className="text-base sm:text-lg font-black font-hindi text-gray-950 dark:text-white">
                    देश-विदेश
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('national')}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  और देखें
                </button>
              </div>

              <div className="space-y-3 divide-y divide-gray-100 dark:divide-gray-800/80">
                {nationalList.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => onOpenArticle(item)}
                    className="pt-3 first:pt-0 cursor-pointer group space-y-1"
                  >
                    <h4 className="text-xs sm:text-sm font-bold font-hindi text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 leading-snug">
                      {item.titleHi}
                    </h4>
                    {item.summaryHi && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-hindi line-clamp-2 leading-relaxed">
                        {item.summaryHi}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 font-hindi pt-0.5">
                      {formatSourceShort(item)}
                    </p>
                  </article>
                ))}
              </div>
            </div>

          </div>


          {/* ========================================================================= */}
          {/* COLUMN 3 (Right ~25% / 3.2 cols): राजस्थान (Numbered) + खेल */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* 1. राजस्थान (Numbered Top Stories) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block" />
                  <h3 className="text-base sm:text-lg font-black font-hindi text-gray-950 dark:text-white">
                    राजस्थान
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('rajasthan')}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  और देखें
                </button>
              </div>

              <div className="space-y-3">
                {rajasthanList.map((item, idx) => (
                  <article
                    key={item.id}
                    onClick={() => onOpenArticle(item)}
                    className="flex items-start gap-2.5 cursor-pointer group pb-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0"
                  >
                    <span className="text-base sm:text-lg font-black text-amber-500 dark:text-amber-400 shrink-0 w-4 font-mono">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="text-xs sm:text-[13px] font-bold font-hindi text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 leading-snug line-clamp-2">
                        {item.titleHi}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-hindi">
                        {formatSourceShort(item)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* 2. खेल (Sports) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-600 rounded-full inline-block" />
                  <h3 className="text-base sm:text-lg font-black font-hindi text-gray-950 dark:text-white">
                    खेल
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('sports')}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  और देखें
                </button>
              </div>

              <div className="space-y-3">
                {sportsList.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => onOpenArticle(item)}
                    className="cursor-pointer group space-y-0.5 pb-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0"
                  >
                    <h4 className="text-xs sm:text-[13px] font-bold font-hindi text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 leading-snug line-clamp-2">
                      {item.titleHi}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-hindi">
                      {formatSourceShort(item)}
                    </p>
                  </article>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
