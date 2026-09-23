import React, { useState } from 'react';
import { X, Send, Image, MessageSquare, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { AGENCY_INFO } from '../data/categories';

export default function SubmitNewsModal({ isOpen, onClose }) {
  const [senderName, setSenderName] = useState('');
  const [senderArea, setSenderArea] = useState('');
  const [newsType, setNewsType] = useState('news'); // 'news' | 'ad' | 'event'
  const [newsText, setNewsText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newsText.trim()) return;

    const label = newsType === 'ad' ? 'विज्ञापन पूछताछ' : newsType === 'event' ? 'कार्यक्रम सूचना' : 'नागरिक समाचार / फोटो';

    const message = 
`*📢 ${label} - आर्यन न्यूज़ एजेंसी (ब्यावर)*\n\n` +
`• *प्रेषक का नाम:* ${senderName || 'नाम गोपनीय रखें'}\n` +
`• *क्षेत्र / इलाका:* ${senderArea || 'ब्यावर'}\n` +
`• *विवरण:* ${newsText}\n\n` +
`_कृपया इस खबर/विज्ञापन का संज्ञान लें व प्रकाशित करें।_`;

    window.open(`https://api.whatsapp.com/send?phone=${AGENCY_INFO.whatsapp}&text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-brand-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-base sm:text-lg font-bold font-hindi">
                अपनी खबर या सूचना भेजें
              </h3>
              <p className="text-xs text-red-100">
                सीधे आर्यन न्यूज़ एजेंसी ब्यावर की डेस्क तक पहुंचाएं
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            क्या आपके पास ब्यावर या आसपास के क्षेत्र की कोई ताज़ा खबर, जनसमस्या, सामाजिक कार्यक्रम या विज्ञापन है? नीचे विवरण भरकर हमारे व्हाट्सएप नंबर पर भेजें।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                आपका नाम
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="उदा. राजेश शर्मा"
                className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                स्थान / इलाका
              </label>
              <input
                type="text"
                value={senderArea}
                onChange={(e) => setSenderArea(e.target.value)}
                placeholder="उदा. चांग गेट / सेंदड़ा रोड"
                className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              सूचना का प्रकार
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNewsType('news')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                  newsType === 'news'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                📰 ताज़ा खबर
              </button>
              <button
                type="button"
                onClick={() => setNewsType('event')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                  newsType === 'event'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                🎉 आयोजन / उत्सव
              </button>
              <button
                type="button"
                onClick={() => setNewsType('ad')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                  newsType === 'ad'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                📢 विज्ञापन
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              खबर का पूरा विवरण *
            </label>
            <textarea
              required
              rows={4}
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              placeholder="घटना की पूरी जानकारी, समय और आवश्यक बातें लिखें..."
              className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
            💡 <strong>नोट:</strong> सबमिट करने के बाद व्हाट्सएप खुलेगा, जहाँ आप घटना की फोटो या वीडियो भी अटैच कर सकते हैं।
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-md transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>व्हाट्सएप पर खबर भेजें</span>
          </button>
        </form>

      </div>
    </div>
  );
}
