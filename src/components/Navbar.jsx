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
  onOpenAdmin,
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
  const [showSearchInput, setShowSearchInput] = useState(false);

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
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* 1. TOP MINI UTILITY BAR */}
      <div className="bg-gradient-to-r from-red-800 via-brand-700 to-red-900 text-white text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-red-600/30">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 font-medium text-amber-200">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>ब्यावर, राजस्थान</span>
          </span>
          <span className="hidden md:inline text-red-200">|</span>
          <span className="hidden md:inline text-gray-100">{currentDateTime}</span>
          <span className="hidden lg:inline bg-red-900/60 px-2 py-0.5 rounded text-[11px] text-amber-200">
            तापमान: 31°C धूप
          </span>

          {/* Live API Status Indicator */}
          <span className="inline-flex items-center gap-1 bg-black/30 text-emerald-300 font-medium px-2 py-0.5 rounded text-[11px] border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline">लाइव API</span>
            <span className="font-mono font-bold text-white">({liveCount || 80}+ लाइव)</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Refresh Live News Button */}
          <button
            onClick={onRefreshLiveNews}
            disabled={isLoadingLiveNews}
            className="flex items-center gap-1 bg-red-950 hover:bg-black/50 text-white px-2 py-0.5 rounded text-[11px] transition border border-red-500/40 disabled:opacity-50"
            title="लाइव खबरें रीफ्रेश करें"
          >
            <RefreshCw className={`w-3 h-3 text-amber-300 ${isLoadingLiveNews ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoadingLiveNews ? 'लोड हो रहा...' : 'ताज़ा करें'}</span>
          </button>
          {/* Quick Helpline WhatsApp */}
          <a
            href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('नमस्ते आर्यन न्यूज़ एजेंसी, मुझे विज्ञापन/समाचार के संबंध में संपर्क करना है।')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2 py-0.5 rounded text-[11px] transition shadow-sm"
            title="व्हाट्सएप हेल्पलाइन"
          >
            <PhoneCall className="w-3 h-3" />
            <span className="hidden sm:inline">हेल्पलाइन:</span>
            <span>+91 98290-58949</span>
          </a>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 bg-black/20 hover:bg-black/40 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide transition border border-white/20"
            title="भाषा बदलें"
          >
            <Globe className="w-3 h-3 text-amber-300" />
            <span>{lang === 'hi' ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1 rounded bg-black/20 hover:bg-black/40 text-amber-200 transition"
            title="थीम बदलें"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Admin CMS Access */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-[11px] text-red-200 hover:text-white transition px-1"
            title="संपादकीय एडमिन लॉगिन"
          >
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">एडमिन</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN LOGO & BRANDING BAR */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
          
          {/* Logo & Agency Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => onSelectCategory('all')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-brand-700 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 font-black text-2xl sm:text-3xl font-hindi shrink-0 border border-white">
              आ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-950 dark:text-white font-hindi leading-tight">
                  {lang === 'hi' ? AGENCY_INFO.nameHi : AGENCY_INFO.nameEn}
                </h1>
                <span className="hidden md:inline-flex items-center gap-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800">
                  <ShieldCheck className="w-3 h-3 text-red-600" />
                  वेरिफाइड
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">
                {lang === 'hi' ? AGENCY_INFO.taglineHi : AGENCY_INFO.taglineEn}
                <span className="text-red-600 dark:text-red-400 font-semibold ml-1.5 hidden sm:inline">
                  • ब्यावर (राजस्थान)
                </span>
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Input toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 border border-red-500">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="खबर या कीवर्ड खोजें..."
                    className="bg-transparent text-sm text-gray-800 dark:text-gray-100 focus:outline-none w-32 sm:w-48"
                    autoFocus
                  />
                  <button onClick={() => setShowSearchInput(false)} className="text-gray-400 hover:text-gray-600 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="खोजें"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="सहेजी गई खबरें"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarksCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Citizen Journalism: Send News Button */}
            <button
              onClick={onOpenSubmitNews}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-700 hover:from-red-700 hover:to-brand-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition transform active:scale-95"
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

      {/* 3. HORIZONTAL CATEGORIES BAR (Desktop & Mobile Swipeable) */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar py-1">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1 sm:gap-2 whitespace-nowrap min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm shadow-red-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600'
                }`}
              >
                {cat.isHot && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                <span>{lang === 'hi' ? cat.nameHi : cat.nameEn}</span>
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
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 rounded-lg text-sm"
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
