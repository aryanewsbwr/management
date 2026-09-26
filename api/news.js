import { XMLParser } from 'fast-xml-parser';

const FEEDS = [
  {
    category: 'national',
    sourceName: 'दैनिक भास्कर',
    url: 'https://www.bhaskar.com/rss-v1--category-1061.xml'
  },
  {
    category: 'business',
    sourceName: 'दैनिक भास्कर (बिजनेस)',
    url: 'https://www.bhaskar.com/rss-v1--category-1051.xml'
  },
  {
    category: 'sports',
    sourceName: 'दैनिक भास्कर (स्पोर्ट्स)',
    url: 'https://www.bhaskar.com/rss-v1--category-1053.xml'
  },
  {
    category: 'entertainment',
    sourceName: 'दैनिक भास्कर (मनोरंजन)',
    url: 'https://www.bhaskar.com/rss-v1--category-1057.xml'
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
  // 1. Dedicated feeds (sports, entertainment, business) MUST NEVER be overridden
  if (feedCategory === 'sports' || feedCategory === 'entertainment' || feedCategory === 'business') {
    return feedCategory;
  }

  const text = (title + ' ' + desc).toLowerCase();

  // 2. High-confidence Rajasthan state news (from general feeds)
  if (/राजस्थान में|जयपुर में|जोधपुर में|अजमेर में|ब्यावर में|कोटा में|उदयपुर में|भीलवाड़ा में|भजनलाल शर्मा|राजस्थान पुलिस|राजस्थान सरकार|अशोक गहलोत|वसुंधरा राजे/i.test(text)) {
    return 'rajasthan';
  }

  // 3. High-confidence Crime news (from general feeds)
  if (/हत्याकांड|कत्ल|गोली मारकर हत्या|पुलिस ने किया गिरफ्तार|हिरासत में लिया|चोरी की वारदात|लूट की वारदात|बलात्कार का मामला|सीबीआई ने|ईडी ने छापा|एनआईए ने|साइबर धोखाधड़ी/i.test(text)) {
    return 'crime';
  }

  // 4. Strict Entertainment news (only explicit cinema terms, no loose words like 'स्टार' or 'गाना')
  if (/बॉलीवुड फिल्म|बॉक्स ऑफिस कलेक्शन|फिल्म का ट्रेलर|ओटीटी रिलीज|सिनेमाघरों में रिलीज|अभिनेता|अभिनेत्री|हॉलीवुड फिल्म/i.test(text)) {
    return 'entertainment';
  }

  // 5. Strict Sports news (from general feeds)
  if (/क्रिकेट मैच|टीम इंडिया|आईपीएल 202|विश्व कप फाइनल|टेस्ट मैच|टी20 मैच|ओलंपिक पदक|बीसीसीआई ने|विराट कोहली|रोहित शर्मा/i.test(text)) {
    return 'sports';
  }

  // 6. Strict Business news (from general feeds)
  if (/शेयर बाजार|सेंसेक्स में|निफ्टी में|सोने के दाम|चांदी के भाव|आरबीआई की मौद्रिक नीति|जीएसटी कलेक्शन|भारतीय अर्थव्यवस्था|रुपया बनाम डॉलर/i.test(text)) {
    return 'business';
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
