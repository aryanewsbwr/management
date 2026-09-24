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

function detectCategory(title = '', desc = '', defaultCat = 'national') {
  const text = (title + ' ' + desc).toLowerCase();
  if (/राजस्थान|जयपुर|जोधपुर|अजमेर|ब्यावर|कोटा|उदयपुर|बीकानेर|भीलवाड़ा|सीकर|अलवर|पाली|बाड़मेर|चित्तौड़गढ़|भजनलाल|गहलोत/i.test(text)) {
    return 'rajasthan';
  }
  if (/हत्या|मर्डर|गिरफ्तार|कत्ल|सुसाइड|क्राइम|पुलिस|हथियार|गोलीबारी|गोली|चोरी|डकैती|लूट|गैंग|धोखाधड़ी|बलात्कार|सीबीआई|ईडी|एनआईए|अरेस्ट|कोर्ट|हिरासत/i.test(text)) {
    return 'crime';
  }
  if (/क्रिकेट|ipl|मैच|विश्व कप|टूर्नामेंट|हॉकी|फुटबॉल|खिलाड़ी|मेडल|एशियन गेम्स|विराट|रोहित|धोनी|बीसीसीआई|शमी|ओलंपिक/i.test(text)) {
    return 'sports';
  }
  if (/शेयर|सेंसेक्स|निफ्टी|सोना|चांदी|मार्केट|रुपया|डॉलर|अर्थव्यवस्था|आरबीआई|बैंक|अडाणी|अंबानी|कारोबार|मंडी|जीएसटी|बजट/i.test(text)) {
    return 'business';
  }
  if (/बॉलीवुड|फिल्म|सिनेमा|एक्टर|एक्ट्रेस|सलमान|शाहरुख|ओटीटी|ट्रेलर|गाना|स्टार|बॉक्स ऑफिस|सीरीज|हॉलीवुड/i.test(text)) {
    return 'entertainment';
  }
  return defaultCat;
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

      // Extract image: media:content, enclosure, thumbnail, or regex inside description
      let img = item['media:content']?.['@_url'] || 
                item.enclosure?.['@_url'] || 
                item['media:thumbnail']?.['@_url'] || 
                item.thumbnail;

      if (!img) {
        const match = (rawDesc || '').match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) img = match[1];
      }

      // Upgrade BBC 240px image to high-res 800px
      if (img && typeof img === 'string' && img.includes('ichef.bbci.co.uk')) {
        img = img.replace('/240/', '/800/');
      }

      // Only include items with verified original news photos
      if (!img || typeof img !== 'string' || img.length < 15) return;

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
        image: img,
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
