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

  // 1. TOP WIDE BANNER LAYOUT
  if (layout === 'banner') {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 my-4">
        <div className="bg-gradient-to-r from-red-950 via-gray-900 to-black rounded-2xl p-3 sm:p-4 text-white shadow-lg border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            {ad.mediaUrl ? (
              ad.mediaType === 'video' ? (
                <video
                  src={ad.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-white/20"
                />
              ) : (
                <img
                  src={ad.mediaUrl}
                  alt={ad.businessName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-white/20"
                />
              )
            ) : (
              <div className="w-14 h-14 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-2xl shrink-0">
                📢
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">
                विज्ञापन
              </span>
              <h4 className="text-sm sm:text-base font-black font-hindi mt-1 text-white truncate">
                {ad.businessName}
              </h4>
              {ad.about && (
                <p className="text-xs text-gray-300 line-clamp-2 mt-0.5 font-hindi">
                  {ad.about}
                </p>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto flex justify-end">
            {renderActionButtons('normal')}
          </div>
        </div>
      </div>
    );
  }

  // 2. IN-FEED CARD LAYOUT (Looks native to news cards)
  if (layout === 'feed') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 border-2 border-red-500/30 shadow-md flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded tracking-widest uppercase shadow">
            विज्ञापन
          </span>
        </div>

        <div>
          {ad.mediaUrl && (
            <div className="w-full h-44 mb-3.5 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {ad.mediaType === 'video' ? (
                <video
                  src={ad.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={ad.mediaUrl}
                  alt={ad.businessName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              )}
            </div>
          )}

          <h3 className="text-base font-black font-hindi text-gray-900 dark:text-white line-clamp-2">
            {ad.businessName}
          </h3>

          {ad.about && (
            <p className="text-xs text-gray-600 dark:text-gray-300 font-hindi mt-2 line-clamp-3 leading-relaxed">
              {ad.about}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-gray-400 font-semibold">
            स्थानीय व्यावसायिक प्रचार
          </span>
          {renderActionButtons('small')}
        </div>
      </div>
    );
  }

  // 3. INSIDE ARTICLE LAYOUT
  return (
    <div className="my-6 p-4 rounded-2xl bg-amber-50 dark:bg-gray-850 border border-amber-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
          विज्ञापन
        </span>
        <span className="text-[10px] text-gray-400">आर्यन न्यूज़ विज्ञापन नेटवर्क</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {ad.mediaUrl && (
          <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-200">
            {ad.mediaType === 'video' ? (
              <video src={ad.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={ad.mediaUrl} alt={ad.businessName} className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-sm sm:text-base font-black font-hindi text-gray-900 dark:text-white">
            {ad.businessName}
          </h4>
          {ad.about && (
            <p className="text-xs text-gray-600 dark:text-gray-300 font-hindi mt-1">
              {ad.about}
            </p>
          )}
        </div>

        <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
          {renderActionButtons('normal')}
        </div>
      </div>
    </div>
  );
}
