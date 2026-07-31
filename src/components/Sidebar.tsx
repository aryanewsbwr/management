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

const menuGroups = [
  {
    title: 'MASTER DIRECTORIES',
    items: [
      { name: 'Publishers Directory', href: '/publications?tab=publishers', icon: Building, badge: 'Sc 01' },
      { name: 'Active Publications & Rates', href: '/publications?tab=active', icon: Newspaper, badge: 'Sc 02' },
      { name: 'Region Master', href: '/hawkers?tab=regions', icon: MapPin, badge: 'Sc 03' },
      { name: 'Hawker Delivery Boys', href: '/hawkers?tab=hawkers', icon: Truck, badge: 'Sc 04' },
      { name: 'Customer Directory', href: '/customers?tab=customers', icon: Users, badge: 'Sc 05' },
      { name: 'Rate Changes Log', href: '/publications?tab=ratechanges', icon: DollarSign, badge: 'Sc 06' },
      { name: 'Holidays Calendar', href: '/publications?tab=holidays', icon: Calendar, badge: 'Sc 07' },
    ]
  },
  {
    title: 'TRANSACTIONS & ENTRY',
    items: [
      { name: 'Publisher Stock Purchases', href: '/countersales?tab=purchases', icon: ShoppingBag, badge: 'Sc 08' },
      { name: 'Retail OTC Sales', href: '/countersales?tab=sales', icon: Receipt, badge: 'Sc 09' },
      { name: 'Vacation Discontinues', href: '/customers?tab=discontinue', icon: PauseCircle, badge: 'Sc 10' },
      { name: 'Press Suspensions', href: '/publications?tab=suspensions', icon: Scissors, badge: 'Sc 11' },
      { name: 'Receipt Book Allotment', href: '/hawkers?tab=collectors', icon: BookOpen, badge: 'Sc 12' },
      { name: 'Payment Receipts Log', href: '/billing?tab=receipts', icon: CreditCard, badge: 'Sc 13' },
      { name: 'Bill Processing Engine', href: '/billing?tab=bills', icon: FileText, badge: 'Sc 14' },
    ]
  },
  {
    title: 'REPORTS & PRINTING',
    items: [
      { name: 'Hawker Daily Sheet', href: '/reports?tab=hawker_sheet', icon: Truck, badge: 'Daily' },
      { name: 'Address Sticker Labels', href: '/reports?tab=stickers', icon: Tag, badge: 'Print' },
      { name: 'Collector Dues Ledger', href: '/reports?tab=collector_dues', icon: BarChart3, badge: 'Ledger' },
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
        fixed md:static top-0 left-0 bottom-0 w-64 bg-slate-950 text-slate-100 border-r border-slate-800/80 
        flex flex-col h-screen z-50 transition-transform duration-200 shadow-2xl select-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-white text-xs tracking-wider uppercase block">Aryan News</span>
              <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> PaperFlow Enterprise
              </span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dashboard Link */}
        <div className="p-2.5 border-b border-slate-800/60">
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              pathname === '/' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Dashboard Overview</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href.split('?')[0];

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-200 font-bold border border-indigo-500/30 shadow-xs'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap shrink-0">
                        {item.badge}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <span className="font-medium text-slate-500">Real SQL Import Active</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Synced
          </span>
        </div>
      </aside>
    </>
  );
}
