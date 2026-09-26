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
    const match = req.url.match(/[?&](?:article|id)=([^&#]+)/);
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
  
  // Prefer real uploaded image, fallback to high-res site banner
  const image = article?.image && article.image.startsWith('http')
    ? article.image
    : `${siteUrl}/logo.png`;

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
<body style="font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:40px 20px;background:#f9fafb;color:#111;">
  <p style="font-size:16px;font-weight:bold;">खबर लोड हो रही है...</p>
  <p><a href="${targetUrl}" style="color:#dc2626;text-decoration:none;font-size:14px;">यहाँ क्लिक करें यदि आप स्वचालित रूप से रीडायरेक्ट नहीं होते हैं।</a></p>
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
