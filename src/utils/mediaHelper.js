/**
 * Media Helper Utility for Arya News Agency
 * Extracts high-quality thumbnails from Cloudinary videos, galleries, and articles.
 */

export function getVideoThumbnailUrl(videoUrl) {
  if (!videoUrl || typeof videoUrl !== 'string') return null;
  
  if (videoUrl.includes('cloudinary.com')) {
    let jpgUrl = videoUrl.replace(/\.(mp4|webm|mov|mkv|avi|flv|wmv)$/i, '.jpg');
    if (jpgUrl.includes('/video/upload/') && !jpgUrl.includes('/so_')) {
      jpgUrl = jpgUrl.replace('/video/upload/', '/video/upload/so_1,w_800,c_fill,q_auto,f_auto/');
    }
    return jpgUrl;
  }

  return null;
}

export function getArticleThumbnail(article) {
  if (!article) {
    return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';
  }

  // 1. If explicit non-unsplash custom image exists, use it
  if (
    article.image && 
    typeof article.image === 'string' && 
    article.image.trim().length > 0 && 
    !article.image.includes('unsplash.com')
  ) {
    return article.image;
  }

  // 2. If gallery contains a valid non-unsplash image, use it
  if (article.gallery && Array.isArray(article.gallery)) {
    const validImg = article.gallery.find(
      g => g && typeof g === 'string' && g.trim().length > 0 && !g.includes('unsplash.com')
    );
    if (validImg) return validImg;
  }

  // 3. If videoUrl exists, generate Cloudinary video frame thumbnail
  const vidUrl = article.videoUrl || (article.mediaType === 'video' ? article.image : null);
  const vidThumb = getVideoThumbnailUrl(vidUrl);
  if (vidThumb) {
    return vidThumb;
  }

  // 4. If fallback image exists
  if (article.image && typeof article.image === 'string' && article.image.trim().length > 0) {
    return article.image;
  }

  return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';
}
