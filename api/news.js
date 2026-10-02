import { XMLParser } from 'fast-xml-parser';

const FEEDS = [
  // 1. Sports (Dainik Bhaskar)
  {
    category: 'sports',
    sourceName: 'दैनिक भास्कर (स्पोर्ट्स)',
    url: 'https://www.bhaskar.com/rss-v1--category-1053.xml'
  },
  // 2. Business & Economy (Dainik Bhaskar)
  {
    category: 'business',
    sourceName: 'दैनिक भास्कर (बिजनेस)',
    url: 'https://www.bhaskar.com/rss-v1--category-1051.xml'
  },
  // 3. National & World News (Dainik Bhaskar)
  {
    category: 'national',
    sourceName: 'दैनिक भास्कर (देश)',
    url: 'https://www.bhaskar.com/rss-v1--category-1061.xml'
  },
  // 4. International & National (BBC Hindi)
  {
    category: 'national',
    sourceName: 'बीबीसी हिंदी',
    url: 'https://feeds.bbci.co.uk/hindi/rss.xml'
  },
  // 5. Entertainment (Dainik Bhaskar Cinema)
  {
    category: 'entertainment',
    sourceName: 'दैनिक भास्कर (मनोरंजन)',
    url: 'https://www.bhaskar.com/rss-v1--category-1054.xml'
  },
  // 6. Rajasthan State (Dainik Bhaskar Rajasthan)
  {
    category: 'rajasthan',
    sourceName: 'दैनिक भास्कर (राजस्थान)',
    url: 'https://www.bhaskar.com/rss-v1--category-1049.xml'
  }
];

function cleanHtml(str = '') {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectCategory(title = '', desc = '', feedCategory = 'national') {
  if (['rajasthan', 'entertainment', 'sports', 'business', 'crime'].includes(feedCategory)) {
    return feedCategory;
  }

  const text = (title + ' ' + desc).toLowerCase();

  if (/राजस्थान|जयपुर|जोधपुर|अजमेर|ब्यावर|कोटा|उदयपुर|भीलवाड़ा|भजनलाल शर्मा|राजस्थान पुलिस/i.test(text)) {
    return 'rajasthan';
  }

  return 'national';
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

async function parseFeed(feedConfig, feedIndex) {
  try {
    const res = await fetch(feedConfig.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AryanNewsAgency/2.0'
      }
    });

    if (!res.ok) return [];

    const xmlText = await res.text();
    const parsed = xmlParser.parse(xmlText);
    const channel = parsed?.rss?.channel || parsed?.feed;
    const items = channel?.item || channel?.entry;

    if (!items) return [];

    const itemArray = Array.isArray(items) ? items : [items];
    const articles = [];

    itemArray.forEach((item, itemIdx) => {
      const rawTitle = typeof item.title === 'string' ? item.title : item.title?.['#text'] || '';
      const rawDesc = typeof item.description === 'string' ? item.description : item.description?.['#text'] || item.summary || '';
      const link = typeof item.link === 'string' ? item.link : item.link?.['@_href'] || item.link?.['#text'] || item.guid || '';

      const cleanTitle = cleanHtml(rawTitle);
      const cleanDesc = cleanHtml(rawDesc);

      const category = detectCategory(cleanTitle, cleanDesc, feedConfig.category);

      let pubDate;
      try {
        const rawDate = item.pubDate || item.published || item['dc:date'];
        const parsedDate = new Date(rawDate);
        pubDate = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
      } catch {
        pubDate = new Date().toISOString();
      }

      const shortSummary = cleanDesc.length > 180 
        ? cleanDesc.slice(0, 180).trim() + '...' 
        : (cleanDesc || cleanTitle);

      articles.push({
        id: `live-${feedConfig.category}-${feedIndex}-${itemIdx}`,
        titleHi: cleanTitle,
        titleEn: cleanTitle,
        summaryHi: shortSummary,
        summaryEn: shortSummary,
        contentHi: shortSummary,
        contentEn: shortSummary,
        category,
        image: null,
        publishedAt: pubDate,
        author: cleanHtml(item['dc:creator'] || item.author || feedConfig.sourceName),
        sourceName: feedConfig.sourceName,
        originalUrl: link,
        isLiveFeed: true,
        readTime: '2 मिनट'
      });
    });

    return articles;
  } catch (err) {
    console.error(`Error parsing ${feedConfig.sourceName}:`, err.message);
    return [];
  }
}

// Check kill switch from Supabase
async function isKillSwitchActive() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return false;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.setting-api-news-status&select=title_hi`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0].title_hi === 'disabled';
    }
  } catch (e) {
    console.warn('Kill switch check error in api/news:', e.message);
  }
  return false;
}

export default async function handler(req, res) {
  // Edge caching on Vercel CDN
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=120');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check Kill Switch Setting
    const isKilled = await isKillSwitchActive();
    if (isKilled) {
      return res.status(200).json({
        status: 'disabled',
        message: 'Live API syndication is currently disabled by administrator kill switch.',
        count: 0,
        updatedAt: new Date().toISOString(),
        articles: []
      });
    }

    const promises = FEEDS.map((feed, idx) => parseFeed(feed, idx));
    const settled = await Promise.allSettled(promises);

    const allArticles = [];
    settled.forEach(result => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allArticles.push(...result.value);
      }
    });

    // Chronological sort: newest first
    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return res.status(200).json({
      status: 'ok',
      count: allArticles.length,
      updatedAt: new Date().toISOString(),
      articles: allArticles
    });
  } catch (error) {
    console.error('Serverless news API error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      articles: []
    });
  }
}
