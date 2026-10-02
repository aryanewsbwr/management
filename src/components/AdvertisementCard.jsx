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

  // 1. TOP / BELOW MAIN NEWS BANNER LAYOUT (Modern Split Magazine Card)
  if (layout === 'banner') {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 my-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 border-2 border-red-500/20 dark:border-red-500/30 shadow-xl relative overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                <span>📢</span>
                <span>विशेष प्रायोजित विज्ञापन</span>
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">
                ब्यावर स्थानीय व्यापार
              </span>
            </div>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              आर्यन न्यूज़ विज्ञापन नेटवर्क
            </span>
          </div>

          {/* Body: Split Grid on Desktop / Clean Stacked on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* Poster / Flyer Showcase */}
            {ad.mediaUrl && (
              <div className="md:col-span-5 flex justify-center">
                <div className="w-full max-w-[340px] bg-slate-50 dark:bg-black/40 rounded-2xl p-2 border border-gray-200/80 dark:border-gray-800 shadow-inner flex items-center justify-center overflow-hidden">
                  {ad.mediaType === 'video' ? (
                    <video
                      src={ad.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-h-[420px] w-auto max-w-full rounded-xl object-contain shadow"
                    />
                  ) : (
                    <img
                      src={ad.mediaUrl}
                      alt={ad.businessName}
                      className="max-h-[420px] w-auto max-w-full rounded-xl object-contain shadow hover:scale-[1.02] transition duration-300"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Info & Action Column */}
            <div className={`${ad.mediaUrl ? 'md:col-span-7' : 'md:col-span-12'} flex flex-col justify-between space-y-4`}>
              
              <div>
                <div className="inline-block bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1.5 border border-red-200 dark:border-red-900">
                  ✨ विशेष ऑफर एवं प्रतिष्ठान
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-hindi text-gray-900 dark:text-white leading-tight">
                  {ad.businessName}
                </h3>

                {ad.about && (
                  <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-gray-800/70 border border-amber-200/70 dark:border-gray-700 text-xs sm:text-sm font-hindi text-gray-800 dark:text-gray-200 leading-relaxed">
                    {ad.about}
                  </div>
                )}
              </div>

              {/* Call-to-action buttons */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  सीधा संपर्क करें (Quick Connect):
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {renderActionButtons('normal')}
                </div>
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
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-widest shadow">
            विज्ञापन
          </span>
          <span className="text-[10px] text-gray-400">
            लोकल प्रचार
          </span>
        </div>

        <div>
          {/* Full Poster / Flyer support without cropping */}
          {ad.mediaUrl && (
            <div className="w-full mb-3 rounded-2xl overflow-hidden bg-slate-50 dark:bg-black/40 border border-gray-100 dark:border-gray-800 p-1.5 flex items-center justify-center">
              {ad.mediaType === 'video' ? (
                <video
                  src={ad.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[440px] w-auto max-w-full rounded-xl object-contain shadow-sm"
                />
              ) : (
                <img
                  src={ad.mediaUrl}
                  alt={ad.businessName}
                  className="max-h-[440px] w-auto max-w-full rounded-xl object-contain shadow-sm group-hover:scale-[1.01] transition duration-300"
                />
              )}
            </div>
          )}

          <h3 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white">
            {ad.businessName}
          </h3>

          {ad.about && (
            <p className="text-xs text-gray-600 dark:text-gray-300 font-hindi mt-2 line-clamp-3 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
              {ad.about}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {renderActionButtons('normal')}
          </div>
        </div>
      </div>
    );
  }

  // 3. INSIDE ARTICLE LAYOUT
  return (
    <div className="my-6 p-4 sm:p-5 rounded-3xl bg-amber-50/70 dark:bg-gray-850 border-2 border-amber-300 dark:border-gray-700 shadow-md max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200 dark:border-gray-700">
        <span className="bg-red-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider">
          विशेष विज्ञापन
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-hindi">
          आर्यन न्यूज़ स्थानीय विज्ञापन सेवा
        </span>
      </div>

      <div className="flex flex-col items-center gap-3.5">
        {ad.mediaUrl && (
          <div className="w-full flex justify-center bg-white/80 dark:bg-black/30 p-2 rounded-2xl border border-amber-200/50 dark:border-gray-700 shadow-sm">
            {ad.mediaType === 'video' ? (
              <video
                src={ad.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="max-h-[440px] w-auto max-w-full rounded-xl object-contain shadow"
              />
            ) : (
              <img
                src={ad.mediaUrl}
                alt={ad.businessName}
                className="max-h-[440px] w-auto max-w-full rounded-xl object-contain shadow"
              />
            )}
          </div>
        )}

        <div className="w-full text-center">
          <h4 className="text-base sm:text-lg font-black font-hindi text-gray-900 dark:text-white">
            {ad.businessName}
          </h4>
          {ad.about && (
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-hindi mt-1.5 max-w-lg mx-auto leading-relaxed">
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
