import React from 'react';
import { 
  MapPin, Phone, Mail, Globe, Share2, ShieldCheck, 
  ExternalLink, Heart, Send 
} from 'lucide-react';
import { AGENCY_INFO, CATEGORIES } from '../data/categories';

export default function Footer({ onSelectCategory, onOpenSubmitNews, lang = 'hi' }) {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-10 pb-20 lg:pb-10 border-t border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* TOP BRANDING & CONTACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shrink-0 overflow-hidden border border-gray-700">
                <img src="/logo.png" alt="Aryan News Agency Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-hindi">
                  {AGENCY_INFO.nameHi}
                </h3>
                <span className="text-xs text-red-400 font-semibold">
                  {AGENCY_INFO.nameEn}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-hindi">
              ब्यावर व संपूर्ण राजस्थान का प्रमुख डिजिटल समाचार मंच। निष्पक्ष, सटीक और सबसे तेज स्थानीय व राष्ट्रीय समाचार कवरेज।
            </p>

            <div className="pt-1">
              <a
                href={`https://wa.me/${AGENCY_INFO.whatsapp}?text=${encodeURIComponent('नमस्ते आर्यन न्यूज़ एजेंसी, मुझे विज्ञापन देना है।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>विज्ञापन / प्रेस रिलीज संपर्क</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              समाचार श्रेणियां
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id)}
                  className="text-left text-gray-400 hover:text-red-400 transition py-1"
                >
                  • {lang === 'hi' ? c.nameHi : c.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Contact & Address in Beawar */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              कार्यालय संपर्क
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{AGENCY_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${AGENCY_INFO.phonePrimary}`} className="hover:text-white transition">
                  {AGENCY_INFO.phonePrimary} / {AGENCY_INFO.phoneLandline}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${AGENCY_INFO.email}`} className="hover:text-white transition">
                  {AGENCY_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="https://www.aryannewsagency.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  {AGENCY_INFO.domain}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Google Maps & Verification */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              गूगल मैप्स व स्थान
            </h4>
            <div className="bg-gray-900 p-3 rounded-xl border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>गूगल प्रमाणित व्यापार प्रोफ़ाइल</span>
              </div>
              <p className="text-[11px] text-gray-400">
                आर्यन न्यूज़ एजेंसी, नेताजी सुभाष मार्ग, ब्यावर (राज.)
              </p>
              <a
                href="https://share.google/Ym10Z0EfA9LH3UnfV"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 pt-1"
              >
                <span>गूगल मैप्स पर देखें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="mt-3">
              <button
                onClick={onOpenSubmitNews}
                className="w-full text-center text-xs font-bold text-white bg-red-700/80 hover:bg-red-600 py-2 rounded-xl transition"
              >
                नागरिक पत्रकारिता: अपनी खबर भेजें
              </button>
            </div>
          </div>

        </div>

        {/* COPYRIGHT & FAIR DEALING DISCLAIMER */}
        <div className="mt-8 p-4 rounded-2xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 leading-relaxed font-hindi space-y-2">
          <p className="font-bold text-gray-300">
            ⚖️ कॉपीराइट एवं स्रोत अस्वीकरण (Copyright & Fair Dealing Notice):
          </p>
          <p>
            आर्यन न्यूज़ एजेंसी (aryannewsagency.com) पर प्रकाशित ब्यावर व स्थानीय समाचार हमारे संवाददाताओं द्वारा तैयार किए जाते हैं। राष्ट्रीय, अंतरराष्ट्रीय, प्रादेशिक व खेल समाचारों के शीर्षक, संक्षिप्त अंश एवं चित्र केवल जनहित व समसामयिक समीक्षा हेतु मूल प्रकाशकों (जैसे दैनिक भास्कर, बीबीसी हिन्दी आदि) के सार्वजनिक आरएसएस (RSS) माध्यम से भारतीय कॉपीराइट अधिनियम, 1957 की धारा 52 के "उचित उपयोग" (Fair Dealing) प्रावधानों के अंतर्गत स्रोत के स्पष्ट आभार के साथ प्रदर्शित किए जाते हैं।
          </p>
          <p>
            समस्त बौद्धिक संपदा अधिकार एवं ट्रेडमार्क उनके संबंधित मूल प्रकाशकों के पास पूर्णतः सुरक्षित हैं। पाठकों की सुविधा के लिए प्रत्येक समाचार पर मूल प्रकाशक की आधिकारिक वेबसाइट का सीधा लिंक ("मूल स्रोत पर पूरी खबर पढ़ें") प्रदान किया जाता है। किसी भी सामग्री या कॉपीराइट से संबंधित जानकारी अथवा आपत्ति हेतु कृपया <a href="mailto:aryannewsagency@gmail.com" className="text-red-400 underline font-sans">aryannewsagency@gmail.com</a> पर संपर्क करें।
          </p>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-gray-300">Aryan News Agency (आर्यन न्यूज़ एजेंसी)</strong>. सर्वाधिकार सुरक्षित।
          </p>

          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300 cursor-pointer">नियम व शर्तें</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">गोपनीयता नीति</span>
            <span>•</span>
            <span className="text-gray-600">ब्यावर, राजस्थान</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
