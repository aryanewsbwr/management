import React from 'react';
import { Home, MapPin, Zap, Landmark, Menu } from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  onSelectTab,
  onOpenQuickRead,
  onOpenMobileMenu
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe shadow-2xl">
      <div className="flex items-center justify-around py-1.5 px-2">
        
        {/* Home */}
        <button
          onClick={() => onSelectTab('all')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeTab === 'all'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">होम</span>
        </button>

        {/* Beawar Local */}
        <button
          onClick={() => onSelectTab('beawar')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeTab === 'beawar'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <MapPin className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="text-[10px] mt-0.5">ब्यावर</span>
        </button>

        {/* Quick Read / Shorts */}
        <button
          onClick={onOpenQuickRead}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-red-600 transition -mt-3"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-gray-800 dark:text-gray-200">शॉर्ट्स</span>
        </button>

        {/* Rajasthan */}
        <button
          onClick={() => onSelectTab('rajasthan')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeTab === 'rajasthan'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Landmark className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">राजस्थान</span>
        </button>

        {/* Categories / Menu */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 transition"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">मेन्यू</span>
        </button>

      </div>
    </div>
  );
}
