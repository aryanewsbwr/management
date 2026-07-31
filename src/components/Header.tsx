'use client';

import React, { useState } from 'react';
import { Menu, Calendar, Globe } from 'lucide-react';

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [period, setPeriod] = useState({
    activeMonth: 'July',
    startYear: 2026,
    endYear: 2027
  });

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
          <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">Aryan News Agency</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            PaperFlow Pro
          </span>
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
