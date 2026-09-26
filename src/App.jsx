import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BreakingTicker from './components/BreakingTicker';
import WebStories from './components/WebStories';
import HeroMixedSection from './components/HeroMixedSection';
import CategorySection from './components/CategorySection';
import ArticleCard from './components/ArticleCard';
import ArticleModal from './components/ArticleModal';
import QuickReadModal from './components/QuickReadModal';
import SubmitNewsModal from './components/SubmitNewsModal';
import BookmarksModal from './components/BookmarksModal';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import AdminPanel from './pages/AdminPanel';

import { StorageService } from './services/storage';
import { fetchAllLiveCategories } from './services/newsApi';
import { ttsService } from './services/ttsService';
import { CATEGORIES, AGENCY_INFO } from './data/categories';
import { Share2, PhoneCall, Sparkles, Filter, RefreshCw, Send } from 'lucide-react';

export default function App() {
  // Navigation Route: 'home' | 'admin' (/admin-panel)
  const isInitialAdmin = typeof window !== 'undefined' && 
    (window.location.pathname.includes('admin') || window.location.hash.includes('admin'));
  const [currentRoute, setCurrentRoute] = useState(isInitialAdmin ? 'admin' : 'home');

  // Helper to determine initial category from URL (?category=beawar)
  const getInitialCategory = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category');
      if (cat && (cat === 'all' || CATEGORIES.some(c => c.id === cat))) {
        return cat;
      }
    }
    return 'all';
  };

  // 1. Core States
  const [articles, setArticles] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory);
  const [lang, setLang] = useState('hi');
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLiveNews, setIsLoadingLiveNews] = useState(true);
  const [newsError, setNewsError] = useState(false);
  const [liveUpdateToast, setLiveUpdateToast] = useState(false);
  const lastFetchTimeRef = useRef(0);
  const hasCheckedUrlArticleRef = useRef(false);

  // 2. Modals States
  const [activeArticle, setActiveArticle] = useState(null);
  const [isQuickReadOpen, setIsQuickReadOpen] = useState(false);
  const [isSubmitNewsOpen, setIsSubmitNewsOpen] = useState(false);
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);

  // 3. Audio TTS State
  const [currentTTSState, setCurrentTTSState] = useState({ isPlaying: false, articleId: null });

  // 4. Load Database Data (Custom Articles, Breaking News)
  const loadDatabaseData = async () => {
    try {
      const [customArticles, bn] = await Promise.all([
        StorageService.fetchCustomArticles(),
        StorageService.fetchBreakingNews()
      ]);

      if (customArticles && customArticles.length > 0) {
        setArticles(prev => {
          const liveOnly = prev.filter(p => p.isLiveFeed);
          return [...customArticles, ...liveOnly];
        });
      }

      if (bn && bn.length > 0) {
        setBreakingNews(bn);
      }
    } catch (err) {
      console.warn('Database data fetch notice:', err);
    }
  };

  // Handle Category Selection with URL Update
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      if (catId && catId !== 'all') {
        url.searchParams.set('category', catId);
      } else {
        url.searchParams.delete('category');
      }
      window.history.pushState({}, '', url.pathname + url.search + url.hash);
    }
  };

  // Handle Article Open with URL Update & View Counter
  const handleOpenArticle = (article) => {
    if (!article) return;
    setActiveArticle(article);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.set('article', article.id);
      window.history.pushState({}, '', url.pathname + url.search + url.hash);
    }
    // Increment view counter
    StorageService.incrementArticleViews(article.id);
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a));
  };

  // Handle Article Close and URL cleanup
  const handleCloseArticle = () => {
    setActiveArticle(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.delete('article');
      window.history.pushState({}, '', url.pathname + url.search + url.hash);
    }
  };

  // 5. Initial Load
  useEffect(() => {
    // Load local storage preferences (strictly for user preferences: bookmarks, lang, theme)
    const initialBookmarks = StorageService.getBookmarks();
    const initialLang = StorageService.getLang();
    const initialTheme = StorageService.getTheme();

    setBookmarks(initialBookmarks);
    setLang(initialLang);
    setTheme(initialTheme);

    // Apply dark mode class
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Subscribe to TTS changes
    const unsubscribeTTS = ttsService.subscribe(setCurrentTTSState);

    // Listen to URL route changes (Back / Forward navigation)
    const handlePopState = () => {
      const isAdmin = window.location.pathname.includes('admin') || window.location.hash.includes('admin');
      setCurrentRoute(isAdmin ? 'admin' : 'home');

      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category');
      setSelectedCategory(cat && (cat === 'all' || CATEGORIES.some(c => c.id === cat)) ? cat : 'all');

      const articleId = urlParams.get('article');
      if (articleId) {
        setArticles(currentArticles => {
          const found = currentArticles.find(a => a.id === articleId);
          if (found) {
            setActiveArticle(found);
          } else {
            StorageService.fetchArticleById(articleId).then(art => {
              if (art) setActiveArticle(art);
            });
          }
          return currentArticles;
        });
      } else {
        setActiveArticle(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Fetch live news feeds and database data immediately
    loadLiveFeeds(false);
    loadDatabaseData();

    // Auto-refresh feeds every 10 minutes (600,000 ms) without spamming rate limits
    const autoRefreshTimer = setInterval(() => {
      loadLiveFeeds(false);
      loadDatabaseData();
    }, 600000);

    // Tab visibility change: when user switches back to this tab, fetch latest news if > 10 min
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSince = Date.now() - (lastFetchTimeRef.current || 0);
        if (timeSince > 600000) {
          loadLiveFeeds(true);
          loadDatabaseData();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribeTTS();
      ttsService.stop();
      clearInterval(autoRefreshTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Check URL for article deep-link on load or when articles populate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article');
    if (articleId && !hasCheckedUrlArticleRef.current) {
      const match = articles.find(a => a.id === articleId);
      if (match) {
        hasCheckedUrlArticleRef.current = true;
        handleOpenArticle(match);
      } else if (articles.length > 0) {
        hasCheckedUrlArticleRef.current = true;
        StorageService.fetchArticleById(articleId).then(art => {
          if (art) {
            handleOpenArticle(art);
          }
        });
      }
    }
  }, [articles]);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin-panel');
    setCurrentRoute('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch real-time live feeds
  const loadLiveFeeds = async (showToast = false) => {
    setIsLoadingLiveNews(true);
    setNewsError(false);
    lastFetchTimeRef.current = Date.now();
    try {
      const liveItems = await fetchAllLiveCategories();
      const customArticles = await StorageService.fetchCustomArticles();
      const combined = [...(customArticles || []), ...(liveItems || [])];

      if (liveItems && liveItems.length > 0) {
        // Update breaking news ticker with top live headlines
        const topHeadlines = liveItems
          .filter(item => item.titleHi && item.titleHi.length > 15)
          .slice(0, 8)
          .map(item => item.titleHi);
        
        if (topHeadlines.length > 0) {
          setBreakingNews(topHeadlines);
        }
      }

      if (combined.length > 0) {
        setArticles(combined);
        setNewsError(false);
      } else {
        setNewsError(true);
      }

      if (showToast && liveItems && liveItems.length > 0) {
        setLiveUpdateToast(true);
        setTimeout(() => setLiveUpdateToast(false), 3500);
      }
    } catch (e) {
      console.warn('Live news fetch notice:', e);
      setNewsError(true);
    } finally {
      setIsLoadingLiveNews(false);
    }
  };

  // Theme Toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    StorageService.setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Lang Toggle
  const handleToggleLang = () => {
    const nextLang = lang === 'hi' ? 'en' : 'hi';
    setLang(nextLang);
    StorageService.setLang(nextLang);
  };

  // TTS Trigger
  const handlePlayTTS = (article) => {
    const textToRead = `${lang === 'hi' ? article.titleHi : article.titleEn}. ${lang === 'hi' ? (article.summaryHi || article.contentHi) : (article.summaryEn || article.contentEn)}`;
    ttsService.speak(textToRead, article.id, lang);
  };

  // Bookmark Toggle
  const handleToggleBookmark = (articleId) => {
    const updated = StorageService.toggleBookmark(articleId);
    setBookmarks(updated);
  };

  // Admin Actions with Supabase Persistence
  const handleAddArticle = async (newArt) => {
    try {
      await StorageService.saveArticle(newArt);
      const customArticles = await StorageService.fetchCustomArticles();
      setArticles(prev => [...customArticles, ...prev.filter(p => p.isLiveFeed)]);
    } catch (e) {
      console.error('[App] handleAddArticle error:', e);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await StorageService.deleteArticle(articleId);
      const customArticles = await StorageService.fetchCustomArticles();
      setArticles(prev => [...customArticles, ...prev.filter(p => p.isLiveFeed)]);
    } catch (e) {
      console.error('[App] handleDeleteArticle error:', e);
    }
  };

  const handleUpdateBreakingNews = async (newList) => {
    try {
      await StorageService.saveBreakingNews(newList);
      const bn = await StorageService.fetchBreakingNews();
      setBreakingNews(bn || []);
    } catch (e) {
      console.error('[App] handleUpdateBreakingNews error:', e);
    }
  };

  // Filtered Articles based on search or category
  const filteredArticles = articles.filter(art => {
    const matchesSearch = searchQuery.trim() === '' || 
      (art.titleHi && art.titleHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.titleEn && art.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.summaryHi && art.summaryHi.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const bookmarkedArticles = articles.filter(art => bookmarks.includes(art.id));

  // If user navigated to /admin-panel, render dedicated Admin Panel
  if (currentRoute === 'admin') {
    return (
      <AdminPanel
        onNavigateHome={navigateToHome}
        onNewsUpdated={() => {
          loadDatabaseData();
          loadLiveFeeds();
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 w-full max-w-full overflow-x-hidden`}>
      
      {/* 1. MAIN NAVIGATION */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSubmitNews={() => setIsSubmitNewsOpen(true)}
        onOpenBookmarks={() => setIsBookmarksModalOpen(true)}
        bookmarksCount={bookmarks.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoadingLiveNews={isLoadingLiveNews}
        onRefreshLiveNews={() => loadLiveFeeds(true)}
        liveCount={articles.filter(a => a.isLiveFeed).length}
      />

      {/* Floating Live Update Notification Toast */}
      {liveUpdateToast && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-red-500/50 flex items-center gap-2 backdrop-blur-md animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>🔴 ताज़ा लाइव समाचार सफलतापूर्वक अपडेट हो चुके हैं!</span>
        </div>
      )}

      {/* 2. BREAKING NEWS LIVE FLASH TICKER */}
      <BreakingTicker
        items={breakingNews}
        onSelectHeadline={(headline) => {
          const match = articles.find(a => a.titleHi.includes(headline.slice(0, 15)));
          if (match) handleOpenArticle(match);
        }}
      />

      {/* 3. WEB STORIES REEL (Mobile-first engaging visual carousel featuring Beawar local news) */}
      <WebStories articles={articles} onOpenArticle={handleOpenArticle} />

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-12 overflow-x-hidden">
        
        {/* If user is searching or has selected a specific category */}
        {searchQuery.trim() !== '' ? (
          <div className="px-3 sm:px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-hindi">
                '{searchQuery}' के लिए खोज परिणाम ({filteredArticles.length})
              </h2>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                खोज साफ़ करें
              </button>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="text-base font-semibold font-hindi text-gray-500">
                  कोई खबर नहीं मिली। कृपया कोई अन्य शब्द खोजें।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map(art => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    lang={lang}
                    layout="standard"
                    onOpenArticle={handleOpenArticle}
                    onPlayTTS={handlePlayTTS}
                    isPlayingAudio={currentTTSState.isPlaying && currentTTSState.articleId === art.id}
                    isBookmarked={bookmarks.includes(art.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        ) : selectedCategory !== 'all' ? (
          /* SPECIFIC CATEGORY VIEW */
          <div className="px-3 sm:px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-red-600 text-white font-bold">
                  📰
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-hindi">
                    {lang === 'hi' 
                      ? CATEGORIES.find(c => c.id === selectedCategory)?.nameHi 
                      : CATEGORIES.find(c => c.id === selectedCategory)?.nameEn}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {filteredArticles.length} ताज़ा रिपोर्ट्स एवं अपडेट्स
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSelectCategory('all')}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                ← सभी मुख्य खबरें देखें
              </button>
            </div>

            {filteredArticles.length === 0 ? (
              selectedCategory === 'beawar' ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-800/60 rounded-3xl p-6 sm:p-8 text-center shadow-sm my-6">
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
              ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 my-6">
                  <p className="text-base font-semibold font-hindi text-gray-500">
                    इस श्रेणी में फिलहाल कोई खबर उपलब्ध नहीं है।
                  </p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredArticles.map(art => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    lang={lang}
                    layout="standard"
                    onOpenArticle={handleOpenArticle}
                    onPlayTTS={handlePlayTTS}
                    isPlayingAudio={currentTTSState.isPlaying && currentTTSState.articleId === art.id}
                    isBookmarked={bookmarks.includes(art.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        ) : isLoadingLiveNews && articles.length === 0 ? (
          /* SKELETON / LOADING STATE */
          <div className="px-3 sm:px-6 py-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200 font-hindi animate-pulse">
                खबरें लोड हो रही हैं…
              </p>
              <p className="text-xs text-gray-500 mt-1">
                विश्वसनीय एवं नवीनतम समाचार संकलित किए जा रहे हैं
              </p>
            </div>
            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
                  <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : newsError && articles.length === 0 ? (
          /* ERROR STATE */
          <div className="px-3 sm:px-6 py-16 max-w-xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚠️
              </div>
              <h3 className="text-lg sm:text-xl font-black font-hindi text-gray-900 dark:text-gray-100 mb-2">
                खबरें अभी उपलब्ध नहीं हैं, कृपया थोड़ी देर बाद देखें
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-hindi mb-6 leading-relaxed">
                सर्वर अथवा नेटवर्क से संपर्क स्थापित नहीं हो सका। कृपया अपना इंटरनेट कनेक्शन जांचें अथवा पुनः प्रयास करें।
              </p>
              <button
                onClick={() => loadLiveFeeds(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition"
              >
                <RefreshCw className="w-4 h-4" />
                पुनः प्रयास करें
              </button>
            </div>
          </div>
        ) : (
          /* DEFAULT HOMEPAGE: "FIRST MIX CATEGORY THEN DIFFERENT CATEGORY" */
          <>
            {/* 1. FIRST MIX CATEGORY (Hero Spotlight + Trending Mixed Grid) */}
            <HeroMixedSection
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onSelectCategory={handleSelectCategory}
            />

            {/* 2. SPONSORED BANNER (Beawar Tilpatti & Local Business Advertisement) */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 my-4">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-2xl p-3 sm:p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <span className="text-3xl">🪔</span>
                  <div>
                    <span className="bg-white/20 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                      प्रायोजित विज्ञापन
                    </span>
                    <h4 className="text-sm sm:text-base font-black font-hindi mt-0.5">
                      ब्यावर की विश्वप्रसिद्ध कूटवां तिलपत्ती एवं गजक - सीधे निर्माता से प्राप्त करें
                    </h4>
                    <p className="text-xs text-amber-100">
                      आर्यन न्यूज़ एजेंसी विज्ञापन सेवा • प्रचार हेतु संपर्क: +91 98290-58949
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('नमस्ते, मुझे आर्यन न्यूज़ पोर्टल पर विज्ञापन देना है।')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 hover:bg-amber-50 font-black text-xs px-4 py-2 rounded-xl shadow transition active:scale-95 shrink-0"
                >
                  विज्ञापन बुक करें
                </a>
              </div>
            </div>

            {/* 3. THEN DIFFERENT CATEGORIES (Modular Segregated Grids) */}
            
            {/* 📍 ब्यावर विशेष (Beawar Local News) */}
            <CategorySection
              categoryId="beawar"
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={handleSelectCategory}
            />

            {/* 🏛️ राजस्थान (Rajasthan State) */}
            <CategorySection
              categoryId="rajasthan"
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={handleSelectCategory}
            />

            {/* 🇮🇳 देश - विदेश (National & World Live) */}
            <CategorySection
              categoryId="national"
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={handleSelectCategory}
            />

            {/* 🏏 खेल जगत (Sports) */}
            <CategorySection
              categoryId="sports"
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={handleSelectCategory}
            />

            {/* 🎬 मनोरंजन (Cinema & Culture) */}
            <CategorySection
              categoryId="entertainment"
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={handleSelectCategory}
            />

            {/* 💼 व्यापार (Business) */}
            <CategorySection
              categoryId="business"
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={handleSelectCategory}
            />

            {/* 🚨 क्राइम व पुलिस (Crime & Police) */}
            <CategorySection
              categoryId="crime"
              articles={articles}
              lang={lang}
              onOpenArticle={handleOpenArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={handleSelectCategory}
            />
          </>
        )}

      </main>

      {/* FOOTER */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenSubmitNews={() => setIsSubmitNewsOpen(true)}
        lang={lang}
      />

      {/* MOBILE STICKY BOTTOM NAVIGATION (For 95% mobile usage) */}
      <MobileBottomNav
        activeTab={selectedCategory}
        onSelectTab={handleSelectCategory}
        onOpenQuickRead={() => setIsQuickReadOpen(true)}
        onOpenMobileMenu={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* MODALS */}
      
      {/* 1. Full Article Reader Modal */}
      <ArticleModal
        article={activeArticle}
        isOpen={!!activeArticle}
        onClose={handleCloseArticle}
        lang={lang}
        onPlayTTS={handlePlayTTS}
        isPlayingAudio={currentTTSState.isPlaying && currentTTSState.articleId === activeArticle?.id}
        isBookmarked={activeArticle ? bookmarks.includes(activeArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        relatedArticles={articles.filter(a => a.id !== activeArticle?.id && (a.category === activeArticle?.category || a.category === 'beawar'))}
        onSelectRelated={handleOpenArticle}
      />

      {/* 2. 60-Word Inshorts Quick Read Modal */}
      <QuickReadModal
        isOpen={isQuickReadOpen}
        onClose={() => setIsQuickReadOpen(false)}
        articles={articles}
        lang={lang}
        onPlayTTS={handlePlayTTS}
        isPlayingAudio={currentTTSState.isPlaying}
        currentTTSId={currentTTSState.articleId}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* 3. Citizen Journalism: Submit News via WhatsApp Modal */}
      <SubmitNewsModal
        isOpen={isSubmitNewsOpen}
        onClose={() => setIsSubmitNewsOpen(false)}
      />

      {/* 4. Saved Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksModalOpen}
        onClose={() => setIsBookmarksModalOpen(false)}
        bookmarkedArticles={bookmarkedArticles}
        lang={lang}
        onOpenArticle={handleOpenArticle}
        onPlayTTS={handlePlayTTS}
        currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
        onToggleBookmark={handleToggleBookmark}
      />

    </div>
  );
}
