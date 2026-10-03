import React, { useState } from 'react';
import { 
  X, Share2, Volume2, Bookmark, Eye, Clock, 
  ExternalLink, ArrowLeft, Type, Check, Send, 
  Image as ImageIcon, Maximize2, Copy, Link2, 
  MessageCircle, Layers
} from 'lucide-react';
import { CATEGORIES, AGENCY_INFO } from '../data/categories';
import CategoryPlaceholder from './CategoryPlaceholder';
import MediaCarousel from './MediaCarousel';
import AdvertisementCard from './AdvertisementCard';

export default function ArticleModal({
  article,
  isOpen,
  isLoading = false,
  onClose,
  lang = 'hi',
  onPlayTTS,
  isPlayingAudio = false,
  isBookmarked = false,
  onToggleBookmark,
  relatedArticles = [],
  onSelectRelated,
  ad = null
}) {
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: normal, 1: medium, 2: large
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [zoomedImg, setZoomedImg] = useState(null);

  if (!isOpen) return null;

  // Instant Skeleton Reader when loading from deep-link or slow connection
  if (isLoading || !article) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 min-h-screen sm:min-h-0 sm:my-8 sm:rounded-2xl shadow-2xl overflow-hidden border-0 sm:border border-gray-200 dark:border-gray-800 flex flex-col p-4 sm:p-6 animate-pulse">
          {/* Sticky Top Control Skeleton */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
              title="वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400">खबर लोड हो रही है...</span>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title Skeleton */}
          <div className="mt-6 space-y-3">
            <div className="h-7 sm:h-9 bg-gray-200 dark:bg-gray-800 rounded-lg w-11/12"></div>
            <div className="h-7 sm:h-9 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
          </div>

          {/* Meta Skeleton */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-36"></div>
          </div>

          {/* Media Card Skeleton */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] min-h-[240px] sm:min-h-[360px] bg-gray-200 dark:bg-gray-800 rounded-2xl my-3 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs font-semibold text-gray-500">आर्यन न्यूज़ एजेंसी (ब्यावर)</p>
            </div>
          </div>

          {/* Paragraphs Skeleton */}
          <div className="space-y-3 mt-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const categoryMeta = CATEGORIES.find(c => c.id === article.category) || CATEGORIES[1];
  const categoryLabel = lang === 'hi' ? categoryMeta.nameHi : categoryMeta.nameEn;

  const title = lang === 'hi' ? article.titleHi : (article.titleEn || article.titleHi);
  const content = lang === 'hi' ? (article.contentHi || article.summaryHi) : (article.contentEn || article.summaryEn || article.contentHi);

  const fontClasses = [
    'text-base leading-relaxed',
    'text-lg leading-relaxed sm:text-xl sm:leading-loose',
    'text-xl leading-loose sm:text-2xl'
  ];

  const shareUrl = `https://www.aryannewsagency.com/news/${article.id}`;

  const getFullShareText = () => {
    const cleanContent = content ? content.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim() : '';
    const excerpt = cleanContent.length > 250 ? cleanContent.slice(0, 250) + '...' : cleanContent;
    return `${title}\n\n${excerpt}\n\n👉 पूरी खबर एवं वीडियो देखें:\n${shareUrl}\n\n#AryanNewsAgency #BeawarNews #RajasthanNews`;
  };

  const handleWhatsAppShare = () => {
    const text = `*${title}*\n\n${content ? content.slice(0, 160) + '...' : ''}\n\n👉 पूरी खबर एवं फोटो देखें:\n${shareUrl}\n\n*आर्यन न्यूज़ एजेंसी (ब्यावर)*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 1. Facebook Personal Post / Feed / Timeline / Story
  const handleFacebookPersonalShare = () => {
    const shareText = getFullShareText();
    try {
      navigator.clipboard.writeText(shareText);
    } catch (e) {}

    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=620,height=580,scrollbars=yes,resizable=yes');
  };

  // 2. Facebook Page / Group Share
  const handleFacebookPageShare = () => {
    const shareText = getFullShareText();
    try {
      navigator.clipboard.writeText(shareText);
    } catch (e) {}

    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=620,height=580,scrollbars=yes,resizable=yes');
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      prompt('लिंक कॉपी करें:', shareUrl);
    }
  };

  // Extract attached photos if this is a video article with gallery images
  const attachedPhotos = (
    article.gallery && Array.isArray(article.gallery) && article.gallery.length > 0
      ? article.gallery
      : (article.image && !article.image.includes('unsplash.com') ? [article.image] : [])
  ).filter(img => img && typeof img === 'string' && img.startsWith('http') && !img.includes('unsplash.com') && !img.endsWith('.mp4'));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 min-h-screen sm:min-h-0 sm:my-8 sm:rounded-2xl shadow-2xl overflow-hidden border-0 sm:border border-gray-200 dark:border-gray-800 flex flex-col">
        
        {/* STICKY TOP CONTROL BAR */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
              title="वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md">
              {categoryLabel}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Font size control */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 text-xs text-gray-700 dark:text-gray-300">
              <button
                onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
                className="px-2 py-1 hover:bg-white dark:hover:bg-gray-700 rounded font-bold"
                title="छोटा फ़ॉन्ट"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeLevel(Math.min(2, fontSizeLevel + 1))}
                className="px-2 py-1 hover:bg-white dark:hover:bg-gray-700 rounded font-bold"
                title="बड़ा फ़ॉन्ट"
              >
                A+
              </button>
            </div>

            {/* Audio Speech */}
            <button
              onClick={() => onPlayTTS(article)}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition ${
                isPlayingAudio
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-red-600'
              }`}
              title="खबर सुनें"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isPlayingAudio ? 'रुकें' : 'सुनें'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-lg transition ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-amber-600'
              }`}
              title="सेव करें"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Quick Share Modal Toggle */}
            <button
              onClick={() => setShowShareModal(!showShareModal)}
              className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
              title="शेयर विकल्प"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP QUICK SHARE DROPDOWN BANNER */}
        {showShareModal && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-950 text-white px-4 py-3 border-b border-gray-800 animate-in slide-in-from-top duration-200 flex flex-wrap items-center justify-between gap-2 shadow-lg">
            <span className="text-xs font-bold font-hindi text-gray-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>खबर शेयर करें:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow active:scale-95"
              >
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleFacebookPersonalShare}
                className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow active:scale-95"
                title="फेसबुक पोस्ट / प्रोफाइल"
              >
                <span>FB पोस्ट</span>
              </button>

              <button
                onClick={handleFacebookPageShare}
                className="flex items-center gap-1.5 bg-[#0d59bf] hover:bg-[#0b4ca3] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow active:scale-95"
                title="फेसबुक पेज या ग्रुप पर शेयर करें"
              >
                <span>FB पेज/ग्रुप</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold px-3 py-1.5 rounded-xl transition border border-gray-700 active:scale-95"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                <span>{copiedLink ? 'कॉपी हुआ!' : 'लिंक'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ARTICLE BODY */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          
          {/* Headline */}
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black font-hindi text-gray-950 dark:text-white leading-tight">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="mt-4 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {article.author || 'आर्यन ब्यूरो, ब्यावर'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString('hi-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Featured Image or Category Placeholder */}
          {article.isLiveFeed ? (
            <div className="my-5">
              <CategoryPlaceholder 
                category={article.category} 
                sourceName={article.sourceName} 
                size="large" 
              />
            </div>
          ) : (
            <div className="my-5 rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
              <MediaCarousel
                images={article.gallery && article.gallery.length > 0 ? article.gallery : [article.image]}
                videoUrl={article.videoUrl}
                mediaType={article.mediaType}
                title={title}
                aspectRatio="w-full aspect-[16/10] sm:aspect-[16/9] min-h-[260px] sm:min-h-[380px] max-h-[500px]"
                autoPlayInterval={3500}
                showControls={true}
                mediaCaption={article.mediaCaption}
              />
              <div className="p-2.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 font-hindi border-t border-gray-100 dark:border-gray-800 flex items-center justify-between px-4">
                <span>{article.mediaCaption || 'फोटो / वीडियो: आर्यन न्यूज़ एजेंसी डिजिटल नेटवर्क (ब्यावर)'}</span>
                {article.gallery && article.gallery.length > 1 && !article.videoUrl && (
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    कुल {article.gallery.length} फोटो (ऑटो स्लाइड शो)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ATTACHED PHOTOS SECTION FOR VIDEO ARTICLES */}
          {article.videoUrl && attachedPhotos.length > 0 && (
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black font-hindi text-gray-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-600" />
                  <span>📷 समाचार से जुड़ी तस्वीरें ({attachedPhotos.length})</span>
                </h4>
                <span className="text-[11px] text-gray-500 font-hindi">
                  (ज़ूम करने हेतु फोटो पर टैप करें)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {attachedPhotos.map((imgUrl, i) => (
                  <div 
                    key={i}
                    onClick={() => setZoomedImg(imgUrl)}
                    className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-900 cursor-zoom-in group shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Attached photo ${i + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Player Banner (Highlight) */}
          <div className="my-4 p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-red-200">
              <Volume2 className="w-4 h-4 text-red-600 animate-bounce" />
              <span>ऑडियो बुलेटिन: क्या आप इस खबर को सुनना चाहते हैं?</span>
            </div>
            <button
              onClick={() => onPlayTTS(article)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
            >
              {isPlayingAudio ? 'रोकें' : 'खबर सुनें'}
            </button>
          </div>

          {/* Content Text: Live Feed vs Custom Local News */}
          {article.isLiveFeed || article.originalUrl ? (
            <div className="mt-6 space-y-6">
              <p className={`text-gray-800 dark:text-gray-200 font-hindi leading-relaxed ${fontClasses[fontSizeLevel]}`}>
                {article.summaryHi || article.summaryEn || content}
              </p>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white font-hindi">
                    यह समाचार {article.sourceName || 'मूल स्रोत'} द्वारा रिपोर्ट किया गया है
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    विस्तृत रिपोर्ट एवं संपूर्ण विश्लेषण पढ़ने के लिए मूल स्रोत पर जाएं।
                  </p>
                </div>
                {article.originalUrl && (
                  <a
                    href={article.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 shrink-0"
                  >
                    <span>मूल स्रोत पर पूरी खबर पढ़ें</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed font-hindi">
                * अस्वीकरण: समस्त बौद्धिक संपदा अधिकार मूल प्रकाशक ({article.sourceName || 'मूल स्रोत'}) के पास सुरक्षित हैं।
              </p>
            </div>
          ) : (
            <div className={`mt-6 text-gray-800 dark:text-gray-200 font-hindi whitespace-pre-line ${fontClasses[fontSizeLevel]}`}>
              {content}
            </div>
          )}

          {/* In-Article Advertisement Card */}
          {ad && <AdvertisementCard ad={ad} layout="article" />}

          {/* Bottom Complete Social Share Box */}
          <div className="mt-8 p-5 bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl text-white shadow-xl border border-gray-800 space-y-4">
            <div>
              <h4 className="font-black text-base sm:text-lg font-hindi text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-red-500" />
                <span>यह खबर सोशल मीडिया पर तुरंत शेयर करें:</span>
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                ब्यावर व राजस्थान की निष्पक्ष व सटीक पत्रकारिता को आगे बढ़ाने हेतु अपने मित्रों, पेज व ग्रुप्स में साझा करें।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              {/* 1. WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl shadow transition active:scale-95"
              >
                <span>WhatsApp पर भेजें</span>
              </button>

              {/* 2. Facebook Post (Personal Timeline) */}
              <button
                onClick={handleFacebookPersonalShare}
                className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl shadow transition active:scale-95"
              >
                <span>फेसबुक पोस्ट (Personal)</span>
              </button>

              {/* 3. Facebook Page / Group */}
              <button
                onClick={handleFacebookPageShare}
                className="flex items-center justify-center gap-2 bg-[#0d59bf] hover:bg-[#0b4ca3] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl shadow transition active:scale-95"
              >
                <span>फेसबुक पेज / ग्रुप</span>
              </button>

              {/* 4. Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl border border-gray-700 transition active:scale-95"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'वेब लिंक कॉपी करें'}</span>
              </button>
            </div>
          </div>

          {/* RELATED STORIES */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-base font-bold font-hindi text-gray-900 dark:text-white mb-4">
                संबंधित अन्य खबरें (Related News)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition flex gap-3"
                  >
                    <img
                      src={rel.image}
                      alt={rel.titleHi}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {lang === 'hi' ? rel.titleHi : (rel.titleEn || rel.titleHi)}
                      </h5>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {rel.readTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FULLSCREEN PHOTO ZOOM OVERLAY */}
        {zoomedImg && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-6 cursor-zoom-out backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setZoomedImg(null)}
          >
            <img 
              src={zoomedImg} 
              alt="Zoomed" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
            />
            <button 
              type="button" 
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition flex items-center gap-1.5 text-xs font-bold"
              onClick={() => setZoomedImg(null)}
            >
              <X className="w-4 h-4" />
              <span>बंद करें (Close)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
