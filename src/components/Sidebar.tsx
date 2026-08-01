'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  FileText, 
  ShoppingBag,
  BarChart3,
  X,
  Newspaper,
  BookOpen,
  Calendar,
  DollarSign,
  Receipt,
  PauseCircle,
  Scissors,
  Tag,
  CreditCard,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';

const simpleNavGroups = [
  {
    title: 'मास्टर जानकारी (MASTER)',
    items: [
      { num: '1', name: 'Publisher Info', hindi: '1. प्रकाशक जानकारी', href: '/publishers', icon: Building },
      { num: '2', name: 'Publication Info', hindi: '2. अखबार एवं दर', href: '/publications', icon: Newspaper },
      { num: '3', name: 'Region Details', hindi: '3. क्षेत्र / जोन विवरण', href: '/regions', icon: MapPin },
      { num: '4', name: 'Hawker Details', hindi: '4. हॉकर विवरण', href: '/hawkers', icon: Truck },
      { num: '5', name: 'Customer Info', hindi: '5. ग्राहक विवरण', href: '/customers', icon: Users },
      { num: '6', name: 'Rate Changes Info', hindi: '6. दर बदलाव लॉग', href: '/ratechanges', icon: DollarSign },
      { num: '7', name: 'Define Holiday', hindi: '7. त्यौहार / छुट्टी', href: '/holidays', icon: Calendar },
    ]
  },
  {
    title: 'लेन-देन (TRANSACTIONS)',
    items: [
      { num: '8', name: 'Purchase Invoice', hindi: '8. अखबार खरीद', href: '/purchases', icon: ShoppingBag },
      { num: '9', name: 'Retail OTC Sale', hindi: '9. नकद बिक्री', href: '/countersales', icon: Receipt },
      { num: '10', name: 'Discontinue Info', hindi: '10. ग्राहक वैकेशन', href: '/discontinue', icon: PauseCircle },
      { num: '11', name: 'Press Suspensions', hindi: '11. बंद अखबार रोक', href: '/presssuspensions', icon: Scissors },
      { num: '12', name: 'Receipt Allotment', hindi: '12. रसीद बुक आवंटन', href: '/receiptallotment', icon: BookOpen },
      { num: '13', name: 'Payment Receipt', hindi: '13. भुगतान रसीद', href: '/receipts', icon: CreditCard },
      { num: '14', name: 'Bill Processing', hindi: '14. महीने का बिल', href: '/billing', icon: FileText },
    ]
  },
  {
    title: 'रिपोर्ट्स एवं प्रिंट (REPORTS)',
    items: [
      { num: '15', name: 'Reports & Stickers', hindi: '15. प्रिंट एवं रिपोर्ट', href: '/reports', icon: BarChart3 },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static top-0 left-0 bottom-0 w-64 bg-slate-950 text-slate-100 border-r border-slate-800 
        flex flex-col h-screen z-50 transition-transform duration-200 shadow-2xl select-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-white text-xs tracking-wider uppercase block">आर्यन न्यूज़ एजेंसी</span>
              <span className="text-[10px] text-indigo-400 font-bold">Aryan News Desktop</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dashboard Home Link */}
        <div className="p-2.5 border-b border-slate-800">
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
              pathname === '/' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>मुख्य मेनू (Main Menu)</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto custom-scrollbar">
          {simpleNavGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-black text-indigo-400 tracking-widest uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        <span className="truncate">{item.hindi}</span>
                      </div>

                      <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-indigo-700 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        #{item.num}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <span className="font-bold text-slate-400">2008 VB6 Legacy Mode</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Local Active
          </span>
        </div>
      </aside>
    </>
  );
}
