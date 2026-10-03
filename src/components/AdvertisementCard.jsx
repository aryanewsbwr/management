import React, { useState } from 'react';
import { PhoneCall, MessageCircle, MapPin, Globe, Maximize2, X, ExternalLink } from 'lucide-react';
import { StorageService } from '../services/storage';

export default function AdvertisementCard({ ad = null, layout = 'banner' }) {
  const [zoomedMedia, setZoomedMedia] = useState(null);

  // If no custom ad provided, or if ad is hidden/expired, render nothing (no default dummy banner)
  if (!ad || ad.isHidden || ad.isExpired) {
    return null;
  }

  // Parse all action buttons
  const actions = Array.isArray(ad.actions) && ad.actions.length > 0
    ? ad.actions
    : (ad.actionType && ad.actionTarget ? [{ type: ad.actionType, target: ad.actionTarget }] : []);

  const handleAction = (e, act) => {
    if (e) e.stopPropagation();
    // Track click analytics in background
    if (ad.id) {
      StorageService.incrementAdClick(ad.id);
    }

    const target = act.target || '';
    if (act.type === 'call') {
      window.location.href = `tel:${target.replace(/[^0-9+]/g, '')}`;
    } else if (act.type === 'whatsapp') {
      const cleanPhone = target.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(`नमस्ते ${ad.businessName}, मैंने आर्यन न्यूज़ एजेंसी पर आपका विज्ञापन देखा और इस संबंध में जानकारी चाहिए।`);
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    } else if (act.type === 'maps') {
      const url = target.startsWith('http') ? target : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`;
      window.open(url, '_blank');
    } else {
      // Website URL
      const url = target.startsWith('http') ? target : `https://${target}`;
      window.open(url, '_blank');
    }
  };

  const handleCardOrTextClick = (e) => {
    // If ad has media, open the zoom lightbox
    if (ad.mediaUrl) {
      setZoomedMedia(ad.mediaUrl);
    } else if (actions.length > 0) {
      // Otherwise open primary action
      handleAction(e, actions[0]);
    }
  };

  const renderActionButtons = (size = 'normal') => {
    if (actions.length === 0) return null;

    const btnPadding = size === 'small' ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2.5 text-xs sm:text-sm';

    return (
      <div className="flex flex-wrap items-center gap-2.5">
        {actions.map((act, idx) => {
          if (!act.target) return null;

          if (act.type === 'call') {
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
                title="कॉल करें"
              >
                <PhoneCall className="w-4 h-4" />
                <span>कॉल करें</span>
              </button>
            );
          } else if (act.type === 'whatsapp') {
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
                title="व्हाट्सएप पर चैट करें"
              >
                <MessageCircle className="w-4 h-4" />
                <span>व्हाट्सएप</span>
              </button>
            );
          } else if (act.type === 'maps') {
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
                title="गूगल मैप्स लोकेशन देखें"
              >
                <MapPin className="w-4 h-4" />
                <span>लोकेशन देखें</span>
              </button>
            );
          } else if (act.type === 'website') {
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
                title="वेबसाइट पर जाएं"
              >
                <Globe className="w-4 h-4" />
                <span>वेबसाइट देखें</span>
                <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
              </button>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Fullscreen Zoom Lightbox Modal
  const renderZoomModal = () => {
    if (!zoomedMedia) return null;

    return (
      <div 
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 cursor-zoom-out animate-in fade-in duration-200"
        onClick={() => setZoomedMedia(null)}
      >
        <div className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center justify-center">
          {ad.mediaType === 'video' ? (
            <video 
              src={zoomedMedia} 
              controls 
              autoPlay 
              playsInline 
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain bg-black"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img 
              src={zoomedMedia} 
              alt={ad.businessName} 
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Top Control Bar */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomedMedia(null)}
              className="bg-black/70 hover:bg-red-600 text-white p-2 sm:px-4 sm:py-2 rounded-full font-bold text-xs shadow-lg transition flex items-center gap-1.5 border border-white/20"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">बंद करें (Close)</span>
            </button>
          </div>

          {/* Bottom Actions inside Lightbox */}
          <div 
            className="mt-4 bg-gray-900/90 border border-gray-700 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-3 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-bold text-white font-hindi hidden md:inline">
              {ad.businessName}
            </span>
            {renderActionButtons('small')}
          </div>
        </div>
      </div>
    );
  };

  // 1. TOP / BELOW MAIN NEWS BANNER LAYOUT (Modern Magazine Showcase)
  if (layout === 'banner') {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 my-6 sm:my-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-red-500/30 dark:border-red-500/40 shadow-xl relative overflow-hidden group">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                <span>📢</span>
                <span>विशेष प्रायोजित विज्ञापन</span>
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">
                ब्यावर स्थानीय व्यापार एवं प्रतिष्ठान
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 dark:text-gray-500">
              आर्यन न्यूज़ विज्ञापन नेटवर्क
            </span>
          </div>

          {/* Body: Generous Balanced Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* Poster / Flyer Showcase (Generous Sizing with Click-To-Zoom) */}
            {ad.mediaUrl && (
              <div className="md:col-span-5 lg:col-span-5 flex flex-col items-center justify-center">
                <div 
                  onClick={() => setZoomedMedia(ad.mediaUrl)}
                  className="relative w-full bg-slate-50 dark:bg-black/50 rounded-2xl p-2.5 sm:p-3 border-2 border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center overflow-hidden cursor-zoom-in group/poster hover:border-red-500 transition-all duration-300"
                >
                  {ad.mediaType === 'video' ? (
                    <video
                      src={ad.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full max-h-[580px] rounded-xl object-contain shadow"
                    />
                  ) : (
                    <img
                      src={ad.mediaUrl}
                      alt={ad.businessName}
                      className="w-full max-h-[580px] rounded-xl object-contain shadow group-hover/poster:scale-[1.02] transition-transform duration-300"
                    />
                  )}

                  {/* Zoom Badge Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/75 hover:bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all opacity-90 group-hover/poster:opacity-100 whitespace-nowrap border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>बड़ा पोस्टर देखने हेतु क्लिक करें (Zoom)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info & Action Column */}
            <div className={`${ad.mediaUrl ? 'md:col-span-7 lg:col-span-7' : 'md:col-span-12'} flex flex-col justify-between space-y-5`}>
              
              <div 
                onClick={handleCardOrTextClick} 
                className="cursor-pointer space-y-3 group/text"
                title={ad.mediaUrl ? "बड़ा पोस्टर देखने हेतु क्लिक करें" : "विज्ञापन विवरण"}
              >
                <div className="inline-block bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                  ✨ विशेष ऑफर एवं प्रतिष्ठान
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-hindi text-gray-950 dark:text-white leading-tight group-hover/text:text-red-600 dark:group-hover/text-red-400 transition-colors">
                  {ad.businessName}
                </h3>

                {ad.about && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-gray-800/80 border border-amber-200 dark:border-gray-700 text-sm sm:text-base font-hindi text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line shadow-sm hover:border-amber-400 dark:hover:border-gray-600 transition-colors">
                    {ad.about}
                  </div>
                )}
              </div>

              {/* Call-to-action buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">
                  सीधा संपर्क करें (QUICK CONNECT):
                </div>
                {renderActionButtons('normal')}
              </div>

            </div>

          </div>

        </div>

        {/* Lightbox Modal */}
        {renderZoomModal()}
      </div>
    );
  }

  // 2. IN-FEED CARD LAYOUT (Inside News Grid)
  if (layout === 'feed') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 border-2 border-red-500/30 shadow-lg flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest shadow">
            विज्ञापन
          </span>
          <span className="text-[10px] text-gray-400">
            लोकल प्रचार
          </span>
        </div>

        <div>
          {/* Full Poster / Flyer support with zoom click */}
          {ad.mediaUrl && (
            <div 
              onClick={() => setZoomedMedia(ad.mediaUrl)}
              className="relative w-full mb-3 rounded-2xl overflow-hidden bg-slate-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center cursor-zoom-in group/feedposter hover:border-red-500 transition"
            >
              {ad.mediaType === 'video' ? (
                <video
                  src={ad.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-sm"
                />
              ) : (
                <img
                  src={ad.mediaUrl}
                  alt={ad.businessName}
                  className="max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-sm group-hover/feedposter:scale-[1.01] transition duration-300"
                />
              )}
              <div className="absolute bottom-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow flex items-center gap-1 border border-white/20">
                <Maximize2 className="w-3 h-3 text-amber-300" />
                <span>ज़ूम करें (Click to Zoom)</span>
              </div>
            </div>
          )}

          <h3 
            onClick={handleCardOrTextClick}
            className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white cursor-pointer hover:text-red-600 transition"
          >
            {ad.businessName}
          </h3>

          {ad.about && (
            <div 
              onClick={handleCardOrTextClick}
              className="text-xs text-gray-600 dark:text-gray-300 font-hindi mt-2 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800 whitespace-pre-line cursor-pointer"
            >
              {ad.about}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2.5">
          {renderActionButtons('normal')}
        </div>

        {renderZoomModal()}
      </div>
    );
  }

  // 3. INSIDE ARTICLE LAYOUT
  return (
    <div className="my-6 p-4 sm:p-6 rounded-3xl bg-amber-50/70 dark:bg-gray-850 border-2 border-amber-300 dark:border-gray-700 shadow-md max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200 dark:border-gray-700">
        <span className="bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider">
          विशेष विज्ञापन
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-hindi">
          आर्यन न्यूज़ स्थानीय विज्ञापन सेवा
        </span>
      </div>

      <div className="flex flex-col items-center gap-4">
        {ad.mediaUrl && (
          <div 
            onClick={() => setZoomedMedia(ad.mediaUrl)}
            className="relative w-full flex justify-center bg-white/80 dark:bg-black/30 p-2.5 rounded-2xl border border-amber-200/50 dark:border-gray-700 shadow-sm cursor-zoom-in hover:border-red-500 transition group/artposter"
          >
            {ad.mediaType === 'video' ? (
              <video
                src={ad.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow"
              />
            ) : (
              <img
                src={ad.mediaUrl}
                alt={ad.businessName}
                className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow group-hover/artposter:scale-[1.01] transition duration-300"
              />
            )}
            <div className="absolute bottom-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow flex items-center gap-1 border border-white/20">
              <Maximize2 className="w-3 h-3 text-amber-300" />
              <span>बड़ा देखने हेतु क्लिक करें</span>
            </div>
          </div>
        )}

        <div 
          onClick={handleCardOrTextClick}
          className="w-full text-center cursor-pointer"
        >
          <h4 className="text-lg sm:text-xl font-black font-hindi text-gray-900 dark:text-white hover:text-red-600 transition">
            {ad.businessName}
          </h4>
          {ad.about && (
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-hindi mt-2 max-w-lg mx-auto leading-relaxed whitespace-pre-line text-left bg-amber-100/50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-amber-200 dark:border-gray-700">
              {ad.about}
            </div>
          )}
        </div>

        <div className="pt-2 w-full flex justify-center">
          {renderActionButtons('normal')}
        </div>
      </div>

      {renderZoomModal()}
    </div>
  );
}
