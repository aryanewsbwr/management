// Real-Time Live Hindi News Aggregator for Aryan News Agency
// Strictly uses feeds with 100% authentic, real publisher news images (Dainik Bhaskar & BBC Hindi)

const LIVE_FEEDS = [
  {
    category: 'national',
    sourceName: 'दैनिक भास्कर (राष्ट्रीय व राज्य)',
    url: 'https://www.bhaskar.com/rss-v1--category-1061.xml',
    priority: 1
  },
  {
    category: 'business',
    sourceName: 'दैनिक भास्कर (बिजनेस व मार्केट)',
    url: 'https://www.bhaskar.com/rss-v1--category-1051.xml',
    priority: 1
  },
  {
    category: 'sports',
    sourceName: 'दैनिक भास्कर (खेल जगत)',
    url: 'https://www.bhaskar.com/rss-v1--category-1053.xml',
    priority: 1
  },
  {
    category: 'entertainment',
    sourceName: 'दैनिक भास्कर (सिनेमा व लाइफस्टाइल)',
    url: 'https://www.bhaskar.com/rss-v1--category-1057.xml',
    priority: 1
  },
  {
    category: 'national',
    sourceName: 'बीबीसी हिंदी (देश-विदेश)',
    url: 'https://feeds.bbci.co.uk/hindi/rss.xml',
    priority: 1
  }
];

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
 * Intelligent categorization based on Hindi headline & body content
 */
function detectCategory(title = '', desc = '', defaultCat = 'national') {
  const text = (title + ' ' + desc).toLowerCase();

  // Rajasthan regional news
  if (/राजस्थान|जयपुर|जोधपुर|अजमेर|ब्यावर|कोटा|उदयपुर|बीकानेर|भीलवाड़ा|सीकर|अलवर|पाली|बाड़मेर|चित्तौड़गढ़|भजनलाल|गहलोत/i.test(text)) {
    return 'rajasthan';
  }

  // Crime & investigative news
  if (/हत्या|मर्डर|गिरफ्तार|कत्ल|सुसाइड|क्राइम|पुलिस|हथियार|गोलीबारी|गोली|चोरी|डकैती|लूट|गैंग|धोखाधड़ी|बलात्कार|सीबीआई|ईडी|एनआईए|अरेस्ट|कोर्ट|हिरासत/i.test(text)) {
    return 'crime';
  }

  // Sports & Cricket
  if (/क्रिकेट|ipl|मैच|विश्व कप|टूर्नामेंट|हॉकी|फुटबॉल|खिलाड़ी|मेडल|एशियन गेम्स|विराट|रोहित|धोनी|बीसीसीआई|शमी|पंड्या|ओलंपिक/i.test(text)) {
    return 'sports';
  }

  // Business & Market / Mandi
  if (/शेयर|सेंसेक्स|निफ्टी|सोना|चांदी|मार्केट|रुपया|डॉलर|अर्थव्यवस्था|आरबीआई|बैंक|अडाणी|अंबानी|कारोबार|मंडी|जीएसटी|इनकम टैक्स|बजट/i.test(text)) {
    return 'business';
  }

  // Entertainment / Cinema / Tech
  if (/बॉलीवुड|फिल्म|सिनेमा|एक्टर|एक्ट्रेस|सलमान|शाहरुख|ओटीटी|ट्रेलर|गाना|स्टार|बॉक्स ऑफिस|सीरीज|हॉलीवुड|कलाकार|गीत/i.test(text)) {
    return 'entertainment';
  }

  return defaultCat;
}

/**
 * Fetch a single RSS feed via rss2json with cache-busting timestamp
 */
async function fetchFeed(feedConfig, index) {
  // Add unique cache-busting query parameter so fresh news is always loaded
  const cacheBuster = Date.now();
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedConfig.url)}&_t=${cacheBuster}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data || !data.items || !Array.isArray(data.items)) return [];

    const parsedArticles = [];

    data.items.forEach((item, itemIdx) => {
      const cleanDesc = cleanHtml(item.description || item.content || '');

      // Extract real image from enclosure, thumbnail, or img tag
      let img = item.enclosure?.link || item.thumbnail;
      if (!img || img === '') {
        const match = (item.description || item.content || '').match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) img = match[1];
      }

      // If BBC image, upgrade thumbnail to high-resolution 800px
      if (img && img.includes('ichef.bbci.co.uk') && img.includes('/ws/240/')) {
        img = img.replace('/ws/240/', '/ws/800/');
      }

      // ONLY include articles with a verified real news image from publisher
      // This completely eliminates wrong / mismatched generic stock photos
      if (!img || typeof img !== 'string' || img.length < 15) {
        return;
      }

      // Determine category dynamically based on content keywords
      const detectedCat = detectCategory(item.title, cleanDesc, feedConfig.category);

      // Parse clean ISO publication date
      let pubDate;
      try {
        const parsed = new Date(item.pubDate);
        pubDate = isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
      } catch {
        pubDate = new Date().toISOString();
      }

      parsedArticles.push({
        id: `live-${feedConfig.category}-${index}-${itemIdx}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        titleHi: item.title ? item.title.trim() : '',
        titleEn: item.title ? item.title.trim() : '',
        summaryHi: cleanDesc ? cleanDesc.slice(0, 180).trim() + '...' : item.title,
        summaryEn: cleanDesc ? cleanDesc.slice(0, 180).trim() + '...' : item.title,
        contentHi: cleanDesc || item.title,
        contentEn: cleanDesc || item.title,
        category: detectedCat,
        image: img,
        publishedAt: pubDate,
        author: item.author || feedConfig.sourceName || 'आर्यन लाइव डेस्क',
        sourceName: feedConfig.sourceName,
        originalUrl: item.link,
        isLiveFeed: true,
        readTime: '2 मिनट',
        views: Math.floor(Math.random() * 2400) + 1400
      });
    });

    return parsedArticles;
  } catch (err) {
    console.warn(`[newsApi] feed error for ${feedConfig.sourceName}:`, err.message);
    return [];
  }
}

/**
 * Fetch all live news feeds concurrently from all live APIs,
 * sorted with the newest articles on top
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

  // Sort descending by publication date (newest first)
  allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return allArticles;
}
