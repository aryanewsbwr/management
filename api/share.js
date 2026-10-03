// Aryan News Agency - Dynamic Social Share & Open Graph Previews
// Serves rich Open Graph / Twitter Card meta tags for WhatsApp, Facebook, Telegram crawlers,
// and immediately redirects humans to the full article on the website.

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract articleId from query (id, article, or fallback parse from url)
  let articleId = req.query.id || req.query.article;
  if (!articleId && req.url) {
    const match = req.url.match(/(?:\/news\/|[?&](?:article|id)=)([^&#/?]+)/i);
    if (match) {
      articleId = decodeURIComponent(match[1]);
    }
  }

  const siteUrl = 'https://www.aryannewsagency.com';

  if (!articleId) {
    return res.redirect(302, siteUrl);
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://giorcyxpcgpmvjxgfucs.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tv41PJI403eInRMtvKfyXQ_hl2LPoJ5';

  let article = null;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/articles?id=eq.${encodeURIComponent(articleId)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        article = data[0];
      }
    }
  } catch (err) {
    console.error('[api/share] Error fetching article:', err.message);
  }

  const title = article?.title_hi || article?.title_en || 'आर्यन न्यूज़ एजेंसी (ब्यावर)';
  const rawDesc = article?.summary_hi || article?.content_hi || 'ब्यावर एवं राजस्थान की ताज़ा व विश्वसनीय खबरें।';
  const description = rawDesc.replace(/\s+/g, ' ').slice(0, 180).trim() + (rawDesc.length > 180 ? '...' : '');
  
  let gallery = null;
  let videoUrl = null;
  if (article?.content_hi) {
    const metaMatch = article.content_hi.match(/<!--MEDIA_META:([\s\S]*?)-->/);
    if (metaMatch) {
      try {
        const parsed = JSON.parse(metaMatch[1]);
        if (parsed.videoUrl) videoUrl = parsed.videoUrl;
        if (parsed.gallery) gallery = parsed.gallery;
      } catch (e) {}
    }
  }

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /facebookexternalhit|facebot|meta-externalagent|whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|skypeuripreview|discordbot|applebot|bingbot|googlebot|crawler|spider/i.test(userAgent);

  const category = article?.category || req.query.category || 'beawar';
  const targetUrl = `${siteUrl}/?category=${encodeURIComponent(category)}&article=${encodeURIComponent(articleId)}`;
  const shareCanonicalUrl = `${siteUrl}/news/${encodeURIComponent(articleId)}`;

  // If a real human user opens the link directly in their browser, redirect them immediately to the article
  if (!isBot && !req.query.preview) {
    return res.redirect(302, targetUrl);
  }

  // Format and optimize the image URL for Facebook and Social Media
  let image = `${siteUrl}/logo.png`;
  if (article?.image && typeof article.image === 'string' && article.image.startsWith('http') && !article.image.includes('unsplash.com')) {
    image = article.image;
  } else if (gallery && Array.isArray(gallery) && gallery.length > 0) {
    const validG = gallery.find(g => g && typeof g === 'string' && g.startsWith('http') && !g.includes('unsplash.com'));
    if (validG) image = validG;
  } else if (videoUrl && typeof videoUrl === 'string' && videoUrl.includes('cloudinary.com')) {
    image = videoUrl;
  }

  // Optimize Cloudinary URLs for 100% Social Media Crawler compatibility (1200x630 JPG)
  if (image && image.includes('cloudinary.com')) {
    // If it's a video or ends with a video extension, extract a clean JPEG poster frame
    if (image.includes('/video/upload/') || /\.(mp4|webm|mov|mkv|avi|flv|wmv)$/i.test(image)) {
      image = image.replace(/\.(mp4|webm|mov|mkv|avi|flv|wmv)$/i, '.jpg');
      if (image.includes('/video/upload/') && !image.includes('/so_') && !image.includes('/w_')) {
        image = image.replace('/video/upload/', '/video/upload/so_1,w_1200,h_630,c_fill,q_auto,f_jpg/');
      }
    } else if (image.includes('/image/upload/') && !image.includes('/w_')) {
      image = image.replace('/image/upload/', '/image/upload/w_1200,h_630,c_fill,q_auto,f_jpg/');
    }
  }

  const html = `<!DOCTYPE html>
<html lang="hi" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - आर्यन न्यूज़ एजेंसी</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${escapeHtml(title)}">
  <meta name="description" content="${escapeHtml(description)}">

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="आर्यन न्यूज़ एजेंसी (ब्यावर)">
  <meta property="og:url" content="${shareCanonicalUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  <meta property="og:locale" content="hi_IN">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${shareCanonicalUrl}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">

  <!-- Canonical URL -->
  <link rel="canonical" href="${shareCanonicalUrl}">

  <!-- Instant Human Fallback Redirect (Only for browsers, never for crawlers) -->
  <script>
    if (!/bot|crawler|spider|facebookexternalhit|facebot|whatsapp/i.test(navigator.userAgent)) {
      window.location.replace(${JSON.stringify(targetUrl)});
    }
  </script>
</head>
<body style="margin:0;padding:0;background:#f9fafb;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;">
  <div style="text-align:center;padding:20px;">
    <div style="width:44px;height:44px;border:3px solid #fee2e2;border-top:3px solid #dc2626;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
    <div style="color:#b91c1c;font-weight:900;font-size:20px;">आर्यन न्यूज़ एजेंसी</div>
    <p style="color:#6b7280;font-size:13px;margin-top:8px;">खबर लोड हो रही है, कृपया प्रतीक्षा करें...</p>
    <a href="${targetUrl}" style="display:inline-block;margin-top:12px;color:#dc2626;font-size:14px;font-weight:700;text-decoration:none;">यहाँ क्लिक करें यदि आप स्वतः पुनर्निर्देशित नहीं हुए हैं →</a>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(html);
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
