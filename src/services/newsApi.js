// Multi-Feed Real-Time Live News Aggregator for Aryan News Agency

const LIVE_FEEDS = [
  {
    category: 'national',
    sourceName: 'अमर उजाला ब्रेकिंग',
    url: 'https://www.amarujala.com/rss/breaking-news.xml',
    priority: 1
  },
  {
    category: 'rajasthan',
    sourceName: 'दैनिक भास्कर राजस्थान',
    url: 'https://www.bhaskar.com/rss-v1--category-1051.xml',
    priority: 1
  },
  {
    category: 'rajasthan',
    sourceName: 'अमर उजाला राजस्थान',
    url: 'https://www.amarujala.com/rss/rajasthan.xml',
    priority: 2
  },
  {
    category: 'crime',
    sourceName: 'अमर उजाला क्राइम',
    url: 'https://www.amarujala.com/rss/crime.xml',
    priority: 1
  },
  {
    category: 'national',
    sourceName: 'बीबीसी हिंदी',
    url: 'https://feeds.bbci.co.uk/hindi/rss.xml',
    priority: 2
  },
  {
    category: 'sports',
    sourceName: 'गूगल स्पोर्ट्स लाइव',
    url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=hi&gl=IN&ceid=IN:hi',
    priority: 1
  },
  {
    category: 'entertainment',
    sourceName: 'गूगल सिनेमा व बॉलीवुड',
    url: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=hi&gl=IN&ceid=IN:hi',
    priority: 1
  },
  {
    category: 'business',
    sourceName: 'गूगल बिज़नेस व मार्केट',
    url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=hi&gl=IN&ceid=IN:hi',
    priority: 1
  },
  {
    category: 'national',
    sourceName: 'गूगल टॉप हेडलाइंस',
    url: 'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi',
    priority: 3
  }
];

// High-quality contextual photo pool when RSS feed doesn't provide an image
const CURATED_CATEGORY_IMAGES = {
  rajasthan: [
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80'
  ],
  national: [
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000&auto=format&fit=crop&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80'
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1000&auto=format&fit=crop&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80'
  ],
  crime: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1453873531674-2151101a6678?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=1000&auto=format&fit=crop&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80'
  ]
};

function cleanHtml(htmlStr = '') {
  if (!htmlStr) return '';
  return htmlStr
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch a single RSS feed via rss2json
 */
async function fetchFeed(feedConfig, index) {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedConfig.url)}`;
  
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data || !data.items || !Array.isArray(data.items)) return [];

    return data.items.map((item, itemIdx) => {
      const cleanDesc = cleanHtml(item.description || item.content || '');
      
      // Determine image: enclosure -> thumbnail -> regex in description -> curated fallback
      let img = item.enclosure?.link || item.thumbnail;
      if (!img || img === '') {
        const match = (item.description || '').match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) img = match[1];
      }

      if (!img || img === '') {
        const pool = CURATED_CATEGORY_IMAGES[feedConfig.category] || CURATED_CATEGORY_IMAGES.default;
        img = pool[itemIdx % pool.length];
      }

      // Format clean publication date
      let pubDate = item.pubDate;
      try {
        pubDate = new Date(item.pubDate).toISOString();
      } catch {
        pubDate = new Date().toISOString();
      }

      return {
        id: `live-${feedConfig.category}-${index}-${itemIdx}-${Date.now().toString(36)}`,
        titleHi: item.title,
        titleEn: item.title,
        summaryHi: cleanDesc ? cleanDesc.slice(0, 180) + '...' : item.title,
        summaryEn: cleanDesc ? cleanDesc.slice(0, 180) + '...' : item.title,
        contentHi: cleanDesc || item.title,
        contentEn: cleanDesc || item.title,
        category: feedConfig.category,
        image: img,
        publishedAt: pubDate,
        author: item.author || feedConfig.sourceName || 'आर्यन लाइव डेस्क',
        sourceName: feedConfig.sourceName,
        originalUrl: item.link,
        isLiveFeed: true,
        readTime: '2 मिनट',
        views: Math.floor(Math.random() * 2400) + 1200
      };
    });
  } catch (err) {
    console.warn(`[newsApi] feed error for ${feedConfig.sourceName}:`, err.message);
    return [];
  }
}

/**
 * Fetch all live news feeds concurrently from all live APIs
 */
export async function fetchAllLiveCategories() {
  const promises = LIVE_FEEDS.map((feed, idx) => fetchFeed(feed, idx));
  const results = await Promise.allSettled(promises);

  const allArticles = [];
  results.forEach(res => {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allArticles.push(...res.value);
    }
  });

  return allArticles;
}
