import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check, Settings } from 'lucide-react';

export default function CookieConsent({ onOpenCookiePolicy }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('ana_cookie_consent');
      if (!consent) {
        // Show banner after brief delay for smooth entrance
        const timer = setTimeout(() => setShowBanner(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage may fail in private mode
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('ana_cookie_consent', 'accepted');
      localStorage.setItem('ana_cookie_date', new Date().toISOString());
    } catch (e) {}
    setShowBanner(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('ana_cookie_consent', 'essential_only');
      localStorage.setItem('ana_cookie_date', new Date().toISOString());
    } catch (e) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 animate-in fade-in slide-in-from-bottom duration-500 pointer-events-none font-hindi">
      <div className="max-w-4xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Icon & Text */}
          <div className="flex items-start gap-2.5 flex-1">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>कुकी एवं डेटा उपयोग सहमति</span>
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  सुरक्षित अनुभव
                </span>
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 leading-snug">
                हम आपके पठन अनुभव (डार्क मोड, बुकमार्क, आदि) हेतु आवश्यक कुकीज़ का उपयोग करते हैं।
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
            <button
              onClick={() => {
                setShowBanner(false);
                onOpenCookiePolicy?.();
              }}
              className="px-2 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition"
            >
              नीति पढ़ें
            </button>

            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition active:scale-95"
            >
              केवल आवश्यक
            </button>

            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition active:scale-95"
            >
              <Check className="w-3 h-3" />
              <span>स्वीकार करें</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
