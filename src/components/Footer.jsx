import React from 'react';
import { AGENCY_INFO } from '../data/categories';

export default function Footer({ onSelectCategory, onOpenSubmitNews, onOpenLegal, lang = 'hi' }) {
  return (
    <footer className="bg-[#18181b] text-gray-300 pt-10 pb-20 lg:pb-12 border-t border-gray-800 transition-colors font-hindi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* 3-COLUMN MOCKUP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          
          {/* Col 1: Identity & Address */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-white font-hindi">
              आर्यन न्यूज़ एजेंसी
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              नेताजी सुभाष मार्ग, पुराने बस स्टैंड के पास, ब्यावर – 305901 (राजस्थान)
            </p>
          </div>

          {/* Col 2: Contact & Editor */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              संपर्क
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 font-semibold">
              संपादक: हिमांशु अग्रवाल
            </p>
            <p className="text-xs text-gray-400">
              <a href="mailto:info@aryannewsagency.com" className="hover:text-red-400 transition font-mono">
                info@aryannewsagency.com
              </a>
            </p>
            <p className="text-xs text-gray-400 font-mono">
              <a href="tel:+919887500875" className="hover:text-emerald-400 transition">
                +91 9887500875
              </a>
            </p>
          </div>

          {/* Col 3: Legal & Attribution */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm font-semibold text-gray-300">
              <button 
                onClick={() => onOpenLegal && onOpenLegal('about')} 
                className="hover:text-red-400 transition"
              >
                हमारे बारे में
              </button>
              <span className="text-gray-600">|</span>
              <button 
                onClick={() => onOpenLegal && onOpenLegal('grievance')} 
                className="hover:text-red-400 transition"
              >
                शिकायत निवारण
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300">
              <button 
                onClick={() => onOpenLegal && onOpenLegal('terms')} 
                className="hover:text-red-400 transition"
              >
                नियम व शर्तें
              </button>
              <span className="text-gray-500">·</span>
              <button 
                onClick={() => onOpenLegal && onOpenLegal('privacy')} 
                className="hover:text-red-400 transition"
              >
                गोपनीयता नीति
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed pt-1">
              अन्य प्रकाशकों की खबरों के शीर्षक और संक्षिप्त सार मूल स्रोत के लिंक के साथ दिखाए जाते हैं। सभी अधिकार मूल प्रकाशकों के हैं।
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} Aryan News Agency (आर्यन न्यूज़ एजेंसी, ब्यावर). सर्वाधिकार सुरक्षित।</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-400 text-[11px]">डिजिटल समाचार संस्करण • 1940 से आपके साथ</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
