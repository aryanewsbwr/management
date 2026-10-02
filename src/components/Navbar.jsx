import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Search, Globe, Sun, Moon, PhoneCall, Share2, 
  Send, Sparkles, MapPin, ShieldCheck, Flame, Bookmark, Lock, RefreshCw
} from 'lucide-react';
import { CATEGORIES, AGENCY_INFO } from '../data/categories';

export default function Navbar({ 
  selectedCategory, 
  onSelectCategory, 
  lang, 
  onToggleLang, 
  theme, 
  onToggleTheme, 
  onOpenSubmitNews,
  onOpenBookmarks,
  bookmarksCount,
  searchQuery,
  onSearchChange,
  isLoadingLiveNews,
  onRefreshLiveNews,
  liveCount
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const formatted = lang === 'hi' 
        ? now.toLocaleDateString('hi-IN', options)
        : now.toLocaleDateString('en-IN', options);
      setCurrentDateTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full shadow-sm overflow-hidden font-hindi">
      
      {/* 1. TOP UTILITY BAR (Exact Dark Red style from PDF) */}
      <div className="bg-[#991b1b] text-white text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-red-900/40 w-full overflow-hidden">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex items-center gap-1 font-medium text-amber-100">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-bold">ब्यावर, राजस्थान</span>
          </span>
          <span className="text-red-300/80">·</span>
          <span className="text-gray-100 text-[11px] sm:text-xs">{currentDateTime}</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {/* Email link (Desktop) */}
          <a
            href="mailto:info@aryannewsagency.com"
            className="hidden md:inline text-gray-200 hover:text-white transition font-mono text-[11px]"
          >
            info@aryannewsagency.com
          </a>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide transition border border-white/20"
            title="भाषा बदलें (Toggle Language)"
          >
            <Globe className="w-3 h-3 text-amber-300" />
            <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-amber-200 transition"
            title="थीम बदलें"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN LOGO & BRANDING BAR */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Agency Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => onSelectCategory('all')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-gray-800 p-0.5 shadow-sm border border-gray-200 dark:border-gray-700 shrink-0 overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="Aryan News Agency Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-950 dark:text-white font-hindi leading-tight">
                {lang === 'hi' ? AGENCY_INFO.nameHi : AGENCY_INFO.nameEn}
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                ब्यावर की ताज़ा खबरें · 1940 से आपके साथ
              </p>
            </div>
          </div>

          {/* Center/Right Action Elements (Desktop Search + Submit News) */}
          <div className="flex items-center gap-3">
            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center bg-stone-100 dark:bg-gray-800 rounded-full px-3.5 py-1.5 border border-gray-200 dark:border-gray-700 w-44 lg:w-56">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="खबरें खोजें..."
                className="bg-transparent text-xs text-gray-800 dark:text-gray-100 focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => onOpenSubmitNews()}
                className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition hidden sm:block"
              title="सहेजी गई खबरें"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarksCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Citizen Journalism: Send News Button (Red Button in Mockup) */}
            <button
              onClick={onOpenSubmitNews}
              className="flex items-center gap-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-sm transition active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>अपनी खबर भेजें</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. HORIZONTAL CATEGORIES BAR (Pills with solid red active pill) */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar py-2 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-2 whitespace-nowrap min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#b91c1c] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {lang === 'hi' ? cat.nameHi : cat.nameEn}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. EXPANDABLE MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-xl">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            सभी श्रेणियां (Categories)
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left p-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {lang === 'hi' ? cat.nameHi : cat.nameEn}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSubmitNews();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#b91c1c] text-white font-bold py-2 rounded-lg text-sm"
            >
              <Send className="w-4 h-4" />
              <span>अपनी खबर या फोटो भेजें</span>
            </button>
            <a
              href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('नमस्ते आर्यन न्यूज़ एजेंसी, मुझे विज्ञापन की जानकारी चाहिए।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>विज्ञापन के लिए संपर्क करें</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
}
