import React, { useState } from 'react';
import { PhoneCall, MessageCircle, MapPin, Globe, Maximize2, X, ExternalLink, Share2, Copy, Check, Send } from 'lucide-react';
import { StorageService } from '../services/storage';

function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function AdvertisementCard({ ad = null, layout = 'banner' }) {
  const [zoomedMedia, setZoomedMedia] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

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

  // --- SHARE FUNCTIONALITY ---
  const getAdShareUrl = () => {
    return `https://www.aryannewsagency.com/ad/${encodeURIComponent(ad.id || 'special')}`;
  };

  const getAdShareText = () => {
    const contactParts = [];
    if (actions.length > 0) {
      actions.forEach(a => {
        if (a.type === 'whatsapp') contactParts.push(`💬 WhatsApp: ${a.target}`);
        else if (a.type === 'call') contactParts.push(`📞 Phone: ${a.target}`);
        else if (a.type === 'website') contactParts.push(`🌐 Website: ${a.target}`);
        else if (a.type === 'maps') contactParts.push(`📍 Map: ${a.target}`);
      });
    }

    const contactStr = contactParts.length > 0 ? `\n\n${contactParts.join('\n')}` : '';
    const shareUrl = getAdShareUrl();

    return `📢 *विशेष विज्ञापन | Aryan News Agency*\n\n🏢 *${ad.businessName}*\n${ad.about || ''}${contactStr}\n\n👉 पूरा विज्ञापन एवं पोस्टर यहाँ देखें:\n${shareUrl}\n\n#AryanNewsAgency #BeawarNews #Advertisement #Rajasthan`;
  };

  const handleWhatsAppAdShare = (e) => {
    if (e) e.stopPropagation();
    const text = getAdShareText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebookPersonalAdShare = (e) => {
    if (e) e.stopPropagation();
    const text = getAdShareText();
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {}
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getAdShareUrl())}`;
    window.open(fbUrl, '_blank', 'width=620,height=580,scrollbars=yes,resizable=yes');
  };

  const handleFacebookPageAdShare = (e) => {
    if (e) e.stopPropagation();
    const text = getAdShareText();
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {}
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getAdShareUrl())}`;
    window.open(fbUrl, '_blank', 'width=620,height=580,scrollbars=yes,resizable=yes');
  };

  const handleCopyAdLink = (e) => {
    if (e) e.stopPropagation();
    const text = getAdShareText();
    try {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (err) {
      prompt('विज्ञापन लिंक कॉपी करें:', getAdShareUrl());
    }
  };

  const handleNativeShare = async (e) => {
    if (e) e.stopPropagation();
    const text = getAdShareText();
    const url = getAdShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${ad.businessName} - विशेष विज्ञापन | आर्यन न्यूज़ एजेंसी`,
          text: text,
          url: url
        });
      } catch (err) {
        // User cancelled or dismissed
      }
    } else {
      handleCopyAdLink(e);
    }
  };

  const renderActionButtons = (size = 'normal') => {
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

        {/* Dedicated Share Advertisement Button */}
        <button
          type="button"
          onClick={(e) => {
            if (e) e.stopPropagation();
            setIsShareOpen(true);
          }}
          className={`inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
          title="विज्ञापन शेयर करें"
        >
          <Share2 className="w-4 h-4 text-white" />
          <span>शेयर करें (Share)</span>
        </button>
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
              onClick={(e) => {
                if (e) e.stopPropagation();
                setIsShareOpen(true);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white p-2 sm:px-4 sm:py-2 rounded-full font-bold text-xs shadow-lg transition flex items-center gap-1.5 border border-white/20"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">शेयर करें</span>
            </button>

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

  // Dedicated Advertisement Share Modal Dialog
  const renderShareModal = () => {
    if (!isShareOpen) return null;

    const shareUrl = getAdShareUrl();

    return (
      <div 
        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        onClick={() => setIsShareOpen(false)}
      >
        <div 
          className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-5 animate-in zoom-in-95 duration-150 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-xl">
                <Share2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-hindi text-gray-950 dark:text-white">
                  📢 विज्ञापन शेयर करें (Share Advertisement)
                </h3>
                <p className="text-[11px] text-gray-500">
                  सोशल मीडिया, व्हाट्सएप और अन्य ऐप्स पर ज्यादा से ज्यादा ग्राहकों तक पहुँचाएँ
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsShareOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ad Mini Preview */}
          <div className="bg-gray-50 dark:bg-gray-850 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            {ad.mediaUrl ? (
              ad.mediaType === 'video' ? (
                <video src={ad.mediaUrl} className="w-16 h-16 rounded-xl object-cover border bg-black shrink-0" muted />
              ) : (
                <img src={ad.mediaUrl} alt={ad.businessName} className="w-16 h-16 rounded-xl object-cover border shrink-0" />
              )
            ) : (
              <div className="w-16 h-16 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-2xl shrink-0 font-bold">
                📢
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">
                विज्ञापन
              </span>
              <h4 className="text-sm font-bold font-hindi text-gray-900 dark:text-white truncate mt-1">
                {ad.businessName}
              </h4>
              {ad.about && (
                <p className="text-xs text-gray-500 line-clamp-1 font-hindi mt-0.5">
                  {ad.about}
                </p>
              )}
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. WhatsApp Share */}
            <button
              type="button"
              onClick={handleWhatsAppAdShare}
              className="flex items-center gap-3 p-3.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 transition text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold font-hindi">व्हाट्सएप पर भेजें</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">WhatsApp Chat & Groups</div>
              </div>
            </button>

            {/* 2. Facebook Post / Story */}
            <button
              type="button"
              onClick={handleFacebookPersonalAdShare}
              className="flex items-center gap-3 p-3.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-300 dark:border-blue-800 rounded-2xl text-blue-900 dark:text-blue-200 transition text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <FacebookIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold font-hindi">फेसबुक पोस्ट / स्टोरी</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">Share on FB Timeline</div>
              </div>
            </button>

            {/* 3. Facebook Page / Group */}
            <button
              type="button"
              onClick={handleFacebookPageAdShare}
              className="flex items-center gap-3 p-3.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-800 rounded-2xl text-indigo-900 dark:text-indigo-200 transition text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold font-hindi">फेसबुक पेज / ग्रुप</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Page & Business Groups</div>
              </div>
            </button>

            {/* 4. Native / All Apps Share */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center gap-3 p-3.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 border border-purple-300 dark:border-purple-800 rounded-2xl text-purple-900 dark:text-purple-200 transition text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold font-hindi">अन्य सभी ऐप्स</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">Instagram, Telegram, SMS</div>
              </div>
            </button>
          </div>

          {/* Copy Link & Details Box */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-gray-700 dark:text-gray-300 outline-none px-2 font-mono truncate"
              />
              <button
                type="button"
                onClick={handleCopyAdLink}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                  copiedToast
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow'
                }`}
              >
                {copiedToast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToast ? 'कॉपी हो गया!' : 'कॉपी करें'}</span>
              </button>
            </div>
            {copiedToast && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold text-center mt-2 animate-in fade-in">
                ✅ विज्ञापन का पूरा विवरण और लिंक क्लिपबोर्ड पर कॉपी हो चुका है!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 1. TOP / BELOW MAIN NEWS BANNER LAYOUT (Modern Compact Magazine Showcase)
  if (layout === 'banner') {
    return (
      <div id={`ad-${ad.id}`} className="max-w-7xl mx-auto px-3 sm:px-6 my-4 sm:my-5 scroll-mt-24">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 lg:p-6 border-2 border-red-500/30 dark:border-red-500/40 shadow-lg relative overflow-hidden group">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2.5 mb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                <span>📢</span>
                <span>विशेष प्रायोजित विज्ञापन</span>
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">
                ब्यावर स्थानीय व्यापार एवं प्रतिष्ठान
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareOpen(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                title="विज्ञापन शेयर करें"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>शेयर करें</span>
              </button>
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 dark:text-gray-500 hidden sm:inline">
                आर्यन न्यूज़ विज्ञापन नेटवर्क
              </span>
            </div>
          </div>

          {/* Body: Balanced Compact Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-center">
            
            {/* Poster / Flyer Showcase */}
            {ad.mediaUrl && (
              <div className="md:col-span-4 lg:col-span-4 flex items-center justify-center">
                <div 
                  onClick={() => setZoomedMedia(ad.mediaUrl)}
                  className="relative w-fit max-w-full mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center cursor-zoom-in group/poster hover:border-red-500 transition-all duration-300 bg-black/5 dark:bg-black/30"
                >
                  {ad.mediaType === 'video' ? (
                    <video
                      src={ad.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="block w-auto max-h-[340px] sm:max-h-[360px] object-contain"
                    />
                  ) : (
                    <img
                      src={ad.mediaUrl}
                      alt={ad.businessName}
                      className="block w-auto max-h-[340px] sm:max-h-[360px] object-contain group-hover/poster:scale-[1.02] transition-transform duration-300"
                    />
                  )}

                  {/* Zoom Badge Overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/80 hover:bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1 transition-all opacity-90 group-hover/poster:opacity-100 whitespace-nowrap border border-white/20">
                    <Maximize2 className="w-3 h-3 text-amber-300" />
                    <span>ज़ूम पोस्टर (Zoom)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info & Action Column */}
            <div className={`${ad.mediaUrl ? 'md:col-span-8 lg:col-span-8' : 'md:col-span-12'} flex flex-col justify-between space-y-3.5`}>
              
              <div 
                onClick={handleCardOrTextClick} 
                className="cursor-pointer space-y-2 group/text"
                title={ad.mediaUrl ? "बड़ा पोस्टर देखने हेतु क्लिक करें" : "विज्ञापन विवरण"}
              >
                <div className="inline-block bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                  ✨ विशेष ऑफर एवं प्रतिष्ठान
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black font-hindi text-gray-950 dark:text-white leading-snug group-hover/text:text-red-600 dark:group-hover/text-red-400 transition-colors">
                  {ad.businessName}
                </h3>

                {ad.about && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 dark:bg-gray-800/80 border border-amber-200 dark:border-gray-700 text-xs sm:text-sm font-hindi text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line shadow-sm max-h-[200px] overflow-y-auto pr-2">
                    {ad.about}
                  </div>
                )}
              </div>

              {/* Call-to-action buttons */}
              <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800">
                <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  सीधा संपर्क एवं शेयर करें:
                </div>
                {renderActionButtons('normal')}
              </div>

            </div>

          </div>

        </div>

        {/* Lightbox Modal */}
        {renderZoomModal()}
        {/* Share Modal */}
        {renderShareModal()}
      </div>
    );
  }

  // 2. IN-FEED CARD LAYOUT (Inside News Grid)
  if (layout === 'feed') {
    return (
      <div id={`ad-${ad.id}`} className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 border-2 border-red-500/30 shadow-lg flex flex-col justify-between relative overflow-hidden group scroll-mt-24">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100 dark:border-gray-800">
          <span className="bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest shadow">
            विज्ञापन
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
              }}
              className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <Share2 className="w-3 h-3" />
              <span>शेयर</span>
            </button>
            <span className="text-[10px] text-gray-400">
              लोकल प्रचार
            </span>
          </div>
        </div>

        <div>
          {/* Full Poster / Flyer support with zoom click */}
          {ad.mediaUrl && (
            <div className="flex justify-center mb-2.5">
              <div 
                onClick={() => setZoomedMedia(ad.mediaUrl)}
                className="relative w-fit max-w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm cursor-zoom-in group/feedposter hover:border-red-500 transition bg-black/5 dark:bg-black/30"
              >
                {ad.mediaType === 'video' ? (
                  <video
                    src={ad.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="block max-h-[300px] w-auto object-contain"
                  />
                ) : (
                  <img
                    src={ad.mediaUrl}
                    alt={ad.businessName}
                    className="block max-h-[300px] w-auto object-contain group-hover/feedposter:scale-[1.01] transition duration-300"
                  />
                )}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow flex items-center gap-1 border border-white/20 whitespace-nowrap">
                  <Maximize2 className="w-3 h-3 text-amber-300" />
                  <span>ज़ूम करें</span>
                </div>
              </div>
            </div>
          )}

          <h3 
            onClick={handleCardOrTextClick}
            className="text-base font-black font-hindi text-gray-900 dark:text-white cursor-pointer hover:text-red-600 transition"
          >
            {ad.businessName}
          </h3>

          {ad.about && (
            <div 
              onClick={handleCardOrTextClick}
              className="text-xs text-gray-600 dark:text-gray-300 font-hindi mt-1.5 leading-relaxed bg-gray-50 dark:bg-gray-850/60 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 whitespace-pre-line cursor-pointer max-h-[140px] overflow-y-auto"
            >
              {ad.about}
            </div>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
          {renderActionButtons('normal')}
        </div>

        {renderZoomModal()}
        {renderShareModal()}
      </div>
    );
  }

  // 3. INSIDE ARTICLE LAYOUT
  return (
    <div id={`ad-${ad.id}`} className="my-5 p-4 sm:p-5 rounded-3xl bg-amber-50/70 dark:bg-gray-850 border-2 border-amber-300 dark:border-gray-700 shadow-md max-w-2xl mx-auto scroll-mt-24">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-amber-200 dark:border-gray-700">
        <span className="bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider">
          विशेष विज्ञापन
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" />
            <span>शेयर</span>
          </button>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-hindi">
            आर्यन न्यूज़ विज्ञापन
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3.5">
        {ad.mediaUrl && (
          <div className="w-full flex justify-center">
            <div 
              onClick={() => setZoomedMedia(ad.mediaUrl)}
              className="relative w-fit max-w-full rounded-2xl overflow-hidden border border-amber-200 dark:border-gray-700 shadow-sm cursor-zoom-in hover:border-red-500 transition group/artposter bg-black/5 dark:bg-black/30"
            >
              {ad.mediaType === 'video' ? (
                <video
                  src={ad.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block max-h-[320px] w-auto object-contain"
                />
              ) : (
                <img
                  src={ad.mediaUrl}
                  alt={ad.businessName}
                  className="block max-h-[320px] w-auto object-contain group-hover/artposter:scale-[1.01] transition duration-300"
                />
              )}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow flex items-center gap-1 border border-white/20 whitespace-nowrap">
                <Maximize2 className="w-3 h-3 text-amber-300" />
                <span>बड़ा देखने हेतु क्लिक करें</span>
              </div>
            </div>
          </div>
        )}

        <div 
          onClick={handleCardOrTextClick}
          className="w-full text-center cursor-pointer"
        >
          <h4 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white hover:text-red-600 transition">
            {ad.businessName}
          </h4>
          {ad.about && (
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-hindi mt-1.5 max-w-lg mx-auto leading-relaxed whitespace-pre-line text-left bg-amber-100/50 dark:bg-gray-800/60 p-3 rounded-xl border border-amber-200 dark:border-gray-700 max-h-[160px] overflow-y-auto">
              {ad.about}
            </div>
          )}
        </div>

        <div className="pt-1.5 w-full flex justify-center">
          {renderActionButtons('normal')}
        </div>
      </div>

      {renderZoomModal()}
      {renderShareModal()}
    </div>
  );
}
