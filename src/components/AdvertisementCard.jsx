import React from 'react';
import { PhoneCall, MessageCircle, MapPin, Globe } from 'lucide-react';
import { StorageService } from '../services/storage';

export default function AdvertisementCard({ ad = null, layout = 'banner' }) {
  // If no custom ad provided, or if ad is hidden/expired, render nothing (no default dummy banner)
  if (!ad || ad.isHidden || ad.isExpired) {
    return null;
  }

  // Parse all action buttons
  const actions = Array.isArray(ad.actions) && ad.actions.length > 0
    ? ad.actions
    : (ad.actionType && ad.actionTarget ? [{ type: ad.actionType, target: ad.actionTarget }] : []);

  const handleAction = (e, act) => {
    e.stopPropagation();
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

  const renderActionButtons = (size = 'normal') => {
    if (actions.length === 0) return null;

    const btnPadding = size === 'small' ? 'px-2.5 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs';

    return (
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((act, idx) => {
          if (!act.target) return null;

          if (act.type === 'call') {
            return (
              <button
                key={idx}
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>कॉल करें</span>
              </button>
            );
          } else if (act.type === 'whatsapp') {
            return (
              <button
                key={idx}
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>व्हाट्सएप</span>
              </button>
            );
          } else if (act.type === 'maps') {
            return (
              <button
                key={idx}
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>लोकेशन देखें</span>
              </button>
            );
          } else if (act.type === 'website') {
            return (
              <button
                key={idx}
                onClick={(e) => handleAction(e, act)}
                className={`inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 shrink-0 ${btnPadding}`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>वेबसाइट देखें</span>
              </button>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // 1. TOP / BELOW MAIN NEWS BANNER LAYOUT
  if (layout === 'banner') {
    const isPoster = ad.displayStyle === 'poster' || (!ad.displayStyle && Boolean(ad.mediaUrl));

    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 my-6">
        <div className="bg-gradient-to-r from-red-950 via-gray-900 to-black rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-red-500/30 overflow-hidden">
          
          {/* Top Label */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-widest shadow">
                विशेष विज्ञापन
              </span>
              <span className="text-xs font-bold text-gray-300 font-hindi">
                {ad.businessName}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              आर्यन न्यूज़ विज्ञापन पार्टनर
            </span>
          </div>

          {/* Ad Content */}
          <div className={`flex flex-col ${isPoster ? 'items-center' : 'sm:flex-row sm:items-center'} justify-between gap-5`}>
            
            {/* Media (Full A4 Poster / Flyer / Video or Banner) */}
            {ad.mediaUrl && (
              <div className={`w-full ${isPoster ? 'max-w-2xl' : 'sm:w-64 shrink-0'} flex justify-center bg-black/40 rounded-2xl p-2 border border-white/10 overflow-hidden`}>
                {ad.mediaType === 'video' ? (
                  <video
                    src={ad.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-lg"
                  />
                ) : (
                  <img
                    src={ad.mediaUrl}
                    alt={ad.businessName}
                    className="max-h-[550px] w-auto max-w-full rounded-xl object-contain shadow-lg hover:scale-[1.01] transition duration-300"
                  />
                )}
              </div>
            )}

            {/* Details & Actions */}
            <div className="flex-1 w-full flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black font-hindi text-white">
                  {ad.businessName}
                </h3>
                {ad.about && (
                  <p className="text-xs sm:text-sm text-gray-200 font-hindi mt-2 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                    {ad.about}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-start gap-2">
                {renderActionButtons('normal')}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. IN-FEED CARD LAYOUT (Inside News Grid)
  if (layout === 'feed') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 border-2 border-red-500/30 shadow-lg flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded tracking-widest uppercase shadow">
            विज्ञापन
          </span>
        </div>

        <div>
          {/* Full Poster / Flyer support without cropping */}
          {ad.mediaUrl && (
            <div className="w-full mb-3.5 rounded-2xl overflow-hidden bg-slate-900/5 dark:bg-black/40 border border-gray-100 dark:border-gray-800 p-1 flex items-center justify-center">
              {ad.mediaType === 'video' ? (
                <video
                  src={ad.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[500px] w-auto max-w-full rounded-xl object-contain"
                />
              ) : (
                <img
                  src={ad.mediaUrl}
                  alt={ad.businessName}
                  className="max-h-[500px] w-auto max-w-full rounded-xl object-contain group-hover:scale-[1.01] transition duration-300"
                />
              )}
            </div>
          )}

          <h3 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white">
            {ad.businessName}
          </h3>

          {ad.about && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-hindi mt-2 line-clamp-4 leading-relaxed">
              {ad.about}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
            <span>स्थानीय व्यावसायिक प्रचार</span>
            <span>ब्यावर</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {renderActionButtons('normal')}
          </div>
        </div>
      </div>
    );
  }

  // 3. INSIDE ARTICLE LAYOUT
  return (
    <div className="my-8 p-4 sm:p-6 rounded-3xl bg-amber-50/70 dark:bg-gray-850 border-2 border-amber-300 dark:border-gray-700 shadow-md">
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
          <div className="w-full flex justify-center bg-black/5 dark:bg-black/30 p-2 rounded-2xl border border-amber-200/50 dark:border-gray-700">
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
                className="max-h-[550px] w-auto max-w-full rounded-xl object-contain shadow"
              />
            )}
          </div>
        )}

        <div className="w-full text-center">
          <h4 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white">
            {ad.businessName}
          </h4>
          {ad.about && (
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-hindi mt-1.5 max-w-xl mx-auto leading-relaxed">
              {ad.about}
            </p>
          )}
        </div>

        <div className="pt-2 w-full flex justify-center">
          {renderActionButtons('normal')}
        </div>
      </div>
    </div>
  );
}
