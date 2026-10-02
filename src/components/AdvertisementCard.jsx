import React from 'react';
import { PhoneCall, MessageCircle, MapPin, Globe, ExternalLink, Sparkles, Megaphone } from 'lucide-react';
import { AGENCY_INFO } from '../data/categories';
import { StorageService } from '../services/storage';

export default function AdvertisementCard({ ad = null, layout = 'banner' }) {
  // If no custom ad provided, show the default Agency Booking Banner for 'banner' layout
  if (!ad) {
    if (layout !== 'banner') return null;

    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 my-4">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-2xl p-3 sm:p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-3xl">🪔</span>
            <div>
              <span className="bg-black/25 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                विज्ञापन
              </span>
              <h4 className="text-sm sm:text-base font-black font-hindi mt-0.5">
                ब्यावर की विश्वप्रसिद्ध कूटवां तिलपत्ती एवं गजक - सीधे निर्माता से प्राप्त करें
              </h4>
              <p className="text-xs text-amber-100">
                {AGENCY_INFO.nameHi} विज्ञापन सेवा • प्रचार हेतु संपर्क: {AGENCY_INFO.phonePrimary}
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('नमस्ते आर्यन न्यूज़ एजेंसी, मुझे विज्ञापन देना है।')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-900 hover:bg-amber-50 font-black text-xs px-4 py-2 rounded-xl shadow transition active:scale-95 shrink-0"
          >
            विज्ञापन बुक करें
          </a>
        </div>
      </div>
    );
  }

  const handleAction = (e) => {
    e.stopPropagation();
    // Track click analytics in background
    if (ad.id) {
      StorageService.incrementAdClick(ad.id);
    }

    const target = ad.actionTarget || '';
    if (ad.actionType === 'call') {
      window.location.href = `tel:${target.replace(/[^0-9+]/g, '')}`;
    } else if (ad.actionType === 'whatsapp') {
      const cleanPhone = target.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(`नमस्ते ${ad.businessName}, मैंने आर्यन न्यूज़ एजेंसी पर आपका विज्ञापन देखा और इस संबंध में जानकारी चाहिए।`);
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    } else if (ad.actionType === 'maps') {
      const url = target.startsWith('http') ? target : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`;
      window.open(url, '_blank');
    } else {
      // Website URL
      const url = target.startsWith('http') ? target : `https://${target}`;
      window.open(url, '_blank');
    }
  };

  const getActionButton = () => {
    switch (ad.actionType) {
      case 'call':
        return (
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition active:scale-95 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>कॉल करें</span>
          </button>
        );
      case 'maps':
        return (
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition active:scale-95 shrink-0"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>लोकेशन देखें</span>
          </button>
        );
      case 'website':
        return (
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition active:scale-95 shrink-0"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>वेबसाइट देखें</span>
          </button>
        );
      case 'whatsapp':
      default:
        return (
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition active:scale-95 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>व्हाट्सएप करें</span>
          </button>
        );
    }
  };

  // 1. TOP WIDE BANNER LAYOUT
  if (layout === 'banner') {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 my-4">
        <div className="bg-gradient-to-r from-red-900 via-gray-900 to-black rounded-2xl p-3 sm:p-4 text-white shadow-lg border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            {getActionButton()}
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

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-semibold">
            स्थानीय व्यावसायिक प्रचार
          </span>
          {getActionButton()}
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

        <div className="shrink-0">
          {getActionButton()}
        </div>
      </div>
    </div>
  );
}
