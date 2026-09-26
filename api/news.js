import { XMLParser } from 'fast-xml-parser';

const FEEDS = [
  // 1. Rajasthan State News (Dedicated verified feed)
  {
    category: 'rajasthan',
    sourceName: 'अमर उजाला (राजस्थान)',
    url: 'https://www.amarujala.com/rss/rajasthan.xml'
  },
  // 2. Pure Entertainment & Cinema (Dedicated verified feed)
  {
    category: 'entertainment',
    sourceName: 'अमर उजाला (मनोरंजन)',
    url: 'https://www.amarujala.com/rss/entertainment.xml'
  },
  // 3. Sports & Games (Dedicated verified feeds)
  {
    category: 'sports',
    sourceName: 'अमर उजाला (खेल)',
    url: 'https://www.amarujala.com/rss/sports.xml'
  },
  {
    category: 'sports',
    sourceName: 'दैनिक भास्कर (स्पोर्ट्स)',
    url: 'https://www.bhaskar.com/rss-v1--category-1053.xml'
  },
  // 4. Business & Economy (Dedicated verified feeds)
  {
    category: 'business',
    sourceName: 'अमर उजाला (कारोबार)',
    url: 'https://www.amarujala.com/rss/business.xml'
  },
  {
    category: 'business',
    sourceName: 'दैनिक भास्कर (बिजनेस)',
    url: 'https://www.bhaskar.com/rss-v1--category-1051.xml'
  },
  // 5. Crime & Police (Dedicated verified feed)
  {
    category: 'crime',
    sourceName: 'अमर उजाला (क्राइम)',
    url: 'https://www.amarujala.com/rss/crime.xml'
  },
  // 6. National & World News (Dedicated verified feeds)
  {
    category: 'national',
    sourceName: 'दैनिक भास्कर (देश)',
    url: 'https://www.bhaskar.com/rss-v1--category-1061.xml'
  },
  {
    category: 'national',
    sourceName: 'बीबीसी हिंदी',
    url: 'https://feeds.bbci.co.uk/hindi/rss.xml'
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
  // 1. Dedicated feeds (rajasthan, entertainment, sports, business, crime) MUST NEVER be overridden
  if (['rajasthan', 'entertainment', 'sports', 'business', 'crime'].includes(feedCategory)) {
    return feedCategory;
  }

  const text = (title + ' ' + desc).toLowerCase();

  // 2. High-confidence Rajasthan state news from national feeds
  if (/राजस्थान में|जयपुर में|जोधपुर में|अजमेर में|ब्यावर में|कोटा में|उदयपुर में|भीलवाड़ा में|भजनलाल शर्मा|राजस्थान पुलिस|राजस्थान सरकार|अशोक गहलोत|वसुंधरा राजे/i.test(text)) {
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

      // Short summary (~180 chars max) - no full body text per client rule
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

export default async function handler(req, res) {
  // Edge caching for 10-15 minutes on Vercel CDN
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
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
