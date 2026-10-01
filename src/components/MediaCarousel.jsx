import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Video, 
  Image as ImageIcon, Volume2, VolumeX, Maximize2 
} from 'lucide-react';

export default function MediaCarousel({
  images = [],
  videoUrl = null,
  mediaType = 'image',
  title = '',
  aspectRatio = 'aspect-[16/10]',
  autoPlayInterval = 3500,
  showControls = false, // true in Modal, false in Cards
  className = '',
  onOpen = null
}) {
  // Normalize images to an array of non-empty strings
  const imageList = Array.isArray(images) 
    ? images.filter(img => typeof img === 'string' && img.trim().length > 0)
    : (typeof images === 'string' && images.trim().length > 0 ? [images] : []);

  const hasMultipleImages = imageList.length > 1;
  const isVideo = mediaType === 'video' || Boolean(videoUrl);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const videoRef = useRef(null);

  // Auto-play timer for image carousel
  useEffect(() => {
    if (!hasMultipleImages || isVideo || !isPlaying || isHovered) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [hasMultipleImages, isVideo, isPlaying, isHovered, imageList.length, autoPlayInterval]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  let effectivePoster = imageList[0];
  if (!effectivePoster && videoUrl && videoUrl.includes('cloudinary.com')) {
    effectivePoster = videoUrl.replace(/\.(mp4|webm|mov|mkv)$/i, '.jpg');
  }

  // 1. VIDEO RENDERING
  if (isVideo && videoUrl) {
    if (showControls) {
      // Full Video Player inside Modal
      return (
        <div className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-lg ${className}`}>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={effectivePoster || undefined}
            controls
            autoPlay
            muted
            playsInline
            className="w-full h-auto max-h-[460px] object-contain mx-auto bg-black"
          />
          <div className="p-2.5 bg-gray-900 text-white text-xs flex items-center justify-between font-hindi border-t border-gray-800">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <Video className="w-4 h-4" />
              <span>वीडियो रिपोर्ट • आर्यन डिजिटल नेटवर्क (ब्यावर)</span>
            </span>
            <span className="text-[11px] text-gray-400">
              प्ले / पॉज व फुलस्क्रीन सपोर्ट
            </span>
          </div>
        </div>
      );
    }

    // Video Card Preview (Compact / Thumbnail in Card)
    return (
      <div 
        onClick={onOpen}
        className={`relative w-full overflow-hidden bg-black group/video ${aspectRatio} ${className}`}
      >
        {effectivePoster ? (
          <img
            src={effectivePoster}
            alt={title}
            className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <video
            src={videoUrl}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Video Play Icon Badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover/video:scale-110 group-hover/video:bg-red-600 transition-all">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Bottom Video Badge */}
        <div className="absolute bottom-2 left-2 z-10 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Video className="w-3 h-3 text-red-500" />
          <span>वीडियो</span>
        </div>
      </div>
    );
  }

  // Fallback if no images provided
  if (imageList.length === 0) {
    const defaultPlaceholder = 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1000&auto=format&fit=crop&q=80';
    return (
      <div className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800 ${aspectRatio} ${className}`}>
        <img
          src={defaultPlaceholder}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // 2. SINGLE IMAGE RENDERING
  if (!hasMultipleImages) {
    return (
      <div className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800 ${aspectRatio} ${className}`}>
        <img
          src={imageList[0]}
          alt={title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1000&auto=format&fit=crop&q=80';
          }}
          onClick={(e) => { if (showControls) { e.stopPropagation(); setFullscreenImg(imageList[0]); } }} className={`w-full h-full object-cover transition-transform duration-500 `} loading="lazy" /> {fullscreenImg && ( <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-6 cursor-zoom-out backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setFullscreenImg(null); }}> <img src={fullscreenImg} alt="Zoomed preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" /> <button type="button" className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition"> <span className="font-bold px-3 py-1">? ??? ???? (Close)</span> </button> </div> )} </div> ); }

  // 3. MULTIPLE IMAGES AUTO-RUNNING CAROUSEL
  return (
    <div 
      className={`relative w-full overflow-hidden bg-gray-950 group/carousel select-none ${aspectRatio} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* In-flow spacer image so container never collapses to 0 height */}
      <img
        src={imageList[0]}
        alt=""
        className="w-full h-full object-cover invisible pointer-events-none select-none max-h-[500px]"
        aria-hidden="true"
      />

      {/* Direct Absolute Slides Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {imageList.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={imgUrl}
              alt={`${title} - फोटो ${idx + 1}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1000&auto=format&fit=crop&q=80';
              }}
              onClick={(e) => { if (showControls) { e.stopPropagation(); setFullscreenImg(imgUrl); } }} className={`w-full h-full object-cover ${showControls ? 'cursor-zoom-in' : ''}`} loading={idx === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* Top Right: Photos Counter Badge */}
      <div className="absolute top-2.5 right-2.5 z-20 bg-black/70 backdrop-blur-md text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-white/20">
        <ImageIcon className="w-3 h-3 text-amber-400" />
        <span>{currentIndex + 1} / {imageList.length} फोटो</span>
      </div>

      {/* Auto-play status pill on card hover */}
      {isHovered && !showControls && (
        <div className="absolute top-2.5 right-24 z-20 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-fade-in">
          रोक दिया गया (Paused)
        </div>
      )}

      {/* Navigation Arrows (Visible in Modal or on desktop hover) */}
      {(showControls || isHovered) && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-lg backdrop-blur-sm hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-lg backdrop-blur-sm hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Bottom Center: Pagination Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
        {showControls && (
          <button
            type="button"
            onClick={togglePlayPause}
            className="text-white hover:text-amber-400 pr-1 mr-0.5 border-r border-white/20 transition"
            title={isPlaying ? 'ऑटो-स्लाइड रोकें' : 'ऑटो-स्लाइड चालू करें'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          </button>
        )}
        
        {imageList.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => handleDotClick(e, idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'bg-amber-400 w-4 shadow-sm'
                : 'bg-white/60 hover:bg-white w-1.5'
            }`}
          />
        ))}
      </div>

      {/* Auto-Slide Progress Bar at the very bottom */}
      {isPlaying && !isHovered && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20 overflow-hidden">
          <div 
            key={currentIndex} 
            className="h-full bg-amber-400 animate-slide-progress origin-left"
            style={{ animationDuration: `${autoPlayInterval}ms` }}
          />
        </div>
      )}

      {/* Fullscreen Zoom Overlay */}
      {fullscreenImg && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-6 cursor-zoom-out backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenImg(null);
          }}
        >
          <img 
            src={fullscreenImg} 
            alt="Zoomed preview" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <button 
            type="button"
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition"
          >
            <span className="font-bold px-3 py-1">✕ बंद करें (Close)</span>
          </button>
        </div>
      )}
    </div>
  );
}


