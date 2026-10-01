import { INITIAL_ARTICLES, INITIAL_BREAKING_NEWS } from '../data/initialArticles';
import { supabase, isSupabaseConfigured } from './supabase';

const USER_PREF_KEYS = {
  BOOKMARKS: 'arya_news_bookmarks_v4',
  LANG: 'arya_news_lang_v4',
  THEME: 'arya_news_theme_v4'
};

// Helper to embed media metadata cleanly
function embedMediaMeta(content, { gallery, videoUrl, mediaType, mediaCaption, isHidden }) {
  const cleanContent = (content || '').replace(/<!--MEDIA_META:[\s\S]*?-->\n?/g, '').trim();
  const normalizedGallery = Array.isArray(gallery) ? gallery.filter(Boolean) : [];
  
  if (normalizedGallery.length <= 1 && !videoUrl && (!mediaType || mediaType === 'image') && !mediaCaption && typeof isHidden === 'undefined') {
    return cleanContent;
  }

  const meta = {
    gallery: normalizedGallery,
    videoUrl: videoUrl || null,
    mediaType: mediaType || (videoUrl ? 'video' : (normalizedGallery.length > 1 ? 'gallery' : 'image')),
    mediaCaption: mediaCaption || 'फोटो / वीडियो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)',
    isHidden: isHidden === true
  };

  return `<!--MEDIA_META:${JSON.stringify(meta)}-->\n${cleanContent}`;
}

// Helper to extract media metadata from content or record
function extractMediaMeta(rawContent, item = {}) {
  let content = rawContent || '';
  let gallery = item.gallery || [];
  let videoUrl = item.video_url || item.videoUrl || null;
  let mediaType = item.media_type || item.mediaType || 'image';
  let mediaCaption = item.mediaCaption || 'फोटो / वीडियो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)';
  let isHidden = item.isHidden === true;

  const metaMatch = content.match(/<!--MEDIA_META:([\s\S]*?)-->/);
  if (metaMatch) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      if (Array.isArray(parsed.gallery) && parsed.gallery.length > 0) {
        gallery = parsed.gallery;
      }
      if (parsed.videoUrl) {
        videoUrl = parsed.videoUrl;
      }
      if (parsed.mediaType) {
        mediaType = parsed.mediaType;
      }
      if (typeof parsed.isHidden === 'boolean') {
        isHidden = parsed.isHidden;
      }
      if (parsed.mediaCaption) {
        mediaCaption = parsed.mediaCaption;
      }
      content = content.replace(/<!--MEDIA_META:[\s\S]*?-->\n?/, '').trim();
    } catch (e) {
      console.warn('[StorageService] Failed to parse MEDIA_META:', e);
    }
  }

  // Ensure gallery has at least the primary image if gallery is empty
  if ((!gallery || gallery.length === 0) && item.image) {
    gallery = [item.image];
  }

  if (videoUrl && (!mediaType || mediaType === 'image')) {
    mediaType = 'video';
  } else if (gallery.length > 1 && (!mediaType || mediaType === 'image')) {
    mediaType = 'gallery';
  }

  return { content, gallery, videoUrl, mediaType, mediaCaption, isHidden };
}

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
        .neq('category', '_system')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('[StorageService] Error fetching articles from Supabase:', error.message);
        return [];
      }

      if (!data) return [];

      return data.map(item => {
        const { content: cleanContentHi, gallery, videoUrl, mediaType, mediaCaption, isHidden } = extractMediaMeta(item.content_hi, item);
        const { content: cleanContentEn } = extractMediaMeta(item.content_en || item.content_hi, item);

        return {
          id: item.id,
          titleHi: item.title_hi,
          titleEn: item.title_en || item.title_hi,
          summaryHi: item.summary_hi,
          summaryEn: item.summary_en || item.summary_hi,
          contentHi: cleanContentHi,
          contentEn: cleanContentEn || cleanContentHi,
          category: item.category || 'beawar',
          image: item.image,
          gallery: gallery && gallery.length > 0 ? gallery : (item.image ? [item.image] : []),
          videoUrl: videoUrl,
          mediaType: mediaType,
          mediaCaption: mediaCaption, isHidden: isHidden,
          publishedAt: item.published_at,
          author: item.author || 'आर्यन ब्यूरो, ब्यावर',
          isHero: Boolean(item.is_hero),
          isTrending: Boolean(item.is_trending),
          isBreaking: Boolean(item.is_breaking),
          readTime: item.read_time || '2 मिनट',
          views: item.views || 0,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });
    } catch (err) {
      console.error('[StorageService] fetchCustomArticles error:', err.message);
      return [];
    }
  },

  async fetchArticleById(id) {
    if (!isSupabaseConfigured || !supabase || !id) return null;
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data || data.category === '_system') return null;

      const { content: cleanContentHi, gallery, videoUrl, mediaType, mediaCaption, isHidden } = extractMediaMeta(data.content_hi, data);
      const { content: cleanContentEn } = extractMediaMeta(data.content_en || data.content_hi, data);

      return {
        id: data.id,
        titleHi: data.title_hi,
        titleEn: data.title_en || data.title_hi,
        summaryHi: data.summary_hi,
        summaryEn: data.summary_en || data.summary_hi,
        contentHi: cleanContentHi,
        contentEn: cleanContentEn || cleanContentHi,
        category: data.category || 'beawar',
        image: data.image,
        gallery: gallery && gallery.length > 0 ? gallery : (data.image ? [data.image] : []),
        videoUrl: videoUrl,
        mediaType: mediaType,
        mediaCaption: mediaCaption, isHidden: isHidden,
        publishedAt: data.published_at,
        author: data.author || 'आर्यन ब्यूरो, ब्यावर',
        isHero: Boolean(data.is_hero),
        isTrending: Boolean(data.is_trending),
        isBreaking: Boolean(data.is_breaking),
        readTime: data.read_time || '2 मिनट',
        views: data.views || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (e) {
      console.warn('[StorageService] fetchArticleById notice:', e.message);
      return null;
    }
  },

  async incrementArticleViews(id) {
    if (!isSupabaseConfigured || !supabase || !id) return;
    try {
      // 1. Try PostgreSQL RPC increment
      const { error: rpcError } = await supabase.rpc('increment_article_views', { article_id: id });
      if (!rpcError) return;

      // 2. Direct update fallback
      const { data: current } = await supabase
        .from('articles')
        .select('views')
        .eq('id', id)
        .maybeSingle();

      const newViews = ((current?.views) || 0) + 1;
      await supabase
        .from('articles')
        .update({ views: newViews })
        .eq('id', id);
    } catch (e) {
      console.warn('[StorageService] incrementArticleViews notice:', e.message);
    }
  },

  async saveArticle(article) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase credentials not configured in environment variables.');
    }

    const gallery = Array.isArray(article.gallery) ? article.gallery.filter(Boolean) : (article.image ? [article.image] : []);
    const primaryImage = gallery[0] || article.image || null;
    const videoUrl = article.videoUrl || null;
    const mediaType = article.mediaType || (videoUrl ? 'video' : (gallery.length > 1 ? 'gallery' : 'image'));
    const isHidden = article.isHidden === true;

    const mediaCaption = article.mediaCaption || 'फोटो / वीडियो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)';

    // Embed rich media metadata into content_hi for 100% bulletproof storage
    const contentHiWithMeta = embedMediaMeta(article.contentHi, {
      gallery,
      videoUrl,
      mediaType,
      mediaCaption,
        isHidden
      });

    const record = {
      id: article.id || `custom-bwr-${Date.now()}`,
      title_hi: article.titleHi,
      title_en: article.titleEn || article.titleHi,
      summary_hi: article.summaryHi,
      summary_en: article.summaryEn || article.summaryHi,
      content_hi: contentHiWithMeta,
      content_en: article.contentEn || article.contentHi,
      category: article.category || 'beawar',
      image: primaryImage,
      published_at: article.publishedAt || new Date().toISOString(),
      author: article.author || 'आर्यन ब्यूरो, ब्यावर',
      is_hero: Boolean(article.isHero),
      is_trending: Boolean(article.isTrending),
      is_breaking: Boolean(article.isBreaking),
      read_time: article.readTime || '2 मिनट',
      views: article.views || 0,
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

  // Upload single media file (Image or Video) to Cloudinary
  async uploadArticleMedia(file) {
    if (!file) throw new Error('No file provided');

    // Security: Strict validation before sending to Cloudinary
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('à¤«à¤¼à¤¾à¤‡à¤² à¤¬à¤¹à¥ à¤¤ à¤¬à¤¡à¤¼à¥€ à¤¹à¥ˆ! à¤…à¤§à¤¿à¤•à¤¤à¤® à¤¸à¤¾à¤‡à¤œà¤¼ 50MB à¤¹à¥ˆà¥¤ (File too large. Max 50MB)');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('à¤…à¤®à¤¾à¤¨à¥ à¤¯ à¤«à¤¼à¤¾à¤‡à¤² à¤«à¥‰à¤°à¥ à¤®à¥‡à¤Ÿ! à¤•à¥‡à¤µà¤² JPG, PNG, WEBP, GIF, MP4, WEBM à¤”à¤° MOV à¤®à¤¾à¤¨à¥ à¤¯ à¤¹à¥ˆà¤‚à¥¤');
    }

    const isVideo = file.type && file.type.startsWith('video/');
    
    // Cloudinary Unsigned Upload Configuration
    const cloudName = 'vxlbrcgx';
    const uploadPreset = 'aryan_news';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    const resourceType = isVideo ? 'video' : 'image';
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[StorageService] Cloudinary upload failed:', errText);
        throw new Error('Cloudinary upload failed: ' + errText);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('[StorageService] Network error during Cloudinary upload:', error);
      throw error;
    }
  },

  // Alias for backward compatibility
  async uploadArticleImage(file) {
    return this.uploadArticleMedia(file);
  },

  // Upload multiple media items sequentially/parallelly
  async uploadMultipleMedia(files) {
    if (!files || files.length === 0) return [];
    const uploadPromises = files.map(file => this.uploadArticleMedia(file));
    return Promise.all(uploadPromises);
  },

  // ==========================================
  // 2. LIVE API NEWS KILL SWITCH (Site Settings)
  // ==========================================

  getApiNewsEnabledSync() {
    try {
      const cached = localStorage.getItem('arya_api_news_enabled');
      return cached !== null ? cached !== 'false' : true;
    } catch {
      return true;
    }
  },

  async fetchApiNewsEnabled() {
    let isEnabled = this.getApiNewsEnabledSync();

    if (!isSupabaseConfigured || !supabase) {
      return isEnabled;
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('title_hi')
        .eq('id', 'setting-api-news-status')
        .maybeSingle();

      if (!error && data) {
        isEnabled = data.title_hi !== 'disabled';
        localStorage.setItem('arya_api_news_enabled', isEnabled ? 'true' : 'false');
      }
    } catch (err) {
      console.warn('[StorageService] fetchApiNewsEnabled notice:', err.message);
    }

    return isEnabled;
  },

  async setApiNewsEnabled(enabled) {
    localStorage.setItem('arya_api_news_enabled', enabled ? 'true' : 'false');

    if (!isSupabaseConfigured || !supabase) {
      return enabled;
    }

    try {
      const record = {
        id: 'setting-api-news-status',
        title_hi: enabled ? 'enabled' : 'disabled',
        title_en: enabled ? 'enabled' : 'disabled',
        summary_hi: 'System Setting for Live API News Kill Switch',
        summary_en: 'System Setting for Live API News Kill Switch',
        content_hi: enabled 
          ? 'API News is ON (Active syndicated feeds)' 
          : 'API News is KILLED/DISABLED - Only Beawar news is displayed on website',
        content_en: enabled ? 'API News is ON' : 'API News is KILLED/DISABLED',
        category: '_system',
        image: null,
        published_at: new Date().toISOString(),
        author: 'System Admin',
        is_hero: false,
        is_trending: false,
        is_breaking: false,
        views: 0,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('articles')
        .upsert(record);

      if (error) {
        console.error('[StorageService] Error saving API news kill switch setting:', error.message);
        throw error;
      }
    } catch (err) {
      console.error('[StorageService] setApiNewsEnabled error:', err.message);
      throw err;
    }

    return enabled;
  },

  // ==========================================
  // 3. BREAKING NEWS (Supabase DB)
  // ==========================================

  async fetchBreakingNews() {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('breaking_news')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map(item => item.text);
    } catch (err) {
      console.error('[StorageService] fetchBreakingNews error:', err.message);
      return [];
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





