import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { MANDI_NOTICE } from '../data/mandiRates';

export default function MandiModal({ isOpen, onClose, rates = [], lastUpdatedAt = null }) {
  if (!isOpen) return null;

  const isToday = (isoStr) => {
    if (!isoStr) return false;
    const d = new Date(isoStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth() === now.getMonth() &&
           d.getDate() === now.getDate();
  };

  const updatedToday = isToday(lastUpdatedAt);
  const formattedDate = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const handleShare = () => {
    const dateText = updatedToday
      ? `आज (${formattedDate})`
      : `${formattedDate || 'पूर्व रिकॉर्ड'} (आज के नए भाव प्रतीक्षित)`;
    let text = `*🌾 कृषि उपज मंडी समिति ब्यावर - दैनिक भाव चार्ट*\nदिनांक: ${dateText}\nस्थिति: ${updatedToday ? MANDI_NOTICE.status : 'आज के नए भाव प्रतीक्षित'}\n\n`;
    rates.forEach(r => {
      text += `📍 *${r.cropHi}*: ₹${r.minPrice} से ₹${r.maxPrice} ${r.unit} (${r.change})\n`;
    });
    text += `\nस्रोत: आर्यन न्यूज़ एजेंसी, ब्यावर (राजस्थान)\nवेबसाइट: https://www.aryannewsagency.com/`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              🌾
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-hindi">
                {MANDI_NOTICE.marketName}
              </h3>
              <p className="text-xs text-emerald-200">
                {updatedToday
                  ? `दैनिक भाव बुलेटिन • दिनांक: ${formattedDate}`
                  : `दैनिक भाव बुलेटिन • अंतिम अपडेट: ${formattedDate || 'पूर्व भाव'}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner */}
        <div className={`px-4 py-3 text-xs font-semibold flex items-center justify-between border-b ${
          updatedToday 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900' 
            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${updatedToday ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span>
              {updatedToday 
                ? 'स्थिति: मंडी खुली है • आज के ताज़ा भाव दर्ज हैं' 
                : `⚠️ आज के नए मंडी भाव अभी दर्ज नहीं हुए हैं (अंतिम दर्ज: ${formattedDate || 'पूर्व रिकॉर्ड'})।`}
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
            आर्यन न्यूज़ एजेंसी द्वारा सत्यापित
          </span>
        </div>

        {/* Rates Table */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="pb-3">जिंस / फसल (Crop)</th>
                <th className="pb-3 text-right">न्यूनतम भाव (Min)</th>
                <th className="pb-3 text-right">अधिकतम भाव (Max)</th>
                <th className="pb-3 text-right">इकाई</th>
                <th className="pb-3 text-center">रुझान (Trend)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rates.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="py-3 font-semibold text-gray-900 dark:text-gray-100 font-hindi">
                    {row.cropHi}
                    <span className="block text-[11px] text-gray-400 font-normal">
                      {row.cropEn}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-medium text-gray-700 dark:text-gray-300">
                    ₹{row.minPrice.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{row.maxPrice.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-xs text-gray-500">
                    {row.unit}
                  </td>
                  <td className="py-3 text-center">
                    {row.trend === 'up' && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-bold">
                        <TrendingUp className="w-3 h-3" />
                        {row.change}
                      </span>
                    )}
                    {row.trend === 'down' && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-red-600 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full font-bold">
                        <TrendingDown className="w-3 h-3" />
                        {row.change}
                      </span>
                    )}
                    {row.trend === 'stable' && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-medium">
                        <Minus className="w-3 h-3" />
                        स्थिर
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer CTAs */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500">
            * भाव दैनिक आवक और गुणवत्ता के अनुसार मंडी में तय होते हैं।
          </p>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>व्हाट्सएप पर शेयर करें</span>
          </button>
        </div>

      </div>
    </div>
  );
}
