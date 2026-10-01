const fs = require('fs');
let c = fs.readFileSync('api/share.js', 'utf8');

const target = const image = article?.image && article.image.startsWith('http')
    ? article.image
    : \\\\/logo.png\\\;;

const replacement = let videoUrl = null;
  if (article?.content_hi) {
    const metaMatch = article.content_hi.match(/<!--MEDIA_META:([\\\\s\\\\S]*?)-->/);
    if (metaMatch) {
      try {
        const parsed = JSON.parse(metaMatch[1]);
        if (parsed.videoUrl) videoUrl = parsed.videoUrl;
      } catch (e) {}
    }
  }

  let image = \\\\/logo.png\\\;
  if (article?.image && article.image.startsWith('http') && !article.image.includes('unsplash.com')) {
    image = article.image;
  } else if (videoUrl && videoUrl.includes('cloudinary.com')) {
    image = videoUrl.replace(/\\\\.(mp4|webm|mov|mkv)$/i, '.jpg');
  };

c = c.replace(target, replacement);
fs.writeFileSync('api/share.js', c);
