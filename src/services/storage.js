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
        .order('published_at', { ascending: false });

      if (error) {
        console.error('[StorageService] Error fetching articles from Supabase:', error.message);
        return [];
      }

      if (!data) return [];

      // Exclude system settings, advertisements, and internal objects from news articles
      const filteredData = data.filter(item => 
        item.category && 
        !item.category.startsWith('_') && 
        item.category !== '_system' && 
        item.category !== '_advertisement'
      );

      return filteredData.map(item => {
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

      if (error || !data || data.category === '_system' || data.category === '_advertisement' || data.category?.startsWith('_')) return null;

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

  // Upload single media file (Image or Video) to Cloudinary via secure server signature
  async uploadArticleMedia(file) {
    if (!file) throw new Error('No file provided');

    // Security: Strict validation before sending to Cloudinary
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('फ़ाइल बहुत बड़ी है! अधिकतम साइज़ 50MB है। (File too large. Max 50MB)');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('अमान्य फ़ाइल फॉर्मेट! केवल JPG, PNG, WEBP, GIF, MP4, WEBM और MOV मान्य हैं।');
    }

    const isVideo = file.type && file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    // 1. Request signed upload signature from Vercel serverless function
    let signData = null;
    try {
      let token = null;
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      }

      if (token) {
        const sigRes = await fetch('/api/upload-signature', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (sigRes.ok) {
          signData = await sigRes.json();
        }
      }
    } catch (sigErr) {
      console.warn('[StorageService] Signed signature request fallback notice:', sigErr.message);
    }

    const formData = new FormData();
    formData.append('file', file);

    let endpoint = '';
    if (signData && signData.signature) {
      // Secure Signed Upload
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder || 'arya_news');
      endpoint = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;
    } else {
      // Fallback unsigned configuration if local dev or signing unavailable
      const cloudName = 'vxlbrcgx';
      formData.append('upload_preset', 'aryan_news');
      endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    }

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

  // ==========================================
  // 3.4 BEAWAR SARRAFA BHAV (Bullion Rates & Kill Switch)
  // ==========================================
  async fetchBullionRates() {
    const DEFAULT_RATES = [
      { id: 'gold_24k', item: '24K सोना (Gold 24K)', unit: '10 ग्राम', price: '78,500' },
      { id: 'gold_22k', item: '22K सोना (Gold 22K)', unit: '10 ग्राम', price: '72,000' },
      { id: 'gold_18k', item: '18K सोना (Gold 18K)', unit: '10 ग्राम', price: '59,000' },
      { id: 'silver_1kg', item: 'चांदी (Silver 999)', unit: '1 किलो', price: '93,000' },
      { id: 'silver_100g', item: 'चांदी टंच (Silver 100g)', unit: '100 ग्राम', price: '9,300' }
    ];

    let isEnabled = localStorage.getItem('arya_bullion_enabled') !== 'false';

    if (!isSupabaseConfigured || !supabase) {
      return { rates: DEFAULT_RATES, lastUpdatedAt: null, enabled: isEnabled };
    }

    try {
      // 1. Check Bullion Kill Switch Status
      const { data: statusData } = await supabase
        .from('articles')
        .select('title_hi')
        .eq('id', 'setting-bullion-status')
        .maybeSingle();

      if (statusData) {
        isEnabled = statusData.title_hi !== 'disabled';
        localStorage.setItem('arya_bullion_enabled', isEnabled ? 'true' : 'false');
      }

      // 2. Fetch Rates
      const { data, error } = await supabase
        .from('bullion_rates')
        .select('*')
        .order('id');

      if (!error && data && data.length > 0) {
        const timestamps = data.map(d => new Date(d.updated_at).getTime()).filter(t => !isNaN(t));
        const latestTime = timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null;
        return { rates: data, lastUpdatedAt: latestTime, enabled: isEnabled };
      }
    } catch (err) {
      console.warn('[StorageService] fetchBullionRates notice:', err.message);
    }

    return { rates: DEFAULT_RATES, lastUpdatedAt: null, enabled: isEnabled };
  },

  async setBullionEnabled(enabled) {
    localStorage.setItem('arya_bullion_enabled', enabled ? 'true' : 'false');
    if (!isSupabaseConfigured || !supabase) return enabled;

    try {
      const record = {
        id: 'setting-bullion-status',
        title_hi: enabled ? 'enabled' : 'disabled',
        title_en: enabled ? 'enabled' : 'disabled',
        summary_hi: 'System Setting for Beawar Bullion Ticker Kill Switch',
        summary_en: 'System Setting for Beawar Bullion Ticker Kill Switch',
        content_hi: enabled ? 'Bullion Ticker is Active' : 'Bullion Ticker is Disabled/Hidden',
        content_en: enabled ? 'Bullion Ticker is Active' : 'Bullion Ticker is Disabled/Hidden',
        category: '_system',
        image: null,
        published_at: new Date().toISOString(),
        author: 'System Admin',
        views: 0,
        updated_at: new Date().toISOString()
      };
      await supabase.from('articles').upsert(record);
    } catch (e) {
      console.warn('[StorageService] setBullionEnabled error:', e.message);
    }
    return enabled;
  },

  async saveBullionRates(ratesArray) {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase credentials not configured.');
    if (!Array.isArray(ratesArray) || ratesArray.length === 0) return;

    const now = new Date().toISOString();
    const rows = ratesArray.map(r => ({
      id: r.id || r.item.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      item: r.item,
      unit: r.unit,
      price: r.price,
      updated_at: now
    }));

    const { error } = await supabase.from('bullion_rates').upsert(rows);
    if (error) throw error;
    return rows;
  },

  // ==========================================
  // 3.5 ADVERTISEMENT ENGINE (Supabase & Cloudinary)
  // ==========================================
  async fetchAdvertisements() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', '_advertisement')
        .order('published_at', { ascending: false });

      if (error || !data) return [];

      return data.map(item => {
        let meta = {};
        try {
          if (item.content_hi && item.content_hi.startsWith('{')) {
            meta = JSON.parse(item.content_hi);
          }
        } catch (e) {}

        const expiresAt = meta.expiresAt || item.read_time || null;
        const isExpired = expiresAt && expiresAt !== 'permanent' && new Date(expiresAt) < new Date();
        const isHidden = item.is_trending === true || meta.isHidden === true;

        const actions = Array.isArray(meta.actions) && meta.actions.length > 0
          ? meta.actions
          : (meta.actionType && meta.actionTarget ? [{ type: meta.actionType, target: meta.actionTarget }] : []);

        const placements = Array.isArray(meta.placements) && meta.placements.length > 0
          ? meta.placements
          : (meta.placement ? (meta.placement === 'all' ? ['banner', 'feed', 'article'] : [meta.placement]) : ['banner', 'feed', 'article']);

        return {
          id: item.id,
          businessName: item.title_hi,
          about: item.summary_hi,
          mediaUrl: item.image || meta.videoUrl || null,
          mediaType: meta.mediaType || (meta.videoUrl ? 'video' : 'image'),
          videoUrl: meta.videoUrl || null,
          actions: actions,
          actionType: actions[0]?.type || meta.actionType || 'whatsapp',
          actionTarget: actions[0]?.target || meta.actionTarget || '',
          placements: placements,
          placement: meta.placement || 'all', // 'banner' | 'feed' | 'article' | 'all'
          duration: item.author || 'permanent',
          expiresAt: expiresAt,
          isExpired: isExpired,
          isHidden: isHidden,
          isActive: !isHidden && !isExpired,
          views: item.views || 0,
          clicks: meta.clicks || 0,
          createdAt: item.published_at
        };
      });
    } catch (err) {
      console.warn('[StorageService] fetchAdvertisements notice:', err.message);
      return [];
    }
  },

  async saveAdvertisement(ad) {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase credentials not configured.');

    // Calculate expiry timestamp
    let expiresAt = 'permanent';
    const now = new Date();
    if (ad.duration === '24h') {
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (ad.duration === '48h') {
      expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    } else if (ad.duration === '7d') {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (ad.duration === '30d') {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (ad.duration === 'custom' && ad.customDays) {
      const days = parseInt(ad.customDays, 10) || 1;
      expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
    } else if (ad.expiresAt) {
      expiresAt = ad.expiresAt;
    }

    const isVideo = ad.mediaType === 'video' || (ad.mediaUrl && /\.(mp4|webm|mov|mkv)$/i.test(ad.mediaUrl));

    const actions = Array.isArray(ad.actions) && ad.actions.length > 0
      ? ad.actions
      : (ad.actionType && ad.actionTarget ? [{ type: ad.actionType, target: ad.actionTarget }] : []);

    const placements = Array.isArray(ad.placements) && ad.placements.length > 0
      ? ad.placements
      : (ad.placement ? (ad.placement === 'all' ? ['banner', 'feed', 'article'] : [ad.placement]) : ['banner', 'feed', 'article']);

    const isHidden = ad.isHidden === true;

    const meta = {
      videoUrl: isVideo ? ad.mediaUrl : null,
      mediaType: isVideo ? 'video' : 'image',
      actions: actions,
      actionType: actions[0]?.type || ad.actionType || 'whatsapp',
      actionTarget: actions[0]?.target || ad.actionTarget || '',
      placements: placements,
      placement: placements.join(','),
      expiresAt: expiresAt,
      clicks: ad.clicks || 0,
      isHidden: isHidden
    };

    const record = {
      id: ad.id || `ad-${Date.now()}`,
      title_hi: ad.businessName,
      title_en: ad.businessName,
      summary_hi: ad.about || '',
      summary_en: actions.map(a => `${a.type}:${a.target}`).join(' | '),
      content_hi: JSON.stringify(meta),
      content_en: JSON.stringify(meta),
      category: '_advertisement',
      image: isVideo ? null : ad.mediaUrl,
      published_at: ad.createdAt || new Date().toISOString(),
      author: ad.duration || 'permanent',
      read_time: expiresAt,
      is_trending: isHidden,
      views: ad.views || 0,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('articles').upsert(record);
    if (error) throw error;
    return record;
  },

  async incrementAdClick(adId) {
    if (!isSupabaseConfigured || !supabase || !adId) return;
    try {
      const { data } = await supabase
        .from('articles')
        .select('content_hi')
        .eq('id', adId)
        .maybeSingle();

      if (data && data.content_hi) {
        let meta = {};
        try { meta = JSON.parse(data.content_hi); } catch(e){}
        meta.clicks = (meta.clicks || 0) + 1;
        await supabase
          .from('articles')
          .update({ content_hi: JSON.stringify(meta) })
          .eq('id', adId);
      }
    } catch (e) {}
  },

  async deleteAdvertisement(adId) {
    if (!isSupabaseConfigured || !supabase || !adId) return;
    const { error } = await supabase.from('articles').delete().eq('id', adId);
    if (error) throw error;
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





