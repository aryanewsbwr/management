'use client';

import React, { useState } from 'react';
import { Menu, Calendar, Globe, Layers, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const legacyScreensList = [
  { id: 1, name: 'Publisher Info (Screen 1)', href: '/publications?tab=publishers' },
  { id: 2, name: 'Publication Info (Screen 2)', href: '/publications?tab=active' },
  { id: 3, name: 'Region Details (Screen 3)', href: '/hawkers?tab=regions' },
  { id: 4, name: 'Hawker Details (Screen 4)', href: '/hawkers?tab=hawkers' },
  { id: 5, name: 'Customer Info (Screen 5)', href: '/customers?tab=customers' },
  { id: 6, name: 'Rate Changes Info (Screen 6)', href: '/publications?tab=ratechanges' },
  { id: 7, name: 'Define Holiday (Screen 7)', href: '/publications?tab=holidays' },
  { id: 8, name: 'Purchase Invoice (Screen 8)', href: '/countersales?tab=purchases' },
  { id: 9, name: 'Retail Sale to Perm. Cust (Screen 9)', href: '/countersales?tab=sales' },
  { id: 10, name: 'Customer Discontinue Info (Screen 10)', href: '/customers?tab=discontinue' },
  { id: 11, name: 'Publication Discontinue (Screen 11)', href: '/publications?tab=suspensions' },
  { id: 12, name: 'Receipt Allotment (Screen 12)', href: '/hawkers?tab=collectors' },
  { id: 13, name: 'Payment Receipt Entry (Screen 13)', href: '/billing?tab=receipts' },
  { id: 14, name: 'Bill Processing by Region (Screen 14)', href: '/billing?tab=bills' },
];

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [period, setPeriod] = useState({
    activeMonth: 'July',
    startYear: 2026,
    endYear: 2027
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-slate-900 tracking-wide uppercase">Aryan News Agency</span>
          
          {/* Quick Screen Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Select Legacy Screen (1-15)</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 max-h-80 overflow-y-auto space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 mb-1">
                  15 Legacy Software Options:
                </div>
                {legacyScreensList.map((screen) => (
                  <Link
                    key={screen.id}
                    href={screen.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    {screen.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Financial Period Header (Screenshot 15) */}
      <div className="flex items-center gap-3 text-xs">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-slate-500">Period:</span>
          <select
            value={period.activeMonth}
            onChange={(e) => setPeriod({ ...period, activeMonth: e.target.value })}
            className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <span className="font-bold text-indigo-700">({period.startYear}-{period.endYear})</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px] bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
          <Globe className="w-3 h-3" />
          <span>Cloud Active</span>
        </div>
      </div>
    </header>
  );
}
