import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import BreakingTicker from './components/BreakingTicker';
import MandiTicker from './components/MandiTicker';
import WebStories from './components/WebStories';
import HeroMixedSection from './components/HeroMixedSection';
import CategorySection from './components/CategorySection';
import ArticleCard from './components/ArticleCard';
import ArticleModal from './components/ArticleModal';
import QuickReadModal from './components/QuickReadModal';
import MandiModal from './components/MandiModal';
import AdminModal from './components/AdminModal';
import SubmitNewsModal from './components/SubmitNewsModal';
import BookmarksModal from './components/BookmarksModal';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import AdminPanel from './pages/AdminPanel';

import { StorageService } from './services/storage';
import { fetchAllLiveCategories } from './services/newsApi';
import { ttsService } from './services/ttsService';
import { CATEGORIES, AGENCY_INFO } from './data/categories';
import { INITIAL_ARTICLES } from './data/initialArticles';
import { Share2, PhoneCall, Sparkles, Filter, RefreshCw, Send } from 'lucide-react';

export default function App() {
  // Navigation Route: 'home' | 'admin' (/admin-panel)
  const isInitialAdmin = typeof window !== 'undefined' && 
    (window.location.pathname.includes('admin') || window.location.hash.includes('admin'));
  const [currentRoute, setCurrentRoute] = useState(isInitialAdmin ? 'admin' : 'home');

  // 1. Core States
  const [articles, setArticles] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [mandiRates, setMandiRates] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lang, setLang] = useState('hi');
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLiveNews, setIsLoadingLiveNews] = useState(false);
  const [liveUpdateToast, setLiveUpdateToast] = useState(false);
  const lastFetchTimeRef = useRef(0);

  // 2. Modals States
  const [activeArticle, setActiveArticle] = useState(null);
  const [isQuickReadOpen, setIsQuickReadOpen] = useState(false);
  const [isMandiModalOpen, setIsMandiModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSubmitNewsOpen, setIsSubmitNewsOpen] = useState(false);
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);

  // 3. Audio TTS State
  const [currentTTSState, setCurrentTTSState] = useState({ isPlaying: false, articleId: null });

  // 4. Initial Load
  useEffect(() => {
    // Load local storage data
    const initialArticles = StorageService.getArticles();
    const initialBreaking = StorageService.getBreakingNews();
    const initialMandi = StorageService.getMandiRates();
    const initialBookmarks = StorageService.getBookmarks();
    const initialLang = StorageService.getLang();
    const initialTheme = StorageService.getTheme();

    setArticles(initialArticles);
    setBreakingNews(initialBreaking);
    setMandiRates(initialMandi);
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

    // Listen to URL route changes
    const handlePopState = () => {
      const isAdmin = window.location.pathname.includes('admin') || window.location.hash.includes('admin');
      setCurrentRoute(isAdmin ? 'admin' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Fetch live news from RSS feeds immediately on startup
    loadLiveFeeds(false);

    // Periodic auto-refresh every 2 minutes (120,000 ms) to keep live news constantly updating
    const autoRefreshTimer = setInterval(() => {
      loadLiveFeeds(false);
    }, 120000);

    // Tab visibility change: when user switches back to this tab, fetch latest news if > 60s
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSince = Date.now() - (lastFetchTimeRef.current || 0);
        if (timeSince > 60000) {
          loadLiveFeeds(true);
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

  // Fetch real-time live feeds with verified images
  const loadLiveFeeds = async (showToast = false) => {
    setIsLoadingLiveNews(true);
    lastFetchTimeRef.current = Date.now();
    try {
      const liveItems = await fetchAllLiveCategories();
      if (liveItems && liveItems.length > 0) {
        // Cache live items in local storage with 15-minute TTL
        StorageService.saveCachedLiveArticles(liveItems);

        // Update breaking news ticker with top live headlines
        const topHeadlines = liveItems
          .filter(item => item.titleHi && item.titleHi.length > 15)
          .slice(0, 8)
          .map(item => item.titleHi);
        
        if (topHeadlines.length > 0) {
          setBreakingNews(topHeadlines);
        }

        // Custom Beawar articles created by admin remain at the top
        // Followed by genuine, real-time live articles with real photos
        const customArticles = StorageService.getCustomArticles();
        setArticles([...customArticles, ...liveItems]);

        if (showToast) {
          setLiveUpdateToast(true);
          setTimeout(() => setLiveUpdateToast(false), 3500);
        }
      }
    } catch (e) {
      console.warn('Live news fetch notice:', e);
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

  // Admin Actions
  const handleAddArticle = (newArt) => {
    const updated = StorageService.saveArticle(newArt);
    setArticles(updated);
  };

  const handleDeleteArticle = (articleId) => {
    const updated = StorageService.deleteArticle(articleId);
    setArticles(updated);
  };

  const handleUpdateMandiRates = (newRates) => {
    const updated = StorageService.saveMandiRates(newRates);
    setMandiRates(updated);
  };

  const handleUpdateBreakingNews = (newList) => {
    const updated = StorageService.saveBreakingNews(newList);
    setBreakingNews(updated);
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
          loadLiveFeeds();
          const customArticles = StorageService.getCustomArticles();
          setArticles(prev => [...customArticles, ...prev.filter(p => !p.id.startsWith('custom-'))]);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 w-full max-w-full overflow-x-hidden`}>
      
      {/* 1. MAIN NAVIGATION */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAdmin={navigateToAdmin}
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
          if (match) setActiveArticle(match);
        }}
      />

      {/* 3. BEAWAR MANDI BHAV TICKER */}
      <MandiTicker
        rates={mandiRates}
        onOpenFullMandi={() => setIsMandiModalOpen(true)}
      />

      {/* 4. WEB STORIES REEL (Mobile-first engaging visual carousel) */}
      <WebStories />

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
                    onOpenArticle={setActiveArticle}
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
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                ← सभी मुख्य खबरें देखें
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredArticles.map(art => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  lang={lang}
                  layout="standard"
                  onOpenArticle={setActiveArticle}
                  onPlayTTS={handlePlayTTS}
                  isPlayingAudio={currentTTSState.isPlaying && currentTTSState.articleId === art.id}
                  isBookmarked={bookmarks.includes(art.id)}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
          </div>
        ) : (
          /* DEFAULT HOMEPAGE: "FIRST MIX CATEGORY THEN DIFFERENT CATEGORY" */
          <>
            {/* 1. FIRST MIX CATEGORY (Hero Spotlight + Trending Mixed Grid) */}
            <HeroMixedSection
              articles={articles}
              lang={lang}
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onSelectCategory={setSelectedCategory}
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
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={setSelectedCategory}
            />

            {/* 🏛️ राजस्थान (Rajasthan State) */}
            <CategorySection
              categoryId="rajasthan"
              articles={articles}
              lang={lang}
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={setSelectedCategory}
            />

            {/* 🇮🇳 देश - विदेश (National & World Live) */}
            <CategorySection
              categoryId="national"
              articles={articles}
              lang={lang}
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={setSelectedCategory}
            />

            {/* 🏏 खेल जगत (Sports) */}
            <CategorySection
              categoryId="sports"
              articles={articles}
              lang={lang}
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={setSelectedCategory}
            />

            {/* 🎬 मनोरंजन (Cinema & Culture) */}
            <CategorySection
              categoryId="entertainment"
              articles={articles}
              lang={lang}
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={setSelectedCategory}
            />

            {/* 💼 व्यापार (Business) */}
            <CategorySection
              categoryId="business"
              articles={articles}
              lang={lang}
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={setSelectedCategory}
            />

            {/* 🚨 क्राइम व पुलिस (Crime & Police) */}
            <CategorySection
              categoryId="crime"
              articles={articles}
              lang={lang}
              onOpenArticle={setActiveArticle}
              onPlayTTS={handlePlayTTS}
              currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onViewMoreCategory={setSelectedCategory}
            />
          </>
        )}

      </main>

      {/* FOOTER */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenAdmin={navigateToAdmin}
        onOpenSubmitNews={() => setIsSubmitNewsOpen(true)}
        lang={lang}
      />

      {/* MOBILE STICKY BOTTOM NAVIGATION (For 95% mobile usage) */}
      <MobileBottomNav
        activeTab={selectedCategory}
        onSelectTab={setSelectedCategory}
        onOpenQuickRead={() => setIsQuickReadOpen(true)}
        onOpenMandi={() => setIsMandiModalOpen(true)}
        onOpenMobileMenu={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* MODALS */}
      
      {/* 1. Full Article Reader Modal */}
      <ArticleModal
        article={activeArticle}
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        lang={lang}
        onPlayTTS={handlePlayTTS}
        isPlayingAudio={currentTTSState.isPlaying && currentTTSState.articleId === activeArticle?.id}
        isBookmarked={activeArticle ? bookmarks.includes(activeArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        relatedArticles={articles.filter(a => a.id !== activeArticle?.id && (a.category === activeArticle?.category || a.category === 'beawar'))}
        onSelectRelated={setActiveArticle}
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

      {/* 3. Beawar Mandi Bhav Rates Modal */}
      <MandiModal
        isOpen={isMandiModalOpen}
        onClose={() => setIsMandiModalOpen(false)}
        rates={mandiRates}
      />

      {/* 4. Uncle's Editorial Admin CMS Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAddArticle={handleAddArticle}
        onDeleteArticle={handleDeleteArticle}
        articles={articles}
        mandiRates={mandiRates}
        onUpdateMandiRates={handleUpdateMandiRates}
        breakingNews={breakingNews}
        onUpdateBreakingNews={handleUpdateBreakingNews}
      />

      {/* 5. Citizen Journalism: Submit News via WhatsApp Modal */}
      <SubmitNewsModal
        isOpen={isSubmitNewsOpen}
        onClose={() => setIsSubmitNewsOpen(false)}
      />

      {/* 6. Saved Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksModalOpen}
        onClose={() => setIsBookmarksModalOpen(false)}
        bookmarkedArticles={bookmarkedArticles}
        lang={lang}
        onOpenArticle={setActiveArticle}
        onPlayTTS={handlePlayTTS}
        currentTTSId={currentTTSState.isPlaying ? currentTTSState.articleId : null}
        onToggleBookmark={handleToggleBookmark}
      />

    </div>
  );
}
