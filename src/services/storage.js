import { INITIAL_ARTICLES, INITIAL_BREAKING_NEWS } from '../data/initialArticles';
import { INITIAL_MANDI_RATES } from '../data/mandiRates';
import { supabase, isSupabaseConfigured } from './supabase';

const USER_PREF_KEYS = {
  BOOKMARKS: 'arya_news_bookmarks_v4',
  LANG: 'arya_news_lang_v4',
  THEME: 'arya_news_theme_v4'
};

export const StorageService = {
  // ==========================================
  // 1. ARTICLES (Supabase DB + Storage)
  // ==========================================

  async fetchCustomArticles() {
    if (!isSupabaseConfigured || !supabase) {
      console.info('[StorageService] Supabase not configured. Using empty Beawar custom list.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('[StorageService] Error fetching articles from Supabase:', error.message);
        return [];
      }

      if (!data) return [];

      return data.map(item => ({
        id: item.id,
        titleHi: item.title_hi,
        titleEn: item.title_en || item.title_hi,
        summaryHi: item.summary_hi,
        summaryEn: item.summary_en || item.summary_hi,
        contentHi: item.content_hi,
        contentEn: item.content_en || item.content_hi,
        category: item.category || 'beawar',
        image: item.image,
        publishedAt: item.published_at,
        author: item.author || 'आर्यन ब्यूरो, ब्यावर',
        isHero: Boolean(item.is_hero),
        isTrending: Boolean(item.is_trending),
        isBreaking: Boolean(item.is_breaking),
        readTime: item.read_time || '2 मिनट',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (err) {
      console.error('[StorageService] fetchCustomArticles error:', err.message);
      return [];
    }
  },

  async saveArticle(article) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase credentials not configured in environment variables.');
    }

    const record = {
      id: article.id || `custom-bwr-${Date.now()}`,
      title_hi: article.titleHi,
      title_en: article.titleEn || article.titleHi,
      summary_hi: article.summaryHi,
      summary_en: article.summaryEn || article.summaryHi,
      content_hi: article.contentHi,
      content_en: article.contentEn || article.contentHi,
      category: article.category || 'beawar',
      image: article.image || null,
      published_at: article.publishedAt || new Date().toISOString(),
      author: article.author || 'आर्यन ब्यूरो, ब्यावर',
      is_hero: Boolean(article.isHero),
      is_trending: Boolean(article.isTrending),
      is_breaking: Boolean(article.isBreaking),
      read_time: article.readTime || '2 मिनट',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('articles')
      .upsert(record)
      .select();

    if (error) {
      console.error('[StorageService] Error saving article to Supabase:', error.message);
      throw error;
    }

    return data;
  },

  async deleteArticle(id) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase credentials not configured in environment variables.');
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[StorageService] Error deleting article from Supabase:', error.message);
      throw error;
    }

    return true;
  },

  async uploadArticleImage(file) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Storage not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('[StorageService] Supabase image upload failed:', uploadError.message);
      throw uploadError;
    }

    const { data } = supabase.storage.from('news-images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  // ==========================================
  // 2. MANDI RATES (Supabase DB)
  // ==========================================

  async fetchMandiRates() {
    if (!isSupabaseConfigured || !supabase) {
      return {
        rates: INITIAL_MANDI_RATES,
        lastUpdatedAt: null
      };
    }

    try {
      const { data, error } = await supabase
        .from('mandi_rates')
        .select('*')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) {
        return {
          rates: INITIAL_MANDI_RATES,
          lastUpdatedAt: null
        };
      }

      const rates = data.map(r => ({
        id: r.id,
        cropHi: r.crop_hi,
        cropEn: r.crop_en,
        minPrice: r.min_price,
        maxPrice: r.max_price,
        unit: r.unit || '₹/क्विंटल',
        trend: r.trend || 'stable',
        change: r.change || 'स्थिर',
        updatedAt: r.updated_at
      }));

      const latestTimestamp = data.reduce((latest, r) => {
        if (!r.updated_at) return latest;
        const time = new Date(r.updated_at).getTime();
        return time > latest ? time : latest;
      }, 0);

      return {
        rates,
        lastUpdatedAt: latestTimestamp ? new Date(latestTimestamp).toISOString() : null
      };
    } catch (err) {
      console.error('[StorageService] fetchMandiRates error:', err.message);
      return {
        rates: INITIAL_MANDI_RATES,
        lastUpdatedAt: null
      };
    }
  },

  async saveMandiRates(rates) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase credentials not configured.');
    }

    const nowIso = new Date().toISOString();
    const records = rates.map(r => ({
      id: r.id,
      crop_hi: r.cropHi,
      crop_en: r.cropEn || r.cropHi,
      min_price: Number(r.minPrice),
      max_price: Number(r.maxPrice),
      unit: r.unit || '₹/क्विंटल',
      trend: r.trend || 'stable',
      change: r.change || 'स्थिर',
      updated_at: nowIso
    }));

    const { error } = await supabase
      .from('mandi_rates')
      .upsert(records);

    if (error) {
      console.error('[StorageService] saveMandiRates error:', error.message);
      throw error;
    }

    return nowIso;
  },

  // ==========================================
  // 3. BREAKING NEWS (Supabase DB)
  // ==========================================

  async fetchBreakingNews() {
    if (!isSupabaseConfigured || !supabase) {
      return INITIAL_BREAKING_NEWS;
    }

    try {
      const { data, error } = await supabase
        .from('breaking_news')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !data || data.length === 0) {
        return INITIAL_BREAKING_NEWS;
      }

      return data.map(item => item.text);
    } catch (err) {
      console.error('[StorageService] fetchBreakingNews error:', err.message);
      return INITIAL_BREAKING_NEWS;
    }
  },

  async saveBreakingNews(headlines) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase credentials not configured.');
    }

    // Clean delete all previous ticker items
    const { error: delError } = await supabase
      .from('breaking_news')
      .delete()
      .neq('id', '___dummy_placeholder___');

    if (delError) {
      console.warn('[StorageService] Error cleaning old breaking news:', delError.message);
    }

    const records = headlines.map((text, idx) => ({
      id: `bn-${idx}-${Date.now()}`,
      text,
      order_index: idx,
      updated_at: new Date().toISOString()
    }));

    const { error: insError } = await supabase
      .from('breaking_news')
      .insert(records);

    if (insError) {
      console.error('[StorageService] saveBreakingNews insert error:', insError.message);
      throw insError;
    }

    return headlines;
  },

  // ==========================================
  // 4. USER LOCAL PREFERENCES (Kept strictly in localStorage)
  // ==========================================

  getBookmarks() {
    try {
      const stored = localStorage.getItem(USER_PREF_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
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
    localStorage.setItem(USER_PREF_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  },

  getLang() {
    return localStorage.getItem(USER_PREF_KEYS.LANG) || 'hi';
  },

  setLang(lang) {
    localStorage.setItem(USER_PREF_KEYS.LANG, lang);
  },

  getTheme() {
    return localStorage.getItem(USER_PREF_KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(USER_PREF_KEYS.THEME, theme);
  }
};
