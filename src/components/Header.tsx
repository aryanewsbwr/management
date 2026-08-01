'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building, 
  Newspaper, 
  MapPin, 
  Truck, 
  Users, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  Receipt, 
  PauseCircle, 
  Scissors, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Printer,
  ChevronDown,
  Layers
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const masterItems = [
    { num: '1', eng: '1. Publisher Info', hindi: 'प्रकाशक जानकारी', href: '/publishers', icon: Building },
    { num: '2', eng: '2. Publication Info', hindi: 'अखबार एवं दर जानकारी', href: '/publications', icon: Newspaper },
    { num: '3', eng: '3. Region Details', hindi: 'क्षेत्र / जोन विवरण', href: '/regions', icon: MapPin },
    { num: '4', eng: '4. Hawker Details', hindi: 'हॉकर विवरण', href: '/hawkers', icon: Truck },
    { num: '5', eng: '5. Customer Info', hindi: 'ग्राहक विवरण', href: '/customers', icon: Users },
    { num: '6', eng: '6. Rate Changes Info', hindi: 'दर बदलाव लॉग', href: '/ratechanges', icon: DollarSign },
    { num: '7', eng: '7. Define Holiday', hindi: 'त्यौहार / छुट्टी', href: '/holidays', icon: Calendar },
  ];

  const transactionItems = [
    { num: '8', eng: '8. Purchase Invoice', hindi: 'अखबार खरीद', href: '/purchases', icon: ShoppingBag },
    { num: '9', eng: '9. Retail Sale', hindi: 'काउंटर नकद बिक्री', href: '/countersales', icon: Receipt },
    { num: '10', eng: '10. Discontinue Info', hindi: 'ग्राहक वैकेशन (छुट्टी)', href: '/discontinue', icon: PauseCircle },
    { num: '11', eng: '11. Press Suspensions', hindi: 'बंद अखबार सस्पेंशन', href: '/presssuspensions', icon: Scissors },
    { num: '12', eng: '12. Receipt Allotment', hindi: 'रसीद बुक आवंटन', href: '/receiptallotment', icon: BookOpen },
    { num: '13', eng: '13. Payment Receipt', hindi: 'भुगतान रसीद प्रविष्टि', href: '/receipts', icon: CreditCard },
    { num: '14', eng: '14. Bill Processing', hindi: 'महीने का बिल जनरेट करें', href: '/billing', icon: FileText },
  ];

  const reportItems = [
    { num: '15', eng: '15. Hawker Daily Sheet', hindi: 'हॉकर वितरण पत्र', href: '/reports?tab=hawker_sheet', icon: Truck },
    { num: '16', eng: '16. Sticker Printing', hindi: 'ग्राहक एड्रेस स्टिकर', href: '/reports?tab=stickers', icon: Printer },
    { num: '17', eng: '17. Collector Dues Ledger', hindi: 'रिकवरी लेजर', href: '/reports?tab=collector_dues', icon: FileText },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white select-none sticky top-0 z-[100] shadow-md">
      {/* Top Title Bar */}
      <div className="px-5 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-black text-base text-white tracking-wide uppercase leading-tight flex items-center gap-2">
              <span>ARYAN NEWS AGENCY</span>
              <span className="text-xs text-slate-400 font-semibold">(आर्यन न्यूज़ एजेंसी)</span>
            </h1>
            <p className="text-xs text-indigo-300 font-bold">2008 Desktop Edition — Clean Full Screen Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-800 text-slate-200 px-3 py-1 rounded border border-slate-700 font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Financial Period: July 2026</span>
          </div>
          <div className="bg-emerald-950 text-emerald-300 px-3 py-1 rounded border border-emerald-800 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>System Active</span>
          </div>
        </div>
      </div>

      {/* Main Top Header Dropdown Navigation Bar (English Primary) */}
      <nav ref={dropdownRef} className="px-5 py-1 flex items-center gap-3 bg-slate-950 text-xs font-bold border-b border-slate-800 relative">
        <Link
          href="/"
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            pathname === '/' ? 'bg-indigo-600 text-white font-black' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Main Menu (मुख्य मेनू)</span>
        </Link>

        {/* 1. Master Menu Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setOpenDropdown('master')}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === 'master' ? null : 'master')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              openDropdown === 'master' ? 'bg-indigo-600 text-white font-black' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📁 1. Master Menu (मास्टर)</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {openDropdown === 'master' && (
            <div className="absolute left-0 top-full pt-1 w-80 z-[999] shadow-2xl">
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-2 space-y-1 shadow-2xl">
                <div className="px-2.5 py-1 text-[10px] font-black text-indigo-400 uppercase border-b border-slate-800">
                  Master Directories
                </div>
                {masterItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.num}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-100 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="truncate">
                          <span>{item.eng}</span>
                          <span className="text-[11px] text-slate-400 block font-normal">({item.hindi})</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
                        #{item.num}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Transactions Menu Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setOpenDropdown('trans')}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === 'trans' ? null : 'trans')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              openDropdown === 'trans' ? 'bg-indigo-600 text-white font-black' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>💼 2. Transactions Menu (लेन-देन)</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {openDropdown === 'trans' && (
            <div className="absolute left-0 top-full pt-1 w-80 z-[999] shadow-2xl">
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-2 space-y-1 shadow-2xl">
                <div className="px-2.5 py-1 text-[10px] font-black text-indigo-400 uppercase border-b border-slate-800">
                  Transaction Entries
                </div>
                {transactionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.num}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-100 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="truncate">
                          <span>{item.eng}</span>
                          <span className="text-[11px] text-slate-400 block font-normal">({item.hindi})</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
                        #{item.num}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Reports & Printing Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setOpenDropdown('reports')}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === 'reports' ? null : 'reports')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              openDropdown === 'reports' ? 'bg-indigo-600 text-white font-black' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📊 3. Reports & Printing (प्रिंट)</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {openDropdown === 'reports' && (
            <div className="absolute left-0 top-full pt-1 w-80 z-[999] shadow-2xl">
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-2 space-y-1 shadow-2xl">
                <div className="px-2.5 py-1 text-[10px] font-black text-indigo-400 uppercase border-b border-slate-800">
                  Reports & Sticker Labels
                </div>
                {reportItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.num}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-100 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="truncate">
                          <span>{item.eng}</span>
                          <span className="text-[11px] text-slate-400 block font-normal">({item.hindi})</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
                        #{item.num}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
