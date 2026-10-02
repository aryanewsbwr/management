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

  let image = `${siteUrl}/logo.png`;
  if (article?.image && article.image.startsWith('http') && !article.image.includes('unsplash.com')) {
    image = article.image;
  } else if (gallery && Array.isArray(gallery) && gallery.length > 0) {
    const validG = gallery.find(g => g && g.startsWith('http') && !g.includes('unsplash.com'));
    if (validG) image = validG;
  } else if (videoUrl && videoUrl.includes('cloudinary.com')) {
    image = videoUrl.replace(/\.(mp4|webm|mov|mkv|avi|flv|wmv)$/i, '.jpg');
  }

  // Ensure Cloudinary URLs are optimized for fast WhatsApp and Social crawlers (1200x630 JPG)
  if (image && image.includes('cloudinary.com') && image.includes('/upload/')) {
    if (!image.includes('/w_') && !image.includes('/so_')) {
      if (image.includes('/video/upload/')) {
        image = image.replace('/video/upload/', '/video/upload/so_1,w_1200,h_630,c_fill,q_auto,f_jpg/');
      } else if (image.includes('/image/upload/')) {
        image = image.replace('/image/upload/', '/image/upload/w_1200,h_630,c_fill,q_auto,f_jpg/');
      }
    }
  }

  const category = article?.category || req.query.category || 'beawar';
  const targetUrl = `${siteUrl}/?category=${encodeURIComponent(category)}&article=${encodeURIComponent(articleId)}`;

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
  <meta property="og:url" content="${targetUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(title)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${targetUrl}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">

  <!-- Canonical URL -->
  <link rel="canonical" href="${targetUrl}">

  <!-- Immediate Client-Side Redirect for Humans -->
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <script>
    window.location.replace(${JSON.stringify(targetUrl)});
  </script>
</head>
<body style="margin:0;padding:0;background:#f9fafb;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;">
  <div style="text-align:center;animation:fadeIn 0.5s ease-in;">
    <div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top:3px solid #dc2626;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
    <div style="color:#b91c1c;font-weight:800;font-size:18px;letter-spacing:-0.5px;">Aryan News Agency</div>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
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
