import { INITIAL_ARTICLES, INITIAL_BREAKING_NEWS } from '../data/initialArticles';
import { INITIAL_MANDI_RATES } from '../data/mandiRates';

const STORAGE_KEYS = {
  ARTICLES: 'arya_news_articles_v3',
  CUSTOM_ARTICLES: 'arya_news_custom_articles_v3',
  CACHED_LIVE: 'arya_news_cached_live_v3',
  BREAKING: 'arya_news_breaking_v3',
  MANDI: 'arya_news_mandi_v3',
  BOOKMARKS: 'arya_news_bookmarks_v3',
  LANG: 'arya_news_lang_v3',
  THEME: 'arya_news_theme_v3',
  ADS: 'arya_news_ads_v3'
};

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache TTL

export const StorageService = {
  // Custom articles created by Uncle / Admin
  getCustomArticles() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_ARTICLES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveCustomArticle(newArticle) {
    const list = this.getCustomArticles();
    const updated = [newArticle, ...list];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ARTICLES, JSON.stringify(updated));
    return updated;
  },

  deleteCustomArticle(id) {
    const list = this.getCustomArticles().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ARTICLES, JSON.stringify(list));
    return list;
  },

  // Cached Live Articles with TTL (Auto-expires stale news)
  getCachedLiveArticles() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CACHED_LIVE);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (parsed && parsed.timestamp && Array.isArray(parsed.items)) {
        const ageMs = Date.now() - parsed.timestamp;
        if (ageMs > CACHE_TTL_MS) {
          // Cache expired, remove to trigger fresh live fetch
          localStorage.removeItem(STORAGE_KEYS.CACHED_LIVE);
          return [];
        }
        return parsed.items;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveCachedLiveArticles(articles) {
    try {
      const payload = {
        timestamp: Date.now(),
        items: articles.slice(0, 100)
      };
      localStorage.setItem(STORAGE_KEYS.CACHED_LIVE, JSON.stringify(payload));
    } catch (e) {
      console.warn('Storage limit reached for cached live news');
    }
  },

  // Combined Initial Articles (Custom Beawar at top, then live news)
  getArticles() {
    const custom = this.getCustomArticles();
    const cachedLive = this.getCachedLiveArticles();
    
    if (cachedLive.length > 0) {
      return [...custom, ...cachedLive];
    }
    return [...custom, ...INITIAL_ARTICLES];
  },

  saveArticle(newArticle) {
    return this.saveCustomArticle(newArticle);
  },

  deleteArticle(id) {
    return this.deleteCustomArticle(id);
  },

  // Breaking ticker
  getBreakingNews() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BREAKING);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BREAKING_NEWS;
  },

  saveBreakingNews(list) {
    localStorage.setItem(STORAGE_KEYS.BREAKING, JSON.stringify(list));
    return list;
  },

  // Mandi Rates
  getMandiRates() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MANDI);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MANDI_RATES;
  },

  saveMandiRates(rates) {
    localStorage.setItem(STORAGE_KEYS.MANDI, JSON.stringify(rates));
    return rates;
  },

  // Bookmarks
  getBookmarks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  toggleBookmark(articleId) {
    const bookmarks = this.getBookmarks();
    let updated;
    if (bookmarks.includes(articleId)) {
      updated = bookmarks.filter(id => id !== articleId);
    } else {
      updated = [...bookmarks, articleId];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  },

  // Language
  getLang() {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'hi';
  },

  setLang(lang) {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  },

  // Theme
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};
