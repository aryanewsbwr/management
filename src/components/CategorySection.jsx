import React from 'react';
import { 
  ArrowRight, Sparkles, MapPin, Landmark, Globe, 
  Trophy, Film, Briefcase, ShieldAlert, TrendingUp 
} from 'lucide-react';
import ArticleCard from './ArticleCard';
import { CATEGORIES } from '../data/categories';

const ICON_MAP = {
  beawar: MapPin,
  rajasthan: Landmark,
  national: Globe,
  sports: Trophy,
  entertainment: Film,
  business: Briefcase,
  crime: ShieldAlert,
  mandi: TrendingUp,
};

export default function CategorySection({
  categoryId,
  articles = [],
  lang = 'hi',
  onOpenArticle,
  onPlayTTS,
  currentTTSId,
  bookmarks = [],
  onToggleBookmark,
  onViewMoreCategory
}) {
  const categoryMeta = CATEGORIES.find(c => c.id === categoryId);
  if (!categoryMeta) return null;

  const IconComponent = ICON_MAP[categoryId] || MapPin;
  const title = lang === 'hi' ? categoryMeta.nameHi : categoryMeta.nameEn;

  // Filter articles belonging to this category
  const categoryArticles = articles.filter(a => a.category === categoryId);

  // If no articles: for beawar, display the informative notice; for other categories return null
  if (categoryArticles.length === 0) {
    if (categoryId === 'beawar') {
      return (
        <section className="py-6 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-xl font-black text-gray-950 dark:text-white font-hindi">
                    {lang === 'hi' ? 'ब्यावर विशेष (लोकल न्यूज़)' : 'Beawar Local News'}
                  </h3>
                  <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold px-2 py-0.5 rounded-full">
                    लाइव डेस्क
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">चांग गेट, मेवाड़ी गेट, सेंदड़ा रोड व आसपास की खबरें</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-800/60 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
                📍
              </div>
              <h4 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white">
                अभी ब्यावर क्षेत्र की कोई नई खबर उपलब्ध नहीं है
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-hindi mt-1.5 max-w-lg mx-auto leading-relaxed">
                हमारे स्थानीय संवाददाता एवं ब्यूरो द्वारा खबर अपलोड होते ही यहाँ सबसे पहले प्रदर्शित होगी। क्या आपके पास कोई स्थानीय समाचार है?
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://wa.me/919829058949?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%AC%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%B5%E0%A4%B0%20%E0%A4%95%E0%A5%80%20%E0%A4%96%E0%A4%AC%E0%A4%B0%20%E0%A4%AD%E0%A5%87%E0%A4%9C%E0%A4%A8%E0%A5%80%20%E0%A4%B9%E0%A5%88%E0%A5%A4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
                >
                  <span>📲 ब्यावर की खबर व्हाट्सएप पर भेजें (+91 98290-58949)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-4 sm:py-6 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Category Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-800 ${categoryMeta.color} shadow-sm`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-black text-gray-950 dark:text-white font-hindi leading-tight">
                  {title}
                </h3>
                {categoryMeta.isHot && (
                  <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold px-2 py-0.5 rounded-full">
                    विशेष
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {categoryArticles.length} ताज़ा रिपोर्ट्स
              </p>
            </div>
          </div>

          {onViewMoreCategory && (
            <button
              onClick={() => onViewMoreCategory(categoryId)}
              className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 transition"
            >
              <span>और देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Card Grid (Responsive for both Mobile & Laptops) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {categoryArticles.slice(0, 6).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              lang={lang}
              layout="standard"
              onOpenArticle={onOpenArticle}
              onPlayTTS={onPlayTTS}
              isPlayingAudio={currentTTSId === article.id}
              isBookmarked={bookmarks.includes(article.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
